---
title: Deskora
emoji: 🎧
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
---

# Deskora: Intelligent Customer Support Ecosystem

Deskora is a sophisticated, AI-driven customer support platform designed to transition traditional ticketing systems into high-performance, real-time communication hubs. Built using the MERN stack and integrated with Google Gemini AI, Deskora automates complex support workflows, provides deep analytical insights, and offers a premium user experience through modern design principles.

---

## Core Capabilities

### AI-Driven Intelligence
*   **Automated Triage**: Tickets are automatically classified into Billing, Technical, or General categories using advanced NLP.
*   **Sentiment Analysis**: Real-time detection of user sentiment to prioritize urgent or high-frustration cases.
*   **Intelligent Routing**: Tickets are dynamically assigned to agents based on their specific category expertise and current workload.
*   **AI Knowledge Synthesis**: Users can query the Knowledge Base via a natural language "Ask AI" interface for immediate, synthesized answers.

### Strategic Knowledge Management
*   **Professional Article Library**: Includes over 25 pre-authored support articles covering multiple domains.
*   **Hierarchical Organization**: Seamless filtering by category, including Getting Started, Technical Support, Billing, and General FAQ.
*   **Global Accessibility**: Multi-language support through AI-powered translation frameworks.

### Advanced Analytics Dashboard
*   **Role-Based Data Views**: Personalized dashboards for Users, Agents, and Admins.
*   **Real-time Monitoring**: Visual tracking of ticket volume, resolution rates, and category distribution via Recharts.
*   **Workload Optimization**: Admin-level visibility into agent capacity and average response times.

### Professional Identity and Communication
*   **Comprehensive Profiles**: Support for detailed professional metadata including Job Titles, Company Names, and Phone Numbers.
*   **Real-time Communication**: Instant messaging capabilities between agents and customers powered by Socket.io.
*   **Media Integration**: Seamless management of screenshots and technical logs via Cloudinary integration.
*   **Unified Design System**: A premium glassmorphism interface with fully synchronized light and dark modes.

---

## Technical Stack

*   **Frontend**: React.js, Lucide Icons, Recharts, Socket.io-client.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Atlas).
*   **AI Engine**: Google Gemini 1.5 Pro.
*   **Media**: Cloudinary.
*   **Real-time**: Socket.io.

---

## Environment Configuration

Create a `.env` file in the `/backend` directory with the following variables:

| Variable | Description |
| :--- | :--- |
| PORT | The server port (e.g., 5000) |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secure string for authentication tokens |
| GEMINI_API_KEY | Google AI Studio API Key |
| CLOUDINARY_CLOUD_NAME | Cloudinary Cloud Identifier |
| CLOUDINARY_API_KEY | Cloudinary API Key |
| CLOUDINARY_API_SECRET | Cloudinary API Secret |

---

## Installation and Setup

### 1. Repository Initialization
```bash
git clone https://github.com/Nikhitha-spec/deskora.git
cd deskora
```

### 2. Backend Setup
```bash
cd backend
npm install
# Populate .env with necessary credentials
# Seed the database with initial KB articles and test users
node seed.js
# Start the production-ready server
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Launch the development environment
npm run dev
```

---

## Deployment via Vercel

Deskora is pre-configured for multi-service deployment using Vercel's `experimentalServices` architecture.

1.  Link the repository to your Vercel account.
2.  Set the **Framework Preset** to **"Services"** in Project Settings.
3.  Configure all environment variables identified in the Configuration section within Vercel's Environment Variables dashboard.
4.  Execute a full redeploy to initialize the joint frontend and backend services.

---

## Local Development Accounts

The seeding process (`node seed.js`) generates several test accounts for role-based exploration. The default password for all pre-seeded accounts is **`password123`**.

*   **Administrator**: admin@deskora.com
*   **Billing Specialist**: billing@deskora.com
*   **Technical Engineer**: tech@deskora.com
*   **General Support**: general@deskora.com
*   **Standard Customer**: user@example.com

---

## Role-Based Access Control

*   **Administrators**: Full system governance, global analytics, and user management.
*   **Agents**: Specialized ticket handling, AI co-pilot assistance, and workload tracking.
*   **Users**: Knowledge base access, self-service AI queries, and ticket lifecycle management.
