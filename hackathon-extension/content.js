// Content script — injected into the active tab to extract page signals
(function () {
    function extractPageData() {
        const url = window.location.href;
        const domain = window.location.hostname;
        const protocol = window.location.protocol;
        const title = document.title || '';
        const metaDesc =
            document.querySelector('meta[name="description"]')?.content || '';

        // --- External links ---
        const allLinks = Array.from(document.querySelectorAll('a[href]'));
        const externalLinks = allLinks
            .map((a) => {
                try {
                    const u = new URL(a.href, url);
                    return u.hostname !== domain ? u.href : null;
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
        const uniqueExternalDomains = [
            ...new Set(
                externalLinks.map((l) => {
                    try {
                        return new URL(l).hostname;
                    } catch {
                        return null;
                    }
                }).filter(Boolean)
            ),
        ];

        // --- Forms ---
        const forms = Array.from(document.querySelectorAll('form')).map((f) => ({
            action: f.action || '',
            method: f.method || 'get',
            hasPasswordField: !!f.querySelector('input[type="password"]'),
            hasCreditCardField: !!(
                f.querySelector('input[name*="card"], input[name*="cc"], input[autocomplete*="cc-"]')
            ),
        }));

        // --- Trust signals ---
        const bodyText = document.body?.innerText || '';
        const hasPrivacyPolicy = /privacy\s*policy/i.test(bodyText);
        const hasTerms = /terms\s*(of\s*service|&\s*conditions|\s*of\s*use)/i.test(bodyText);
        const hasContactInfo =
            /contact\s*us|support@|help@|customer\s*service/i.test(bodyText);

        // --- Suspicious patterns ---
        const hiddenIframes = document.querySelectorAll(
            'iframe[style*="display:none"], iframe[style*="visibility:hidden"], iframe[width="0"], iframe[height="0"]'
        ).length;
        const totalIframes = document.querySelectorAll('iframe').length;

        // Obfuscated scripts (very large inline scripts, eval usage)
        const scripts = Array.from(document.querySelectorAll('script:not([src])'));
        const suspiciousScripts = scripts.filter(
            (s) =>
                s.textContent.includes('eval(') ||
                s.textContent.includes('document.write(') ||
                s.textContent.includes('unescape(') ||
                s.textContent.length > 10000
        ).length;

        // --- Urgency / pressure language (common scam pattern) ---
        const urgencyPhrases = [
            'act now', 'limited time', 'expires soon', 'urgent', 'immediately',
            'congratulations', 'you have been selected', 'claim your prize',
            'verify your account', 'suspended', 'unauthorized', 'click here to confirm',
        ];
        const urgencyMatches = urgencyPhrases.filter((p) =>
            bodyText.toLowerCase().includes(p)
        );

        // --- Truncate body text for API (first 3000 chars) ---
        const truncatedText = bodyText.substring(0, 3000);

        return {
            url,
            domain,
            protocol,
            title,
            metaDescription: metaDesc,
            externalLinkCount: externalLinks.length,
            uniqueExternalDomains: uniqueExternalDomains.slice(0, 20),
            forms,
            hasPrivacyPolicy,
            hasTermsOfService: hasTerms,
            hasContactInfo,
            hiddenIframes,
            totalIframes,
            suspiciousScripts,
            urgencyMatches,
            isHTTPS: protocol === 'https:',
            pageTextSnippet: truncatedText,
        };
    }

    return extractPageData();
})();
