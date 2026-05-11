# Carlo Fonollera — AI-Native Portfolio

> An AI-powered portfolio inspired by [toukoum.fr](https://www.toukoum.fr/). Instead of static pages, visitors chat directly with Carlo's AI avatar — built with Next.js 14, Vercel AI SDK, and Framer Motion.

---

## ✨ Features

- **Animated SVG Avatar** — idle breathing, blinking, head tilt when thinking, big smile when replying
- **Streaming AI Chat** — powered by Groq Llama-3.1-70B (or OpenAI GPT-4o-mini)
- **Suggestion Chips** — contextual floating chips to kickstart the conversation
- **Zero static sections** — all info (bio, skills, projects, contact) revealed through conversation
- **Grain texture + mesh gradient** — dark, atmospheric, zero generic aesthetics
- **Deploy-ready** — one-click Vercel deployment

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd carlo-portfolio
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
# Recommended — Groq (free tier, fast)
GROQ_API_KEY=gsk_your_key_here

# OR — OpenAI
# OPENAI_API_KEY=sk_your_key_here
```

Get a free Groq key at: https://console.groq.com/keys

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Add environment variable in Vercel dashboard:
- `GROQ_API_KEY` → your key

### Option B — Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import repo
3. Add `GROQ_API_KEY` in Environment Variables
4. Deploy

---

## 🖥 Deploy to Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add environment variable: `GROQ_API_KEY`

---

## 🗂 Project Structure

```
carlo-portfolio/
├── app/
│   ├── api/chat/route.ts    # Streaming AI chat endpoint
│   ├── globals.css          # Design tokens, animations
│   ├── layout.tsx           # Root layout (Geist fonts)
│   └── page.tsx             # Main portfolio chat UI
├── components/
│   ├── Avatar.tsx           # Animated SVG avatar
│   └── ChatMessage.tsx      # Speech bubble component
├── lib/
│   └── prompt.ts            # Carlo's full system prompt / knowledge base
├── .env.example
├── vercel.json
└── README.md
```

---

## 🎨 Design System

See `claude.md` in the project root for the full design system — typography, color palette, motion rules, and component guidelines.

Key choices:
- **Colors:** Near-black `#050505` base, `#00e5ff` cyan accent, warm off-white text
- **Fonts:** Geist Sans + Geist Mono (no Inter, no Roboto)
- **Motion:** Framer Motion with spring physics throughout

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| AI SDK | Vercel AI SDK v3 |
| LLM | Groq Llama-3.1-70B / OpenAI GPT-4o-mini |
| Animation | Framer Motion |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Fonts | Geist (via `geist` npm package) |

---

## 📬 Contact

- Email: carlofonollera@gmail.com
- LinkedIn: https://www.linkedin.com/in/carlo-fonollera/
