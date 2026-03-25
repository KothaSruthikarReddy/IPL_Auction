const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const voiceBtn = document.getElementById('voiceBtn');
const sendBtn = document.getElementById('sendBtn');

// Replace with your API key in local/dev only. For production, use a secure backend.
const API_KEY = 'YOUR_OPENAI_API_KEY';
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

// Prompt engineering: this system message ensures supportive, safe tone.
const SYSTEM_PROMPT = `You are a compassionate and supportive mental health assistant.
Respond in a calm, empathetic, and encouraging tone.
Do not provide medical diagnosis or prescriptions.
Keep responses short and helpful.
Encourage positive coping strategies like breathing, talking to friends, or taking rest.`;

const SENSITIVE_TERMS = ['i want to die', 'suicide', 'hopeless'];

// Maintains in-session conversation context to simulate real conversational NLP behavior.
const conversationHistory = [
  { role: 'system', content: SYSTEM_PROMPT },
];

let recognition = null;

function getTimeStamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addMessage(role, text, { isTyping = false } = {}) {
  const wrapper = document.createElement('article');
  wrapper.className = `message ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  if (isTyping) {
    bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  } else {
    bubble.textContent = text;
  }

  const time = document.createElement('span');
  time.className = 'timestamp';
  time.textContent = getTimeStamp();

  wrapper.append(bubble, time);
  chatContainer.appendChild(wrapper);
  scrollToBottom();

  return wrapper;
}

function isSensitiveMessage(text) {
  const normalized = text.toLowerCase();
  return SENSITIVE_TERMS.some((phrase) => normalized.includes(phrase));
}

async function fetchAIResponse() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 180,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`API request failed (${response.status}): ${details}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || 'I am here with you. Can you share a little more?';
}

async function handleSubmit(event) {
  event.preventDefault();
  const userText = messageInput.value.trim();
  if (!userText) return;

  addMessage('user', userText);
  messageInput.value = '';
  messageInput.focus();

  // Safety filtering: detect crisis phrases and avoid sending to API.
  if (isSensitiveMessage(userText)) {
    addMessage(
      'system',
      "I'm really sorry you're feeling this way. Please consider reaching out to a trusted person or a mental health helpline immediately."
    );
    return;
  }

  conversationHistory.push({ role: 'user', content: userText });

  const typingNode = addMessage('bot', '', { isTyping: true });
  sendBtn.disabled = true;

  try {
    const aiReply = await fetchAIResponse();
    conversationHistory.push({ role: 'assistant', content: aiReply });
    typingNode.remove();
    addMessage('bot', aiReply);
  } catch (error) {
    typingNode.remove();
    addMessage('system', 'I am having trouble connecting right now. Please try again in a moment.');
    console.error('AI error:', error);
  } finally {
    sendBtn.disabled = false;
  }
}

function initializeVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.disabled = true;
    voiceBtn.title = 'Voice input is not supported in this browser';
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    messageInput.focus();
  };

  recognition.onerror = () => {
    addMessage('system', 'Voice input failed. Please type your message.');
  };
}

chatForm.addEventListener('submit', handleSubmit);
voiceBtn.addEventListener('click', () => recognition && recognition.start());
initializeVoiceInput();

addMessage('bot', 'How are you feeling today?');
