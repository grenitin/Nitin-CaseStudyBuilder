function switchTheme(theme) {
    current_theme = theme;
    // Removed body class toggling here since theme is an aesthetic choice
    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.theme-card[data-theme="${theme}"]`).classList.add('selected');
}

let current_case_type = 'redesign';
let current_platform = 'web';
let current_geo = 'India';
let current_theme = 'dark';
let task_id = null;

function setCaseType(type) {
    current_case_type = type;
    document.querySelectorAll('#screen-case-type .selection-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`#screen-case-type .selection-card[data-type="${type}"]`).classList.add('selected');
}

function setPlatform(platform) {
    current_platform = platform;
    document.querySelectorAll('#screen-platform .selection-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`#screen-platform .selection-card[data-platform="${platform}"]`).classList.add('selected');
}

function setGeo(geo) {
    current_geo = geo;
    document.querySelectorAll('#screen-geo .selection-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`#screen-geo .selection-card[data-geo="${geo}"]`).classList.add('selected');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function addLog(message, isError=false) {
    const term = document.getElementById('terminal-logs');
    const line = document.createElement('div');
    line.className = 'log-entry';
    if(isError) line.style.color = '#ff4d4d'; // Add inline style for error since error class might not exist
    line.innerHTML = `<span class="prompt" style="color: var(--primary);">|</span> ${message}`;
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
}

function updateProgress(percent) {
    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = percent + '%';
    }
}

function parseAndRenderCaseStudy(data) {
    const iframe = document.getElementById('final-case-study-frame');
    if (iframe && data.preview_url) {
        iframe.src = data.preview_url;
    }
    
    // Update button URLs so preview and download actually work
    const btnFullView = document.getElementById('btn-full-view');
    const btnDownload = document.getElementById('btn-download');
    const btnViewFinal = document.getElementById('btn-view-final');
    
    if (btnFullView && data.preview_url) btnFullView.href = data.preview_url;
    if (btnDownload && data.image_url) {
        btnDownload.href = data.image_url;
        btnDownload.onclick = () => {
            if (!window.usageIncremented) {
                fetch('/api/increment-usage', { method: 'POST' });
                window.usageIncremented = true;
            }
        };
    }
    if (btnViewFinal && data.preview_url) {
        btnViewFinal.href = data.preview_url;
        btnViewFinal.onclick = () => {
            if (!window.usageIncremented) {
                fetch('/api/increment-usage', { method: 'POST' });
                window.usageIncremented = true;
            }
        };
    }
}

async function listenToProgress(taskId) {
    const evtSource = new EventSource(`/status/${taskId}`);
    
    evtSource.onmessage = function(e) {
        const data = JSON.parse(e.data);
        addLog(data.status);
        updateProgress(data.progress);
        
        if (data.complete) {
            evtSource.close();
            if (data.error) {
                addLog(`Critical Error during generation: ${data.error}`, true);
            } else {
                addLog("Finalizing case study rendering...");
                setTimeout(() => {
                    fetch(`/get_result/${taskId}`)
                    .then(r => r.json())
                    .then(resData => {
                        parseAndRenderCaseStudy(resData);
                        showScreen('screen-preview');
                    });
                }, 1000);
            }
        }
    };
    
    evtSource.onerror = function() {
        addLog("Connection to AI stream lost.", true);
        evtSource.close();
    };
}

async function startAnalysis() {
    window.usageIncremented = false;
    const url = document.getElementById('url-input').value;
    const artifacts = Array.from(document.querySelectorAll('.artifact-checkbox-item input:checked')).map(cb => cb.value);
    
    try {
        const response = await fetch('/start_analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                case_type: current_case_type,
                platform: current_platform,
                localization: current_geo,
                primary_color: document.getElementById('primary-color').value,
                secondary_color: document.getElementById('secondary-color').value,
                theme: current_theme,
                artifacts: artifacts,
                api_key: document.getElementById('global-api-key').value
            })
        });
        
        if (response.status === 402) {
            const data = await response.json();
            if (data.error === 'LIMIT_REACHED') {
                document.getElementById('premium-popup').classList.add('active');
                return;
            }
        }
        
        // Record usage in localStorage for frontend enforcement
        localStorage.setItem('has_generated_casestudy', 'true');
        
        showScreen('screen-process');
        addLog("Preparing your project for analysis...");
        addLog("Connecting to AI engine...");
        
        const data = await response.json();
        if (data.task_id) {
            task_id = data.task_id;
            listenToProgress(task_id);
        } else {
            addLog("We encountered an issue starting the project.", true);
        }
    } catch (err) {
        addLog(`Technical error: ${err.message}`, true);
    }
}

// Global Accordion HUD Logic
function switchHUDTab(stageId) {
    const allTabs = document.querySelectorAll('.hud-tab-item');
    const allPanels = document.querySelectorAll('.hud-workspace-panel');
    
    // Check if the clicked tab is already active (to toggle it off)
    const clickedTab = document.querySelector(`.hud-tab-item[data-stage="${stageId}"]`);
    const isActive = clickedTab.classList.contains('active');
    
    // Close all panels and deactivate all tabs
    allTabs.forEach(t => t.classList.remove('active'));
    allPanels.forEach(p => p.classList.remove('active'));
    
    // If it wasn't already active, open it
    if (!isActive) {
        clickedTab.classList.add('active');
        document.getElementById(`panel-${stageId}`).classList.add('active');
    }
}

