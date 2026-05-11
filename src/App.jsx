import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Clipboard, RefreshCw, Stamp, Sparkles } from 'lucide-react';
import './styles.css';

const EXCUSES = [
  {
    id: 7,
    title: 'Routine Vibe Inspection',
    text: 'This is a routine vibe inspection. Please remain available for three to five minutes.',
    reply: 'Fine. You have been granted five minutes.'
  },
  {
    id: 14,
    title: 'Minor Matter Escalation',
    text: 'I have received credible reports that your opinion is required on an extremely minor matter.',
    reply: 'Proceed. But make the minor matter interesting.'
  },
  {
    id: 19,
    title: 'Weather-Related Advisory',
    text: 'A pigeon, a lawyer, and an emotionally unstable weather system have advised me to ask how your day is going.',
    reply: 'The weather system may continue.'
  },
  {
    id: 22,
    title: 'Departmental Irregularity',
    text: 'The Department of Avoiding Directness has detected suspicious levels of wanting to talk to you.',
    reply: 'Suspicion noted. Five minutes approved.'
  },
  {
    id: 31,
    title: 'Unnecessary But Time-Sensitive',
    text: 'This conversation request is unnecessary, but unfortunately it is also time-sensitive.',
    reply: 'Unnecessary requests are my jurisdiction. Continue.'
  },
  {
    id: 38,
    title: 'Soft Launch',
    text: 'This is a soft launch of a conversation. No commitment required. Feedback welcome.',
    reply: 'Soft launch accepted. Beta access granted.'
  },
  {
    id: 43,
    title: 'Administrative Confusion',
    text: 'There has been an administrative error and I accidentally started missing your nonsense.',
    reply: 'Administrative error acknowledged.'
  },
  {
    id: 51,
    title: 'Emergency Consultation',
    text: 'Emergency consultation requested: I need to know whether your day was good, weird, or narratively significant.',
    reply: 'Narrative report incoming.'
  }
];

function pickNext(currentId) {
  const options = EXCUSES.filter((item) => item.id !== currentId);
  return options[Math.floor(Math.random() * options.length)];
}

function buildWhatsappText(excuse, recipientName) {
  const name = recipientName.trim();
  const prefix = name ? `${name}, ` : '';
  return `${prefix}${excuse.reply}`;
}

function App() {
  const initialExcuse = useMemo(() => EXCUSES[0], []);
  const [excuse, setExcuse] = useState(initialExcuse);
  const [recipientName, setRecipientName] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [copied, setCopied] = useState(false);

  const replyText = buildWhatsappText(excuse, recipientName);
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(replyText)}`;

  function generateExcuse() {
    setExcuse((current) => pickNext(current.id));
    setAccepted(false);
    setCopied(false);
  }

  async function copyReply() {
    try {
      await navigator.clipboard.writeText(replyText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="page">
      <div className="blob blob-peach" />
      <div className="blob blob-lavender" />
      <div className="blob blob-blue" />

      <section className="permit-card" aria-labelledby="app-title">
        <div className="badge">
          <Stamp size={16} />
          <span>Five Minute Permit Office</span>
        </div>

        <h1 id="app-title">Generate a legally weak excuse to talk.</h1>

        <p className="subtitle">
          For urgent, semi-urgent, and completely unnecessary requests to steal five minutes without making it weird.
        </p>

        <label className="name-label" htmlFor="recipientName">
          Optional name on the paperwork
        </label>
        <input
          id="recipientName"
          className="name-input"
          maxLength={32}
          placeholder="e.g. Juhi"
          value={recipientName}
          onChange={(event) => {
            setRecipientName(event.target.value);
            setCopied(false);
          }}
        />

        <article className={`ticket ${accepted ? 'ticket-approved' : ''}`}>
          <div className="ticket-header">
            <span>Excuse #{excuse.id}</span>
            <span>{accepted ? 'approved' : 'pending review'}</span>
          </div>
          <h2>{excuse.title}</h2>
          <p>{excuse.text}</p>
        </article>

        <div className="actions">
          <button className="primary-btn" type="button" onClick={generateExcuse}>
            <RefreshCw size={18} />
            Generate excuse
          </button>
          <button className="dark-btn" type="button" onClick={() => {
            setAccepted(true);
            setCopied(false);
          }}>
            <Sparkles size={18} />
            Accept permit
          </button>
        </div>

        {accepted && (
          <section className="reply-panel" aria-live="polite">
            <p className="reply-eyebrow">Suggested reply</p>
            <p className="reply-text">{replyText}</p>
            <div className="reply-actions">
              <button type="button" onClick={copyReply}>
                <Clipboard size={17} />
                {copied ? 'Copied' : 'Copy reply'}
              </button>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Open WhatsApp
              </a>
            </div>
          </section>
        )}

        <p className="footnote">
          No pressure. Mild nonsense only. Permit expires whenever this stops being funny.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
