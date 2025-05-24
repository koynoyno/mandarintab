

// const prompt = document.getElementById('prompt').value;
const output = document.getElementById('output');
output.textContent = ''; // Clear previous

export let ollama = async (prompt) => {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.2:1b-instruct-q2_K',
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