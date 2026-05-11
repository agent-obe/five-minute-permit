import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Clipboard, RefreshCw, Scale, Sparkles, Stamp } from 'lucide-react';
import './styles.css';

const EXCUSES = [
  {
    id: 7,
    title: 'Routine Vibe Inspection',
    text: 'This is a routine vibe inspection. Please remain available for three to five minutes.'
  },
  {
    id: 14,
    title: 'Minor Matter Escalation',
    text: 'I have received credible reports that your opinion is required on an extremely minor matter.'
  },
  {
    id: 19,
    title: 'Weather-Related Advisory',
    text: 'A pigeon, a lawyer, and an emotionally unstable weather system have advised me to ask how your day is going.'
  },
  {
    id: 22,
    title: 'Departmental Irregularity',
    text: 'The Department of Avoiding Directness has detected suspicious levels of wanting to talk to you.'
  },
  {
    id: 31,
    title: 'Unnecessary But Time-Sensitive',
    text: 'This conversation request is unnecessary, but unfortunately it is also time-sensitive.'
  },
  {
    id: 38,
    title: 'Soft Launch',
    text: 'This is a soft launch of a conversation. No commitment required. Feedback welcome.'
  },
  {
    id: 43,
    title: 'Administrative Confusion',
    text: 'There has been an administrative error and I accidentally started missing your nonsense.'
  },
  {
    id: 51,
    title: 'Emergency Consultation',
    text: 'Emergency consultation requested: I need to know whether your day was good, weird, or narratively significant.'
  }
];

const APPROVED_REPLY = 'Fine. You have been granted five minutes.';
const REJECTED_REPLY = 'This excuse has been reviewed and rejected on legal grounds. Try again.';

function getExcuseById(id) {
  return EXCUSES.find((item) => item.id === id) ?? EXCUSES[0];
}

function nextExcuseId(currentId) {
  const index = EXCUSES.findIndex((item) => item.id === currentId);
  if (index === -1) {
    return EXCUSES[0].id;
  }
  return EXCUSES[(index + 1) % EXCUSES.length].id;
}

