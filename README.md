# CheckMate — Checkers Platform with AI Coach

No fluff. Here's what this is, how it works, and why it makes money.

---

## The Problem Worth Solving

Checkers is played in **hundreds of millions of households** — mandatory curriculum in Russian and Brazilian schools, a cultural staple across Central Asia and Africa, the first strategy game most people ever touch. There is no modern platform for it. The apps that exist are 2012-era UI with offline bots. That's the entire competitive landscape.

Chess got Chess.com ($100M+ revenue, 100M users). Checkers got nothing. Same cognitive value proposition, 10x larger casual addressable market, zero serious competition.

---

## What CheckMate Actually Is

A real-time multiplayer checkers platform with three interlocking loops:

1. **Skill loop** — AI coach teaches you after every game, you get measurably better
2. **Social loop** — leaderboards, friend matches, live streaming keep you coming back for status
3. **Progression loop** — XP, unlocks, gacha, streaks give you a reason to open the app daily even when you don't want to play a full game

Each loop feeds the others. Getting better → climb leaderboard → flex on friends → friends download app → friends challenge you → you play more → coach analyzes more → you get better. Classic growth flywheel, grounded in a real skill people actually want.

---

## How the AI Coach Works

After every game we send the full move history to the Claude API with a structured prompt containing:

- board state at each turn
- the move chosen vs the optimal move (computed via minimax with alpha-beta pruning)
- the player's historical mistake patterns from past games
- their onboarding preferences (interests, reading level, age mode)

The coach doesn't just say "move 14 was bad." It says:

> "On move 14 you had a double capture available — 3b→5d→7f — that would've removed two pieces and given you center control for the next 6 moves. Instead you advanced on the flank, which looked aggressive but actually gave your opponent tempo. You make this trade-off error often under time pressure. Here's the position — want to replay it?"

That last sentence matters. The coach offers to **replay the exact moment**. The user tries again, the coach responds to their new choice. That's where real learning happens — and it's also where session length spikes.

Personalization: during onboarding the user picks their interests. If they chose Breaking Bad, the coach says: *"You're playing Heisenberg-style — assertive, but you're exposing yourself. Walter always had a backup plan."* This sounds like a gimmick. It isn't. Duolingo's retention research shows personalized language recognition measurably increases session return rate. Same mechanism, applied here.

---

## Multiplayer Architecture

Friend matches use WebSockets (Socket.io) with a room-based model:

```
Player A creates room → gets 6-char code + shareable link
Player B opens link   → auto-joins room
Server validates move legality server-side (zero client trust)
Both clients receive authoritative board state updates <50ms (same region)
```

Move validation is entirely server-side. Clients are renderers. There is no client-side cheating vector because the board state is never authoritative on the client.

Live streaming is layered on WebRTC with a lightweight signaling server. The streamer shares their board as a **data channel** — not video. Viewers get the same board state rendered locally on their client. Reactions and chat go through a separate Socket.io namespace. This means a stream costs almost nothing to serve. Compare that to actual video infrastructure.

---

## Retention Mechanics

These are borrowed from proven systems, not invented:

**Streak system (Duolingo):** Daily login streak with compounding rewards. Miss one day → streak resets. The psychological cost of breaking a 30-day streak is disproportionate to the actual loss. That asymmetry is the entire mechanism. We also sell "streak shields" as a purchasable insurance item — a monetization surface disguised as user-friendly design.

**City leaderboards (Strava model):** Global rankings demotivate most players. City-tier rankings ("Top 10 in Almaty") are achievable for a much larger share of users. Achievable goals drive more engagement than aspirational ones. We segment by city, skill tier, and age group so nearly every user has a competitive bracket they can realistically climb.

**Gacha (mobile gaming):** Users spend internal currency on randomized cosmetic pulls. Variable reward schedules are the strongest behavioral reinforcement pattern known. We keep it cosmetics-only — ethical, and it sidesteps gambling regulation issues that have killed similar mechanics in other apps.

**Live streaming (TikTok Live model):** Any player can stream during a match. Viewers send in-app gifts. Streamer earns currency. This creates a **content creator economy inside the app** — top players stream because it earns them currency, their streams acquire new users, new users become players. User-generated content at zero marginal cost to us.

**Bi-weekly events:** Themed challenges with time-limited exclusive cosmetic rewards. Fixed scarcity window creates urgency. Identical to what drives Fortnite seasons and Pokémon GO events.