// Automatically close accordion on Artifacts screen load, if desired
// For now, we'll let the user click to open.
document.querySelectorAll('.hud-tab-item').forEach(t => t.classList.remove('active'));
document.querySelectorAll('.hud-workspace-panel').forEach(p => p.classList.remove('active'));

// Open the first one by default for better UX
document.querySelector('.hud-tab-item[data-stage="empathize"]').classList.add('active');
document.getElementById('panel-empathize').classList.add('active');

document.getElementById('btn-next-to-artifacts').addEventListener('click', () => {
    // If colors haven't been picked (default values), run auto-analysis
    const url = document.getElementById('url-input').value;
    const pColor = document.getElementById('primary-color').value;
    const sColor = document.getElementById('secondary-color').value;
    
    if (url && pColor === '#5c62ec' && sColor === '#00d2ff') {
        fetch('/analyze_colors', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: url})
        })
        .then(res => res.json())
        .then(data => {
            if(data.primary) document.getElementById('primary-color').value = data.primary;
            if(data.secondary) document.getElementById('secondary-color').value = data.secondary;
        }).finally(() => {
            showScreen('screen-artifacts');
        });
    } else {
        showScreen('screen-artifacts');
    }
});

// Navigation logic for screens
document.getElementById('url-input').addEventListener('input', function(e) {
    const btn = document.getElementById('btn-next-to-platform');
    if(e.target.value.trim().length > 0) {
        btn.removeAttribute('disabled');
    } else {
        btn.setAttribute('disabled', 'true');
    }
});

document.getElementById('btn-next-to-platform').addEventListener('click', async () => {
    // Check localStorage first
    if (localStorage.getItem('has_generated_casestudy') === 'true') {
        document.getElementById('premium-popup').classList.add('active');
        return;
    }
    
    try {
        const response = await fetch('/check_limit');
        if (response.status === 402) {
            document.getElementById('premium-popup').classList.add('active');
            return;
        }
        showScreen('screen-platform');
    } catch (e) {
        console.error("Error checking limit", e);
        showScreen('screen-platform'); // fallback
    }
});


    const submitKeyBtn = document.getElementById('btn-submit-key');
    if (submitKeyBtn) {
        submitKeyBtn.addEventListener('click', () => {
            const newKey = document.getElementById('popup-api-key').value.trim();
            if (newKey) {
                document.getElementById('global-api-key').value = newKey;
                document.getElementById('premium-popup').classList.remove('active');
                startAnalysis();
            }
        });
    }

document.getElementById('btn-next-to-geo').addEventListener('click', () => {
    showScreen('screen-geo');
});

document.getElementById('btn-next-to-colors').addEventListener('click', () => {
    showScreen('screen-colors');
});

const btnNextType = document.getElementById('btn-next-to-type');
if (btnNextType) {
    btnNextType.addEventListener('click', () => {
        showScreen('screen-case-type');
    });
}

const btnStart = document.getElementById('btn-start-analysis');
if (btnStart) {
    btnStart.addEventListener('click', startAnalysis);
}

// Add click listeners to all selection cards
document.querySelectorAll('.selection-card[data-platform]').forEach(card => {
    card.addEventListener('click', () => {
        setPlatform(card.getAttribute('data-platform'));
    });
});

document.querySelectorAll('.selection-card[data-geo]').forEach(card => {
    card.addEventListener('click', () => {
        setGeo(card.getAttribute('data-geo'));
    });
});

document.querySelectorAll('.selection-card[data-type]').forEach(card => {
    card.addEventListener('click', () => {
        setCaseType(card.getAttribute('data-type'));
    });
});

document.querySelectorAll('.theme-card[data-theme]').forEach(card => {
    card.addEventListener('click', () => {
        switchTheme(card.getAttribute('data-theme'));
    });
});

// API Key Placeholder Animation
const placeholders = ["Paste Gemini Key...", "Paste OpenAI Key...", "Paste Claude Key..."];
let pIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 100;

function animatePlaceholder() {
    const inputs = document.querySelectorAll('.animated-api-input');
    if (!inputs.length) return;
    
    const currentString = placeholders[pIndex];
    
    if (isDeleting) {
        charIndex--;
        typeDelay = 50;
    } else {
        charIndex++;
        typeDelay = 100;
    }
    
    const currentText = currentString.substring(0, charIndex);
    inputs.forEach(input => input.setAttribute('placeholder', currentText));
    
    if (!isDeleting && charIndex === currentString.length) {
        typeDelay = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        pIndex = (pIndex + 1) % placeholders.length;
        typeDelay = 500; // Pause before typing next word
    }
    
    setTimeout(animatePlaceholder, typeDelay);
}
setTimeout(animatePlaceholder, 1000);