function encodePermit(payload) {
  return btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodePermit(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return JSON.parse(atob(padded));
}

function buildPermitLink(payload) {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('permit', encodePermit(payload));
  return url.toString();
}

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [currentExcuseId, setCurrentExcuseId] = useState(EXCUSES[0].id);
  const [shareLink, setShareLink] = useState('');
  const [senderCopied, setSenderCopied] = useState(false);
  const [recipientReply, setRecipientReply] = useState('');
  const [replyCopied, setReplyCopied] = useState(false);
  const [permitError, setPermitError] = useState('');
  const [recipientPermit, setRecipientPermit] = useState(null);

  const senderExcuse = useMemo(() => getExcuseById(currentExcuseId), [currentExcuseId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const permit = params.get('permit');

    if (!permit) {
      setRecipientPermit(null);
      setPermitError('');
      return;
    }

    try {
      const parsed = decodePermit(permit);
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof parsed.from !== 'string' ||
        typeof parsed.to !== 'string' ||
        typeof parsed.excuseId !== 'number'
      ) {
        throw new Error('Malformed permit');
      }

      const excuse = getExcuseById(parsed.excuseId);
      setRecipientPermit({
        from: parsed.from.trim() || 'A mysterious party',
        to: parsed.to.trim() || 'you',
        excuseId: excuse.id
      });
      setPermitError('');
    } catch {
      setRecipientPermit(null);
      setPermitError('This permit appears to be corrupted, forged, or otherwise narratively compromised.');
    }
  }, []);

  const recipientExcuse = useMemo(() => {
    if (!recipientPermit) {
      return null;
    }
    return getExcuseById(recipientPermit.excuseId);
  }, [recipientPermit]);

  const handleGenerate = () => {
    setCurrentExcuseId(nextExcuseId(currentExcuseId));
    setShareLink('');
    setSenderCopied(false);
  };

  const handlePreparePermit = () => {
    const payload = {
      from: from.trim() || 'A mysterious party',
      to: to.trim() || 'you',
      excuseId: currentExcuseId
    };

    setShareLink(buildPermitLink(payload));
    setSenderCopied(false);
  };

  const handleCopySenderLink = async () => {
    if (!shareLink) {
      return;
    }

    await navigator.clipboard.writeText(shareLink);
    setSenderCopied(true);
  };

  const handleApprove = () => {
    setRecipientReply(APPROVED_REPLY);
    setReplyCopied(false);
  };

  const handleReject = () => {
    setRecipientReply(REJECTED_REPLY);
    setReplyCopied(false);
  };

  const handleBetterExcuse = () => {
    if (!recipientPermit) {
      return;
    }

    setRecipientPermit({
      ...recipientPermit,
      excuseId: nextExcuseId(recipientPermit.excuseId)
    });
    setRecipientReply('');
    setReplyCopied(false);
  };

  const handleCopyReply = async () => {
    if (!recipientReply) {
      return;
    }

    await navigator.clipboard.writeText(recipientReply);
    setReplyCopied(true);
  };

  const isRecipientMode = Boolean(recipientPermit) || Boolean(permitError);

  return (
    <main className="page">
      <div className="blob blob-peach" />
      <div className="blob blob-lavender" />
      <div className="blob blob-blue" />

      <section className="permit-card">
        <div className="badge">
          <Sparkles size={16} />
          Five Minute Permit Office
        </div>

        <h1>{isRecipientMode ? 'Permit review chamber' : 'Request five minutes without sounding tragic'}</h1>
        <p className="lede">
          {isRecipientMode
            ? 'A lightweight bureaucratic ritual for approving or rejecting a tiny request for attention.'
            : 'Generate a dignified excuse, package it into a permit, and send it to the poor soul being summoned.'}
        </p>

        {!isRecipientMode && (
          <>
            <section className="form-card">
              <div className="field-grid">
                <label className="field">
                  <span>From</span>
                  <input
                    type="text"
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                    placeholder="Your name"
                  />
                </label>
                <label className="field">
                  <span>To</span>
                  <input
                    type="text"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                    placeholder="Recipient name"
                  />
                </label>
              </div>
            </section>

            <section className="ticket">
              <div className="ticket-header">
                <span className="pill">Excuse #{senderExcuse.id}</span>
                <span>{from.trim() || 'Someone'} → {to.trim() || 'someone important'}</span>
              </div>
              <h2>{senderExcuse.title}</h2>
              <p>{senderExcuse.text}</p>
            </section>

            <div className="actions">
              <button type="button" className="secondary" onClick={handleGenerate}>
                <RefreshCw size={18} />
                Generate excuse
              </button>
              <button type="button" onClick={handlePreparePermit}>
                <Stamp size={18} />
                Prepare permit
              </button>
            </div>

            {shareLink && (
              <section className="reply-card">
                <div className="reply-label">Shareable permit link</div>
                <p className="reply-text share-link">{shareLink}</p>
                <div className="reply-actions">
                  <button type="button" onClick={handleCopySenderLink}>
                    <Clipboard size={17} />
                    {senderCopied ? 'Copied' : 'Copy link'}
                  </button>
                  <a href={shareLink} target="_blank" rel="noopener noreferrer">
                    Preview recipient view
                  </a>
                </div>
              </section>
            )}
          </>
        )}

        {isRecipientMode && permitError && (
          <section className="reply-card reply-card-warning">
            <div className="reply-label">Permit status</div>
            <p className="reply-text">{permitError}</p>
          </section>
        )}

        {recipientPermit && recipientExcuse && (
          <>
            <section className="ticket">
              <div className="ticket-header">
                <span className="pill recipient-pill">For {recipientPermit.to}</span>
                <span>{recipientPermit.from} is requesting five minutes.</span>
              </div>
              <h2>{recipientExcuse.title}</h2>
              <p>{recipientExcuse.text}</p>
            </section>

            <div className="actions recipient-actions">
              <button type="button" onClick={handleApprove}>
                <Stamp size={18} />
                Approve 5 minutes
              </button>
              <button type="button" className="secondary" onClick={handleReject}>
                <Scale size={18} />
                Legally weak
              </button>
              <button type="button" className="ghost" onClick={handleBetterExcuse}>
                <RefreshCw size={18} />
                Better excuse
              </button>
            </div>

            {recipientReply && (
              <section className="reply-card">
                <div className="reply-label">Official response</div>
                <p className="reply-text">{recipientReply}</p>
                <div className="reply-actions">
                  <button type="button" onClick={handleCopyReply}>
                    <Clipboard size={17} />
                    {replyCopied ? 'Copied' : 'Copy reply'}
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        <p className="footnote">
          No pressure. Mild nonsense only. Permit expires whenever this stops being funny.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
