export let ollamaPrompt = async (items) => {

    // example.addEventListener("click", async () => {
        let prompt;
        if (items.char == "simplified" && items.testType === "hsk3") {
            prompt = `provide a single sentence example using ${items.cache.simplified} word in Simplified Chinese.`
        } else if (items.char == "traditional" && items.testType === "hsk3") {
            prompt = `provide a single sentence example using ${items.cache.traditional} word in Traditional Chinese.`
        } else {
            prompt = `provide a single sentence example using ${items.cache.詞彙} word in Traditional Chinese (Taiwan).`
        }
        if (items.pinyin) { prompt += " Provide pinyin for the example on a separate line." } else { prompt += " Don't provide pinyin for the example." }
        // 2025 May: doesn't work with gemma3 (4b, 12b) or llama3.2 (3b)
        // if (items.zhuyin) { prompt += " Provide zhuyin for the example on a separate line."} else {prompt += " Don't provide zhuyin for the example."}
        if (items.translation && items.testType !== "tocfl") { prompt += " Provide English translation on a separate line." } else { prompt += " Don't provide translation for the example." }
        prompt += " Don't output anything else."
        console.log(prompt)
        await ollama(prompt);
    // });

    console.log(items)
}

// BETA AI
// explain.addEventListener("click", async () => {
//   const { ollama } = await import("./ollama.js");
//   let prompt;
//   if (items.char == "simplified") {
//     prompt = `explain in Simplified Chinese what is ${items.cache.simplified}, 1 sentence. Use simplified characters.`
//   } else {
//     prompt = `explain in Traditional Chinese what is ${items.cache.traditional}, 1 sentence. Use traditional characters.`
//   }
//   if (items.pinyin) { prompt += "Provide pinyin for the explanation on a separate line."} else {prompt += "Don't provide pinyin for the explanation."}
//   if (items.zhuyin) { prompt += " Provide zhuyin for the explanation on a separate line."} else {prompt += " Don't provide zhuyin for the explanation."}
//   if (items.translation) { prompt += " Provide translation for the explanation on a separate line."} else {prompt += " Don't provide translation for the explanation."}
//   prompt += " Don't output anything else."
//   console.log(prompt)
//   await ollama(prompt);
// });

// const prompt = document.getElementById('prompt').value;
const output = document.getElementById('output');
output.textContent = ''; // Clear previous

export let ollama = async (prompt) => {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gemma3:12b', // requires RTX 3060 12GB, 40% performance
            // model: 'gemma3', // requires RTX 3050 8GB, 100% performance
            prompt: prompt,
            stream: true
        })
    });

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
                if (json.response) {
                    result += json.response;
                    output.textContent = result;
                }
            } catch (err) {
                console.warn('Failed to parse JSON line:', line);
            }
        }
    }
}