# 🌌 Deskora: The Intelligent Support Ecosystem

Deskora is a production-ready, AI-driven customer support platform designed to transform traditional ticketing into a high-end, real-time communication experience. Powered by the MERN stack and Google Gemini AI, Deskora automates routing, synthesizes knowledge, and provides agents with a data-driven command center.

---

## 🚀 Key Features

### 🤖 AI Intelligence (Powered by Gemini 1.5)
- **Smart Triage**: Automated ticket classification into Billing, Technical, or General categories.
- **Sentiment Detection**: Real-time analysis of user frustration levels to prioritize urgent cases.
- **"Ask AI Expert"**: A self-service portal feature that reads the Knowledge Base to provide direct, synthesized answers to user queries.
- **AI Co-pilot**: Suggested agent replies to ensure faster, more accurate resolution times.

### 📚 Strategic Knowledge Base
- **Comprehensive Library**: Pre-loaded with 25+ professional support articles across multiple technical and billing domains.
- **Category Filtering**: Seamless navigation through Getting Started, Technical, Billing, and General guides.
- **Global Reach**: Instant AI-powered translation for multi-language support.

### 📊 Performance Analytics
- **Dynamic Dashboard**: Interactive data visualization using **Recharts** (Donut & Pie charts).
- **Metric Tracking**: Real-time monitoring of ticket distribution, resolution rates, and agent workload.
- **Sentiment Dots**: Visual indicators for quick identification of high-priority tickets.

### ☁️ Modern Communication & Media
- **Real-time Chat**: Instant agent-customer interaction powered by **Socket.io**.
- **Media Uploads**: Integrated **Cloudinary** support for screenshots, logs, and profile pictures.
- **Glassmorphism UI**: A premium, frosted-glass design system with a seamless **Light/Dark mode** toggle.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed and configured:

### ⚙️ Environments
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: A running instance (Local MongoDB or MongoDB Atlas)

### 🔑 API Credentials
You will need the following API keys to enable the full feature set:
- **Google Gemini API**: For AI classification, translation, and expert responses.
- **Cloudinary**: 
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- **JWT Secret**: A secure string for token-based authentication.

---

## 🛠️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd deskora
   ```

2. **Backend Configuration**
   - Navigate to `/backend`
   - Create a `.env` file with the keys mentioned in Prerequisites.
   - Run `npm install`
   - Seed the database: `node seed.js` (Includes initial 25+ articles)
   - Start the server: `node server.js`

3. **Frontend Configuration**
   - Navigate to `/frontend`
   - Run `npm install`
   - Start the dev server: `npm run dev`

---

## 🛡️ Role-Based Access
- **Admin**: Full platform control, dashboard analytics, and user management.
- **Agent**: Handle assigned tickets, use the AI Co-pilot, and update ticket statuses.
- **User**: Search the Knowledge Base, "Ask AI", create tickets, and chat with agents.

---

*Built with ❤️ by the Deskora Team*
