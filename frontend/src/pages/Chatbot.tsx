import { useState } from 'react'
import './Chatbot.css'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

interface Message {
  role: 'user' | 'bot'
  text: string
  time: string
}

const SYSTEM_CONTEXT = `You are a helpful AI assistant for WINNER — an AI-Driven Urban Navigation & Mobility Optimization platform built for Mumbai, India. You help users with:
- Traffic conditions and predictions in Mumbai
- Best travel routes between locations  
- Departure time recommendations
- Parking information
- Weather impact on travel
- Transport mode suggestions (Car, Bike, Auto, Train)
- General urban mobility advice

Keep responses concise, helpful, and relevant to urban navigation. Use a friendly, knowledgeable tone. Format your responses clearly using plain text. Use short paragraphs. When listing items, use simple dashes (-). Do not use markdown bold (**) or headers (##). Keep it clean and readable.`

// Format bot reply — clean text, no markdown symbols
function formatReply(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .trim()
}

const suggestions = [
  'Mumbai mein rush hour kab hota hai?',
  'Andheri se BKC jaane ka best time?',
  'Baarish mein kaunsa transport best hai?',
  'Parking dhundhne ke tips batao',
]

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Namaste! Main WINNER ka AI Assistant hun. Mumbai ki traffic, routes, parking — kuch bhi pooch sakte ho!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage(text?: string) {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg: Message = {
      role: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: SYSTEM_CONTEXT + '\n\nUser: ' + msg }] }
            ]
          })
        }
      )
      const data = await res.json()
      const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, kuch problem ho gayi. Dobara try karo!'

      setMessages(prev => [...prev, {
        role: 'bot',
        text: formatReply(raw),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '❌ Gemini API connect nahi ho pa raha. API key check karo!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page chatbot-page">
      <div className="page-header">
        <div className="tag">AI ASSISTANT</div>
        <h1>Chat with <span>Gemini AI</span></h1>
        <p>Urban navigation ke baare mein kuch bhi pooch — Gemini AI jawab dega</p>
      </div>

      <div className="chatbot-container card">
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div>
            <div className="chat-name">WINNER Assistant</div>
            <div className="chat-status"><span className="status-dot"></span> Online — Powered by Gemini</div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message-row ${m.role}`}>
              {m.role === 'bot' && <div className="msg-avatar">🤖</div>}
              <div className="msg-bubble">
                <div className="msg-text">{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-row bot">
              <div className="msg-avatar">🤖</div>
              <div className="msg-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="chat-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            className="input-field chat-input"
            placeholder="Kuch bhi pooch..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button className="btn-primary send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}