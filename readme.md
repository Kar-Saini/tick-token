# 🎟️ Tick Token Generator

This is a Solana-based full-stack application that lets users create, store, and mint compressed NFTs (cNFTs) on the blockchain using the Metaplex Bubblegum program. Tokens can be associated with events and later claimed via QR codes.

---

## 🚀 Features

- 🌳 Merkle tree creation for storing cNFTs
- 🪙 Minting tokens as compressed NFTs using `mintV1`
- 🧾 Token metadata storage in PostgreSQL (via Prisma)
- 📦 API endpoints for creating tokens and minting
- 🔒 Secure environment variables with a wallet keypair
- 📷 Generates QR codes for token claiming
- 📚 Uses Metaplex Foundation's `mpl-bubblegum` and `umi` libraries

---

## 🧱 Stack

- **Backend**: Next.js (`app/actions`)
- **Blockchain**: Solana (Devnet), `@metaplex-foundation/mpl-bubblegum`, `@metaplex-foundation/umi`
- **Database**: Prisma + PostgreSQL
- **QR Code**: `qrcode` npm package

---

## 📁 Project Structure

```bash
.
├── app/
│   ├── actions/
│   │   └── createNewToken.ts   # Main server action to create & mint tokens
│   └── lib/
│       ├── utils.ts            # Prisma client
│       └── types.ts            # Token types
├── prisma/
│   └── schema.prisma           # Prisma schema
├── .env                        # Environment variables
└── README.md                   # This file
```
