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

## 📋 Prerequisites & Environment Variables

Make sure you have the following API credentials ready. You will need to place these in a `.env` file within the `/backend` folder.

- **PORT**: `5000`
- **MONGO_URI**: Your MongoDB Atlas connection string.
- **JWT_SECRET**: A secure, random string for authentication.
- **GEMINI_API_KEY**: API key from Google AI Studio.
- **CLOUDINARY_CLOUD_NAME**: From your Cloudinary dashboard.
- **CLOUDINARY_API_KEY**: From your Cloudinary dashboard.
- **CLOUDINARY_API_SECRET**: From your Cloudinary dashboard.

---

## 🛠️ Local Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Nikhitha-spec/deskora.git
   cd deskora
   ```

2. **Backend Configuration**
   - Navigate to `/backend`
   - Create your `.env` file and populate it with the secrets above.
   - Run `npm install`
   - **Seed the Database**: Run `node seed.js` to create the default test accounts and 25+ KB articles.
   - Start the server: `node server.js`

3. **Frontend Configuration**
   - Navigate to `/frontend`
   - Run `npm install`
   - Start the development server: `npm run dev`

---

## 🚀 Deployment (Vercel)

This application is configured out-of-the-box for a **multi-service deployment** on Vercel via the `experimentalServices` architecture (see `vercel.json`).

1. Connect your GitHub repository to Vercel.
2. In the Vercel Project **Settings -> General**, change the **Framework Preset** to **"Services"** so Vercel builds the frontend and backend jointly.
3. Crucially, go to **Settings -> Environment Variables** in Vercel and **paste all the variables from your local `.env` file**. Do not skip this, or the backend will crash!
4. **Redeploy** the application from your Deployments tab to finalize.

---

## 🧪 Test Accounts

After running the seed script (`node seed.js`), the following test accounts are available to explore different roles on the platform. All accounts share the same password: **`password123`**.

- **Admin Account**: `admin@deskora.com`
- **Billing Agent**: `billing@deskora.com`
- **Technical Agent**: `tech@deskora.com`
- **General Agent**: `general@deskora.com`
- **Standard User**: `user@example.com`

---

## 🛡️ Role-Based Access
- **Admin**: Full platform control, dashboard analytics, and user management.
- **Agent**: Handle assigned tickets, use the AI Co-pilot, and update ticket statuses.
- **User**: Search the Knowledge Base, "Ask AI", create tickets, and chat with agents.

