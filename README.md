# Five Minute Permit

A tiny playful excuse generator for stealing five minutes of someone's time.

The tone is meant to be cute, low-pressure, and deniable: funny enough to send, not intense enough to feel like a declaration.

## Features

- Generate silly excuses
- Optional recipient name
- Accept a permit
- Copy a WhatsApp-ready reply
- Open WhatsApp with the reply prefilled
- No backend
- No tracking
- No user data storage

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Security notes

This is intentionally front-end only. User-entered text is rendered by React, not manually injected with `innerHTML`.
