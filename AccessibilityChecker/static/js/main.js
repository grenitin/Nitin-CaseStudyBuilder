document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const apiKeyInput = document.getElementById('api-key-input');
    const providerSelect = document.getElementById('providerSelect');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingState = document.getElementById('loading-state');
    const resultsContainer = document.getElementById('results-container');
    const inputStack = document.querySelector('.input-stack');

    // Update placeholder based on selected provider
    providerSelect.addEventListener('change', () => {
        const provider = providerSelect.value;
        const nameMap = { 'gemini': 'Gemini', 'openai': 'OpenAI', 'anthropic': 'Anthropic' };
        apiKeyInput.placeholder = `Enter ${nameMap[provider]} API Key`;
    });

    analyzeBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        const provider = providerSelect.value;
        
        if (!url) {
            alert('Please enter a valid URL.');
            return;
        }

        // Show loading state
        inputStack.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        loadingState.classList.remove('hidden');

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url, apiKey: apiKey, provider: provider })
            });

            const data = await response.json();
            
            if (response.ok) {
                renderResults(data);
            } else {
                if (data.screenshot) {
                    renderError(data.error, data.screenshot);
                } else {
                    alert(data.error || 'An error occurred during analysis.');
                    inputStack.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
            inputStack.classList.remove('hidden');
        } finally {
            loadingState.classList.add('hidden');
        }
    });

    function renderError(errorMessage, screenshot) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('hidden');

        const errorHtml = `
            <div class="result-item fail" style="flex-direction: column;">
                <div class="result-header">
                    <div class="result-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <div class="result-content">
                        <h3>Analysis Error</h3>
                        <p>${errorMessage}</p>
                    </div>
                </div>
                <div class="result-media"><img src="/static/${screenshot}" alt="Error screenshot" /></div>
            </div>
            <button class="primary-btn" style="margin-top: 2rem; width: 100%; justify-content: center;" onclick="location.reload()">
                Try Again
            </button>
        `;

        resultsContainer.innerHTML = errorHtml;
    }

    function renderResults(data) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('hidden');

        const pct = data.score + '%';

        const overallStatus = data.score >= 75 ? 'PASS' : 'FAIL';
        const statusColor = data.score >= 75 ? 'var(--success)' : 'var(--error)';

        // Create Score Card
        const scoreHtml = `
            <div class="score-card">
                <h2>Accessibility Score for ${new URL(data.url).hostname}</h2>
                <div class="score-circle" style="--score-pct: ${pct}">
                    <span>${data.score}</span>
                </div>
                <div class="overall-status" style="color: ${statusColor}; font-weight: 800; font-size: 1.5rem; letter-spacing: 2px; margin-top: 1rem;">
                    ${overallStatus}
                </div>
            </div>
        `;
        
        let resultsHtml = '';
        data.results.forEach(result => {
            const icon = result.status === 'pass' 
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

            let mediaHtml = '';
            if (result.screenshot) {
                mediaHtml = `<div class="result-media"><img src="/static/${result.screenshot}" alt="Issue screenshot" /></div>`;
            }

            let llmHtml = '';
            if (result.problem && result.solution && result.status === 'fail') {
                llmHtml = `
                    <div class="llm-feedback">
                        <div class="feedback-problem"><strong>Problem:</strong> ${result.problem}</div>
                        <div class="feedback-solution"><strong>Solution:</strong> ${result.solution}</div>
                    </div>
                `;
            }

            resultsHtml += `
                <div class="result-item ${result.status}">
                    <div class="result-header">
                        <div class="result-icon">${icon}</div>
                        <div class="result-content">
                            <h3>${result.area}</h3>
                            <p>${result.message}</p>
                        </div>
                    </div>
                    ${mediaHtml}
                    ${llmHtml}
                </div>
            `;
        });

        const resetBtnHtml = `
            <button class="primary-btn" style="margin-top: 2rem; width: 100%; justify-content: center;" onclick="location.reload()">
                Check Another URL
            </button>
        `;

        resultsContainer.innerHTML = scoreHtml + resultsHtml + resetBtnHtml;
    }
});
