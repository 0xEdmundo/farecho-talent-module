# Farecho x Talent Protocol Integration Module

This repository serves as a modular, plug-and-play integration package for adding **Talent Protocol API v2** reputation features to the **Farecho** Farcaster mini-app.

It fetches on-chain user data, calculates a "Builder Score," and renders a "Gamer-Style" profile card with verified credentials (badges).

---

## 📂 Repository Structure

This module is designed to be dropped directly into a Next.js (App Router) project.

```text
/
├── types/
│   └── talent.ts           # Type definitions for API response & internal models
├── lib/
│   └── talent-service.ts   # Core logic: fetching, caching, tier calculation
├── components/
│   └── TalentCard.tsx      # UI Component (Server Side) with Tailwind CSS
├── .env.example            # Environment variables template
└── README.md               # Documentation
