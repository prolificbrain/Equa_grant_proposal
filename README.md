# EQuA v2 – Developer README
*Prototype source code reference*

This repo hosts the front-end prototype submitted for the **World Foundation Spark Track** grant. Product-level storytelling now lives in `docs/EQUA_Grant_Proposal.md`. Use this README strictly for cloning, running, and contributing.

> **New Feature**: This version includes our proprietary on-device memory system based on graph neural networks with a layered cluster approach for secure, private relationship memory.

---

## 🚀 Quick Start
```bash
# Install deps
npm install

# (Optional) add your OpenAI key – app still works without it
echo "VITE_OPENAI_API_KEY=your_api_key_here" > .env

# Run dev server
npm run dev
```

## 📦 Production Build & Preview
```bash
npm run build   # generates dist/
npm run preview # serve production bundle locally
```

---

## 🏗️ Project Structure
```
src/
├─ pages/        # One page per pillar + onboarding/success
├─ components/   # Reusable UI components
├─ store/        # Zustand state management
├─ utils/        # Helper functions and mocks
├─ memory/       # On-device memory system implementation
│  ├─ graph/     # Graph neural network architecture
│  ├─ security/  # Encryption and privacy controls
│  └─ insights/  # Memory-based relationship insights
├─ assets/       # Design assets
└─ index.css     # Tailwind CSS + custom styles
```

## 🖌️ Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Zustand state management
- OpenAI GPT-4 (via simple fetch)
- Graph Neural Networks (TensorFlow.js)
- Local encryption library (TweetNaCl.js)
- IndexedDB for secure on-device storage

---

### AI Configuration
Full setup instructions and the system prompt are preserved in **`docs/APPENDIX_A_AI_SETUP.md`**.

### Memory System
The proprietary memory system architecture and implementation details are available in **`docs/APPENDIX_D_Memory_System.md`**.

### User Journey & UI Visuals
A comprehensive visual walkthrough of the user experience is available in **`docs/EQUA_PDF_UI_visuals.pdf`**.

### Tokenomics & Vision Docs
Deep-dive appendices: `docs/APPENDIX_B_Tokenomics.md`, `docs/APPENDIX_C_Multiplayer_Vision.md`.

---

**Happy hacking!**
