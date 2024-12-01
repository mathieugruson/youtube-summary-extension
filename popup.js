document.getElementById("summarize").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getTranscript" }, async (response) => {
        if (response.error) {
          document.getElementById("summary").innerText = response.error;
        } else {
          const summary = await getSummary(response.transcript);
          document.getElementById("summary").innerText = summary;
        }
      });
    });
  });
  
  async function getSummary(transcript) {
    const apiKey = "YOUR_CHATGPT_API_KEY"; // Replace with your API key
    const apiUrl = "https://api.openai.com/v1/completions";
  
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4", // or gpt-3.5-turbo
        prompt: `Summarize the following transcript:\n\n${transcript}`,
        max_tokens: 300,
        temperature: 0.7
      })
    });
  
    const data = await response.json();
    return data.choices[0].text.trim();
  }
  