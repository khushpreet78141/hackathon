// popup.js — Controls the popup lifecycle: inject content script, collect data, analyze, render

document.addEventListener('DOMContentLoaded', () => {
    const domainLabel = document.getElementById('domainLabel');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const resultsState = document.getElementById('resultsState');
    const errorMessage = document.getElementById('errorMessage');
    const retryBtn = document.getElementById('retryBtn');

    // Loading step indicators
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const loadingText = document.getElementById('loadingText');

    let currentTab = null;

    retryBtn.addEventListener('click', () => {
        errorState.classList.add('hidden');
        loadingState.classList.remove('hidden');
        resetSteps();
        startAnalysis();
    });

    // Start analysis immediately
    startAnalysis();

    async function startAnalysis() {
        try {
            // Get current active tab
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            currentTab = tab;

            if (!tab?.url) {
                showError('No active tab found.');
                return;
            }

            // Check if we can access this tab
            if (
                tab.url.startsWith('chrome://') ||
                tab.url.startsWith('chrome-extension://') ||
                tab.url.startsWith('about:')
            ) {
                showError(
                    'Cannot analyze browser internal pages. Please navigate to a website first.'
                );
                return;
            }

            domainLabel.textContent = new URL(tab.url).hostname;

            // Step 1: Extract page data
            setStepActive(1);
            loadingText.textContent = 'Extracting page data...';

            const pageData = await injectAndExtract(tab.id);

            // Step 2: Send to AI
            setStepDone(1);
            setStepActive(2);
            loadingText.textContent = 'Analyzing with AI...';

            const analysis = await analyzePageData(pageData);

            // Step 3: Render
            setStepDone(2);
            setStepActive(3);
            loadingText.textContent = 'Generating report...';

            await sleep(400); // brief pause for UX
            setStepDone(3);

            renderResults(analysis);
        } catch (err) {
            console.error('Analysis error:', err);
            showError(err.message || 'An unexpected error occurred.');
        }
    }

    async function injectAndExtract(tabId) {
        const results = await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js'],
        });

        if (!results || !results[0] || !results[0].result) {
            throw new Error('Failed to extract page data. The page may be restricting scripts.');
        }

        return results[0].result;
    }

    function analyzePageData(pageData) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { type: 'ANALYZE_PAGE', pageData },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                    }
                    if (!response || !response.success) {
                        reject(new Error(response?.error || 'Analysis failed'));
                        return;
                    }
                    resolve(response.data);
                }
            );
        });
    }

    function renderResults(data) {
        loadingState.classList.add('hidden');
        resultsState.classList.remove('hidden');

        // Risk score & level
        const score = Math.min(100, Math.max(0, data.riskScore || 0));
        const level = (data.riskLevel || 'UNKNOWN').toUpperCase();

        const riskCard = document.getElementById('riskCard');
        const riskClass =
            score <= 20
                ? 'risk-safe'
                : score <= 40
                    ? 'risk-low'
                    : score <= 60
                        ? 'risk-medium'
                        : score <= 80
                            ? 'risk-high'
                            : 'risk-critical';

        riskCard.className = `risk-card ${riskClass}`;

        // Animate score
        const riskScoreEl = document.getElementById('riskScoreValue');
        const riskLabelEl = document.getElementById('riskLevelLabel');
        riskLabelEl.textContent = level;
        animateCounter(riskScoreEl, 0, score, 1200);

        // Animate gauge
        const gaugeFill = document.getElementById('gaugeFill');
        const circumference = 2 * Math.PI * 52; // r=52
        const offset = circumference - (score / 100) * circumference;
        setTimeout(() => {
            gaugeFill.style.strokeDashoffset = offset;
        }, 100);

        // Summary
        document.getElementById('riskSummary').textContent =
            data.summary || 'Analysis complete.';

        // Categories
        const catContainer = document.getElementById('categoriesContainer');
        catContainer.innerHTML = '';
        const dangerCategories = [
            'phishing', 'scam', 'malware', 'data harvesting',
            'fake store', 'tech support scam', 'spam',
        ];
        (data.categories || []).forEach((cat) => {
            const badge = document.createElement('span');
            const isGood =
                cat.toLowerCase() === 'legitimate' || cat.toLowerCase() === 'safe';
            const isDanger = dangerCategories.some((d) =>
                cat.toLowerCase().includes(d)
            );
            badge.className = `category-badge ${isGood ? 'badge-safe' : isDanger ? 'badge-danger' : 'badge-warning'
                }`;
            badge.textContent = cat;
            catContainer.appendChild(badge);
        });

        // Findings
        const findingsList = document.getElementById('findingsList');
        findingsList.innerHTML = '';
        (data.findings || []).forEach((f) => {
            const item = document.createElement('div');
            item.className = 'finding-item';

            const iconSymbol =
                f.type === 'positive' ? '✓' : f.type === 'danger' ? '✕' : '!';
            const iconClass = f.type === 'positive' ? 'positive' : f.type === 'danger' ? 'danger' : 'warning';

            item.innerHTML = `
        <div class="finding-icon ${iconClass}">${iconSymbol}</div>
        <div class="finding-content">
          <div class="finding-title">${escapeHtml(f.title || '')}</div>
          <div class="finding-desc">${escapeHtml(f.description || '')}</div>
        </div>
      `;
            findingsList.appendChild(item);
        });

        // Recommendations
        const recList = document.getElementById('recommendationsList');
        recList.innerHTML = '';
        (data.recommendations || []).forEach((rec) => {
            const li = document.createElement('li');
            li.className = 'recommendation-item';
            li.textContent = rec;
            recList.appendChild(li);
        });
    }

    function showError(msg) {
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        errorMessage.textContent = msg;
    }

    function setStepActive(num) {
        const el = document.getElementById(`step${num}`);
        if (el) el.classList.add('active');
    }

    function setStepDone(num) {
        const el = document.getElementById(`step${num}`);
        if (el) {
            el.classList.remove('active');
            el.classList.add('done');
        }
    }

    function resetSteps() {
        [step1, step2, step3].forEach((s) => {
            s.classList.remove('active', 'done');
        });
        step1.classList.add('active');
        loadingText.textContent = 'Scanning website...';
    }

    function animateCounter(el, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
});
