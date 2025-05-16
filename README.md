<h2 align="center">Tokenized Cap Tables for the World’s Founders</h2>

<p align="center">
  <a href="https://stellar.org">
    <img src="https://user-images.githubusercontent.com/sponsor-stellar.png" alt="Stellar" height="21" />
  </a>
</p>

---

## What is GFO?

**GFO (Global Founder Ownership)** is a decentralized equity management platform for early-stage founders.  
Most teams don’t have a CFO, don’t understand deal terms, or burn cash on generic legal docs. GFO fixes that.

Founders log in with Google, build their cap table, simulate funding scenarios, and **tokenize equity on Stellar** via Soroban smart contracts — no wallet setup needed.

---

## Features

- 🧠 **Cap Table Wizard** – Add founders, roles, equity %s, vesting, cliffs  
- 💡 **Equity Simulator** – Run mock rounds, see dilution effects  
- 🔒 **Soroban Smart Contracts** – Mint and manage equity tokens  
- 🌍 **Custodial Wallets** – Onboard anyone, anywhere, without crypto UX friction  
- 📊 **Admin Dashboard** – Track tokenization status, founder metadata, and more  

---

## Images

### Cap Table Interface
![CapTable UI](https://user-images.githubusercontent.com/cap-table-ui.png)

### Tokenization Flow
![Token Flow](https://user-images.githubusercontent.com/token-flow.png)

---

## Stack

- **Frontend:** React (TSX) + Locofy + Tailwind  
- **Backend:** Firebase Auth + Firestore  
- **Smart Contracts:** Soroban (Rust) + Stellar token contract  
- **Wallets:** Custodial Stellar accounts generated per login  

### Tokenization Flow:
1. Founder logs in via Google  
2. App generates a Stellar keypair  
3. Cap table inputs saved to Firestore  
4. Soroban `init_founder()` mints equity tokens  
5. Status syncs to UI  

---

## Why It Stands Out

- 🌐 Designed for founders *outside the crypto bubble*  
- ⚙️ Built on real smart contracts, not just mock data  
- 🤝 Stellar integration makes global ESOs and token-based payroll possible  
- 📈 Fundraising simulation gives founders clarity, not chaos  

> “This is what startup equity should look like in 2025 — composable, programmable, and borderless.”

---

## Demo

- 🎥 [Watch the Demo (Video)](https://www.canva.com/design/DAGnnzEFi1Q/6Mz_D2K-fc1pCIYQ_oO8lA/watch?utm_content=DAGnnzEFi1Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb9900f63e1)

---

## Roadmap

- [x] Smart contract for founder minting  
- [x] Firebase Auth + walletless onboarding  
- [x] React frontend with cap table + simulation UI  
- [x] Token status syncing from chain to Firestore  
- [ ] Add investor simulation & drag-to-adjust rounds  
- [ ] Extend to employee stock options (ESOs)  
- [ ] Integrate Stellar anchor for off-ramping  
- [ ] Apply to Stellar Community Fund for scaling

---

## Attribution & Inspiration

- [Stellar + Soroban Docs](https://developers.stellar.org/)  
- [Lovable.dev](https://www.lovable.dev/)  
- [Firebase Authentication](https://firebase.google.com/products/auth)  

---

## License

MIT License — feel free to fork and build your own cap table tooling for global founders.
