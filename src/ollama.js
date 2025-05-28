export let ollamaPrompt = async (items) => {
    let model;
    let prompt;

    if (!items.customPrompt) {
    // example.addEventListener("click", async () => {
    prompt = "Provide a single sentence example with the ";
    if (items.char == "simplified" && items.testType === "hsk3") {
        prompt += `${items.cache.simplified} word in Simplified Chinese.`
    } else if (items.char == "traditional" && items.testType === "hsk3") {
        prompt += `${items.cache.traditional} word in Traditional Chinese.`
    } else {
        prompt += `${items.cache.詞彙} word in Traditional Chinese (Taiwan).`
    }
    if (items.pinyin) { prompt += " Provide pinyin for the generated sentence example on a separate line." } else { prompt += " Don't provide pinyin for the generated sentence example." }
    // 2025 May: I'm yet to find a local model which can produce Zhuyin
    // if (items.zhuyin) { prompt += " Provide zhuyin for the generated sentence example on a separate line."} else {prompt += " Don't provide zhuyin for the generated sentence example."}
    if (items.translation && items.testType !== "tocfl") { prompt += " Provide English translation for the generated sentence example on a separate line." } else { prompt += " Don't provide translation for the generated sentence example." }
    prompt += " Don't output anything else. Reply in plain text. Don't add periods."
    } else {
        prompt = items.customPrompt;
    }
    console.log(prompt)
    console.log(`items.customPrompt: ${items.customPrompt}`)

    console.log(`items.customModel: ${items.customModel}`)
    if (!items.customModel) {
    // let model = "gemma3:12b" // 9.8Gb RAM
    // let model = "glm4-0414:9b" // ??Gb RAM
    model = "gemma3:latest" // 4.2Gb RAM
    } else {
        model = items.customModel
    }

    // BETA workaround for Safari ignoring Origin header rule
    // TODO: remove
    if (items.ua.browser == "Safari") {
        await ollamaSafari(model, prompt, items.fontType);
        console.log("Safari")
    } else {
        await ollama(model, prompt, items.fontType);
        console.log("Chrome")
    }
    // });
}

const output = document.querySelector('.ai');
output.textContent = ''; // Clear previous

// debug
// chrome.declarativeNetRequest.getEnabledRulesets().then((rulesets) => {
//     console.log("logRulesets", rulesets);
// }).catch((error) => {
//     console.log("logRulesets", error);
// });

export let ollama = async (model, prompt, fontType) => {

    const response = await fetch('http://localhost:11434/api/generate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: model, // 4.2Gb RAM
            prompt: prompt,
            stream: true,
            keep_alive: -1 // BETA highly experimental lol 
        })
    });
    // console.log(response)

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Ollama sends \n-delimited JSON lines
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Last line may be incomplete, keep it for next round

        for (const line of lines) {
            if (!line.trim()) continue;
            try {
                const json = JSON.parse(line);
                // if (json.response) {
                //     result += json.response;
                //     output.textContent = result;
                // }
                if (json.response) {
                    result += json.response;
                    // 將每一行用 <pre> 包起來
                    // const html = result
                    //     .split('\n')
                    //     .map(line => `<pre class="output">${line}</pre>`)
                    //     .join('');
                    const html = result
                        .split('\n')
                        .map((line, idx) => 
                            `<pre class="${idx === 0 ? `${fontType}-font output` : 'output'}">${line}</pre>`
                        )
                        .join('');
                    output.innerHTML = html;
                }
            } catch (err) {
                console.warn('Failed to parse JSON line:', line);
            }
        }
    }
}

// BETA workaround for Safari ignoring Origin header rule
export let ollamaSafari = async (model, prompt, fontType) => {
    const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "ollama-fetch",
            url: "http://localhost:11434/api/generate",
            body: {
                model: model, 
                prompt: prompt,
                stream: false, // fails when true
                keep_alive: -1
            }
        }, (response) => {
            if (response && response.success) {
                resolve(response.data);
            } else {
                reject(response ? response.error : "No response");
            }
        });
    });

    const html = response.response
        .split('\n')
        .map((line, idx) => 
            `<pre class="${idx === 0 ? `${fontType}-font output fadeIn` : 'output fadeIn'}">${line}</pre>`
        )
        .join('');
    output.innerHTML = html;
}