---

## Monetization

Three revenue streams, none dependent on each other:

### 1. Subscriptions

```
Personal — $9.99/mo
  Advanced AI analysis (longer context, deeper breakdown)
  Exclusive coach personalities
  Unlimited lesson library
  Priority matchmaking

Family — $19.99/mo
  Up to 5 accounts
  Family tournament bracket
  Shared progress dashboard
  Kids mode with parental visibility
```

Target conversion: 4–6% of MAU (industry average for this model is 3–8%). At 50,000 MAU and 5% conversion: 2,500 paying users × $10 = **$25,000 MRR from subscriptions alone**, before any IAP.

### 2. Cosmetic IAP via Stripe

Piece skins, board themes, avatar items, animated effects. One-time purchases. These exist because a large segment of players will never subscribe but will spend $2.99 on a piece skin. Captured revenue that subscriptions miss entirely.

Gacha pulls cost internal currency. Currency is earned in-game (slowly) or bought via Stripe. Pull rates are visible — this is a trust decision that also keeps us away from loot box legislation grey zones.

### 3. Live Stream Gifts

Viewers buy gifts (flower = 5 coins, crown = 50 coins) and send them during live matches. Streamer receives 70%, we take 30%. This scales with user engagement, not our development effort. The users generate the transactions.

---

## Why the Unit Economics Actually Work

The insight: **checkers has near-zero content creation cost** compared to chess.

Chess platforms need grandmaster content, opening theory databases, engine integrations, licensed game archives. We need a rules engine and a well-structured prompt. Our marginal cost of adding a new lesson, puzzle, or analysis feature is the cost of an API call — not a human expert.

AI coach cost per analysis: ~$0.003–0.008/session (Claude Haiku/Sonnet depending on depth). At $9.99/mo subscription, even a heavy user running 5 analyses/day = ~$0.45/month in API costs against $9.99 revenue. **95%+ gross margin on the AI feature specifically.**

CAC: leaderboards and streaming are inherently viral. A user who goes live brings in viewers. A user who climbs the city leaderboard shares their rank. Every social feature is a low-cost acquisition channel.

---

## The B2B Angle Nobody Sees Coming

Kids mode isn't just a UI toggle. It's a distinct product targeting parents and schools that want educational screen time. The value prop shifts completely:

- **For parents:** teaches strategic thinking, pattern recognition, patience
- **For schools:** a curriculum tool with progress tracking per student

This opens an institutional licensing channel that most consumer apps never touch. A single school district deal is worth more than thousands of individual subscriptions. The platform is already built — the institutional product is a sales motion, not an engineering problem.

---

## The Moat

The moat isn't the technology. Any team can build a checkers engine. The moat is:

- **The AI coach getting smarter per user** — personalized mistake pattern history accumulates over time; it's not transferable to a competitor
- **The social graph** — your city leaderboard rank means nothing if you move platforms
- **First-mover in an empty market** — network effects compound faster when there's no incumbent

There's no migration path for a user with 200 analyzed games, a 45-day streak, a top-10 rank in their city, and a coach that knows their specific tactical weaknesses. That's the retention endgame.

---

## Build Status

| Feature | Status |
|---|---|
| Core rules engine + minimax AI | ✅ Done |
| Real-time multiplayer (WebSocket) | ✅ Done |
| Post-game AI coach (Claude API) | ✅ Done |
| City leaderboard | ✅ Done |
| User profiles + XP progression | ✅ Done |
| Stripe subscriptions + IAP | ✅ Done (test mode) |
| "Upgrade to Pro" gate | ✅ Done |
| Live streaming (WebRTC) | 🔧 Architecture done, prototype in progress |
| Gacha system | 🔧 Logic done, UI in progress |
| React Native mobile | 📋 Web-first, mobile next |

---

## Stack

```
Frontend     React → React Native (mobile)
Realtime     Socket.io / WebSocket
Streaming    WebRTC + Socket.io signaling
AI           Anthropic Claude API (claude-sonnet-4-20250514)
Backend      Node.js + Express
Database     PostgreSQL
Auth         Firebase Auth
Payments     Stripe
Infra        Railway + Vercel
```

---

*The architecture is real, the integrations work, and the business model is grounded in patterns from platforms that have collectively made billions. This is a prototype that shows the full vision is buildable — not a mockup that pretends it already is.*
