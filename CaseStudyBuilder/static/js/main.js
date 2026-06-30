let task_id = null;
let current_case_type = 'redesign';
let current_platform = 'web';
let current_geo = 'International';
let current_theme = 'professional';

document.addEventListener('DOMContentLoaded', () => {
    initSelectionCards();
    initThemeCards();
    initEventListeners();
});

function initThemeCards() {
    const cards = document.querySelectorAll('.theme-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            current_theme = card.dataset.theme;
            
            const pColor = document.getElementById('primary-color');
            const pColorHex = document.getElementById('primary-color-hex');
            const sColor = document.getElementById('secondary-color');
            const sColorHex = document.getElementById('secondary-color-hex');
            
            let newPrimary, newSecondary;
            switch(current_theme) {
                case 'professional': newPrimary = '#1E3A8A'; newSecondary = '#3B82F6'; break;
                case 'modern': newPrimary = '#7C3AED'; newSecondary = '#A78BFA'; break;
                case 'minimalist': newPrimary = '#111827'; newSecondary = '#4B5563'; break;
                case 'playful': newPrimary = '#F97316'; newSecondary = '#FB923C'; break;
            }
            
            if (pColor && pColorHex && newPrimary) {
                pColor.value = newPrimary;
                pColorHex.value = newPrimary;
            }
            if (sColor && sColorHex && newSecondary) {
                sColor.value = newSecondary;
                sColorHex.value = newSecondary;
            }
            
            // Update previews only to show how the current brand colors look in the new theme
            if (typeof updateThemePreviews === 'function') {
                updateThemePreviews();
            }
        });
    });
}

function initSelectionCards() {
    const cards = document.querySelectorAll('.selection-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            current_case_type = card.dataset.type;
        });
    });
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        card.addEventListener('click', () => {
            platformCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            current_platform = card.dataset.platform;
        });
    });
    const geoCards = document.querySelectorAll('.geo-card');
    geoCards.forEach(card => {
        card.addEventListener('click', () => {
            geoCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            current_geo = card.dataset.geo;
        });
    });
}

function initEventListeners() {
    // Navigation
    document.getElementById('btn-next-to-platform').addEventListener('click', () => {
        showScreen('screen-platform');
    });
    document.getElementById('btn-next-to-geo').addEventListener('click', () => showScreen('screen-geo'));
    document.getElementById('btn-next-to-colors').addEventListener('click', () => showScreen('screen-colors'));
    document.getElementById('btn-next-to-type').addEventListener('click', () => showScreen('screen-case-type'));
    document.getElementById('btn-next-to-artifacts').addEventListener('click', () => showScreen('screen-artifacts'));
    
    // Color Pickers Sync
    const pColor = document.getElementById('primary-color');
    const pColorHex = document.getElementById('primary-color-hex');
    const sColor = document.getElementById('secondary-color');
    const sColorHex = document.getElementById('secondary-color-hex');

    if (pColor && pColorHex) {
        pColor.addEventListener('input', (e) => {
            pColorHex.value = e.target.value;
            updateThemePreviews();
        });
        pColorHex.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                pColor.value = e.target.value;
                updateThemePreviews();
            }
        });
    }
    if (sColor && sColorHex) {
        sColor.addEventListener('input', (e) => {
            sColorHex.value = e.target.value;
            updateThemePreviews();
        });
        sColorHex.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                sColor.value = e.target.value;
                updateThemePreviews();
            }
        });
    }
    
    
    // Start Analysis
    document.getElementById('btn-start-analysis').addEventListener('click', startAnalysis);
    
    // Approval
    document.getElementById('btn-approve').addEventListener('click', () => showScreen('screen-publish'));

    // Upload Zone dummy click
    document.getElementById('upload-zone').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    // Input Validation
    const urlInput = document.getElementById('url-input');
    const nextBtn = document.getElementById('btn-next-to-platform');
    
    urlInput.addEventListener('input', () => {
        nextBtn.disabled = urlInput.value.trim() === '';
    });

    // Preview Scroll Behavior (Fade Overlay)
    const viewport = document.querySelector('.preview-viewport');
    const overlay = document.querySelector('.preview-overlay');
    
    if (viewport && overlay) {
        let isScrolling;
        viewport.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            overlay.classList.add('is-scrolling');
            isScrolling = setTimeout(() => {
                overlay.classList.remove('is-scrolling');
            }, 200);
        });
    }
}

function updateThemePreviews() {
    // Keep theme preview boxes static, do not dynamically override them.
}

function adjustColor(hex, percent) {
    var num = parseInt(hex.replace("#",""),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (B<255?B<0?0:B:255)*0x100 + (G<255?G<0?0:G:255)).toString(16).slice(1);
}

async function analyzeBrandColors() {
    // Disabled auto-overriding colors from background analysis to prevent "hallucinations" and unexpected UI changes
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

async function startAnalysis() {
    const url = document.getElementById('url-input').value;
    const artifacts = Array.from(document.querySelectorAll('.artifact-checkbox-item input:checked')).map(cb => cb.value);
    
    showScreen('screen-process');
    addLog("Preparing your project for analysis...");
    addLog("Connecting to AI engine...");
    
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
                artifacts: artifacts
            })
        });
        
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

function listenToProgress(tid) {
    const eventSource = new EventSource(`/status/${tid}`);
    
    eventSource.onmessage = (event) => {
        const task = JSON.parse(event.data);
        updateUI(task);
        
        if (task.complete) {
            eventSource.close();
            if (task.error) {
                addLog(`Process stopped: ${task.error}`, true);
            } else {
                addLog("Done! Formatting your case study now.");
                setTimeout(() => finalizeResult(tid), 1500);
            }
        }
    };
    
    eventSource.onerror = () => {
        eventSource.close();
        addLog("Connection interrupted. Trying to reconnect...", true);
    };
}

function updateUI(task) {
    const bar = document.getElementById('progress-bar');
    if (task.progress && bar) {
        bar.style.width = `${task.progress}%`;
    }
    if (task.status) {
        addLog(task.status);
    }
}

function addLog(message, isError = false) {
    const logs = document.getElementById('terminal-logs');
    if (!logs) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    if (isError) entry.style.borderLeftColor = '#ef4444';
    entry.textContent = message;
    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
}

async function finalizeResult(tid) {
    try {
        const response = await fetch(`/get_result/${tid}`);
        const data = await response.json();
        
        if (data.preview_url) {
            const frame = document.getElementById('final-case-study-frame');
            if (frame) frame.src = data.preview_url;
            
            const fullBtn = document.getElementById('btn-full-view');
            if (fullBtn) fullBtn.href = data.preview_url;
            
            const publishBtn = document.getElementById('btn-view-final');
            if (publishBtn) publishBtn.href = data.preview_url;
        }
        
        if (data.image_url) {
            const dlBtn = document.getElementById('btn-download');
            if (dlBtn) {
                dlBtn.href = `/download/${tid}`;
                dlBtn.style.display = 'inline-flex';
            }
        } else {
            const dlBtn = document.getElementById('btn-download');
            if (dlBtn) dlBtn.style.display = 'none';
        }
        
        showScreen('screen-preview');
    } catch (err) {
        console.error(err);
        // Handle error/retry
        setTimeout(() => finalizeResult(tid), 2000);
    }
}
