# Character AI Lite

A lightweight, modern Character AI style roleplay chat web application.
Optimized for low-cost operation, mobile devices, and immersive storytelling in Bengali and English.

## Features
- **Create & Manage Characters**: Set name, personality, nationality, scenario, greeting message, and more.
- **Immersive Roleplay**: AI stays in character, adapting to the defined personality and nationality.
- **Language Support**: Primarily conversational Bengali, mixed naturally with English.
- **Lightweight Memory**: Sends System Prompt + last 20 messages for context, keeping token usage low.
- **Responsive Design**: Beautiful UI works perfectly on mobile, tablet, and desktop.
- **Dark Mode**: Enabled by default, with a toggle in settings.
- **Image Generation**: Disabled by default. Can be enabled to describe images when explicitly prompted.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Python FastAPI
- **Database**: SQLite & SQLAlchemy
- **AI Integration**: Groq (Primary, fast & free tier), OpenRouter (Secondary)

---

## Local Development Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ (if you have Node.js installed)

*Note: The frontend is pre-structured. If you don't have Node.js, you'll need to install it to run the React development server.*

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Create a `.env` file in the `backend` folder:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

---

## Deployment Guide

The platform is designed to be hosted for free or at very low cost.

### Deploying Frontend to Cloudflare Pages (Free)
1. Push your `character-ai-lite` code to a GitHub repository.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Pages**.
3. Click **Connect to Git** and select your repository.
4. Set the Build Settings:
   - Framework preset: **React** or **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory (important): `/frontend`
5. Click **Save and Deploy**. Cloudflare will build and host your frontend globally.

### Deploying Backend to Render (Free Tier)
1. Log in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the settings:
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. Add Environment Variables:
   - `GROQ_API_KEY`: Your key.
6. Click **Create Web Service**. 
   *(Note: Free instances spin down after inactivity, causing a 50s delay on first boot).*
7. **Important**: Once the backend is deployed, copy the Render URL (e.g., `https://my-backend.onrender.com/api`).
8. Go back to your frontend code, open `frontend/src/services/api.js`, and change `BASE_URL` to your new Render URL. Commit and push so Cloudflare updates the frontend.

---

## Future Extensions Guide
The architecture is designed to easily support future additions:
- **Multiple AI Providers**: Easily add new ones in `backend/app/services/ai_service.py`.
- **Character Categories**: Add a `category_id` to the `Character` model in `models.py`.
- **Voice Generation (TTS)**: Integrate ElevenLabs API in `ai_service.py` to stream audio based on the text response.
- **Database Migration**: Swap SQLite for PostgreSQL by changing `DATABASE_URL` in `database.py`. No other code changes are needed thanks to SQLAlchemy.
