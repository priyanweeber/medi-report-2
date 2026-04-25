let chatHistory = [];
let chatOpen = false;

function toggleChat() {
  const box = document.getElementById("chatbox");
  chatOpen = !chatOpen;
  box.classList.toggle("open", chatOpen);
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  appendMsg("user", text);
  chatHistory.push({ role: "user", content: text });

  const typing = appendMsg("bot", "Thinking...", "typing");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a helpful AI health assistant for MediReport, an Indian online pharmacy. Answer questions about medicines, dosages, health conditions, and wellness tips. Be concise, friendly, and always recommend consulting a doctor for serious concerns. Use Indian medicine brand names when relevant. Keep responses under 100 words.",
        messages: chatHistory
      })
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't respond right now.";
    typing.remove();
    appendMsg("bot", reply);
    chatHistory.push({ role: "assistant", content: reply });
  } catch {
    typing.remove();
    appendMsg("bot", "Sorry, I'm having trouble connecting. Please try again.");
  }
}

function appendMsg(role, text, cls) {
  const msgs = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = `msg ${role} ${cls || ""}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

document.getElementById("chatInput").addEventListener("keydown", e => {
  if (e.key === "Enter") sendChat();
});
