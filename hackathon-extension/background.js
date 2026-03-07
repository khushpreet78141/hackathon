// Background service worker — handles Nebius AI API calls

const NEBIUS_API_KEY = 'v1.CmMKHHN0YXRpY2tleS1lMDB6cnN6Y2V6OGs1OWE0bmcSIXNlcnZpY2VhY2NvdW50LWUwMGFwM3JoeHQ5cTB2bTZqejIMCLKQsc0GEMrEm4ABOgsIspPJmAcQgImDe0ACWgNlMDA.AAAAAAAAAAEk2bP8vqkKkuQi8XX-g8Q7dCcGzxQCYe-40NoGd38IP3uRVbxu2JWHootbN945XLgs2v0iWgyP1I9RtBd-COcO';
const API_URL = 'https://api.tokenfactory.nebius.com/v1/chat/completions';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ANALYZE_PAGE') {
        analyzeWithAI(message.pageData)
            .then((result) => sendResponse({ success: true, data: result }))
            .catch((err) =>
                sendResponse({ success: false, error: err.message || 'Analysis failed' })
            );
        // Return true to indicate async response
        return true;
    }
});

async function analyzeWithAI(pageData) {
    const systemPrompt = `You are a cybersecurity expert analyzing websites for potential fraud, spam, phishing, or scam indicators. You always respond with valid JSON only, no extra text.`;

    const userMessage = buildUserMessage(pageData);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b',
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: [{ type: 'text', text: userMessage }],
                },
            ],
            temperature: 0.2,
            max_tokens: 2048,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error (${response.status}): ${errText}`);
    }

    const data = await response.json();

    // Extract the text from the response
    const rawText =
        data.choices?.[0]?.message?.content || '';

    try {
        // Try to parse as JSON directly
        return JSON.parse(rawText);
    } catch {
        // If it has markdown code fences, strip them
        const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1].trim());
            } catch { /* fall through */ }
        }

        // Last resort: wrap in a basic structure
        return {
            riskScore: 50,
            riskLevel: 'UNKNOWN',
            categories: ['Analysis Error'],
            findings: [
                {
                    type: 'warning',
                    title: 'Incomplete Analysis',
                    description:
                        'Could not fully parse the AI response. Raw output: ' +
                        rawText.substring(0, 300),
                },
            ],
            recommendations: ['Try analyzing the page again.'],
            summary: 'The analysis could not be completed properly.',
        };
    }
}

function buildUserMessage(pageData) {
    return `Analyze the following website data and return a JSON object with your assessment.

## Website Data
- **URL**: ${pageData.url}
- **Domain**: ${pageData.domain}
- **Protocol**: ${pageData.protocol} (HTTPS: ${pageData.isHTTPS})
- **Page Title**: ${pageData.title}
- **Meta Description**: ${pageData.metaDescription}
- **External Links Count**: ${pageData.externalLinkCount}
- **External Domains**: ${JSON.stringify(pageData.uniqueExternalDomains)}
- **Forms Found**: ${JSON.stringify(pageData.forms)}
- **Has Privacy Policy**: ${pageData.hasPrivacyPolicy}
- **Has Terms of Service**: ${pageData.hasTermsOfService}
- **Has Contact Info**: ${pageData.hasContactInfo}
- **Hidden Iframes**: ${pageData.hiddenIframes}
- **Total Iframes**: ${pageData.totalIframes}
- **Suspicious Scripts**: ${pageData.suspiciousScripts}
- **Urgency Language Found**: ${JSON.stringify(pageData.urgencyMatches)}
- **Page Content Snippet**: ${pageData.pageTextSnippet}

## Instructions
Return ONLY a JSON object (no markdown, no extra text) with exactly this structure:
{
  "riskScore": <number 0-100, where 0=completely safe, 100=definitely malicious>,
  "riskLevel": "<one of: SAFE, LOW, MEDIUM, HIGH, CRITICAL>",
  "categories": ["<list of applicable categories like: Legitimate, Phishing, Scam, Spam, Malware, Suspicious, Data Harvesting, Fake Store, Tech Support Scam>"],
  "findings": [
    {
      "type": "<positive|warning|danger>",
      "title": "<short title>",
      "description": "<explanation>"
    }
  ],
  "recommendations": ["<actionable advice for the user>"],
  "summary": "<2-3 sentence overall assessment>"
}

Be thorough but concise. Include both positive and negative findings. If the site appears legitimate, say so clearly with a low risk score. Provide at least 3 findings.`;
}
