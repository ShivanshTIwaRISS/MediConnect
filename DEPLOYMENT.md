# MediConnect Deployment Guide

This guide will walk you through hosting your application on **Aiven** (Database), **Render** (Backend), and **Vercel** (Frontend).

## 📋 Prerequisites
- GitHub Repository with your code (Done: https://github.com/ShivanshTIwaRISS/MediConnect)
- Accounts on:
  - [Aiven](https://aiven.io/)
  - [Render](https://render.com/)
  - [Vercel](https://vercel.com/)

---

## 🏗️ Step 1: Database (Aiven)

1. **Log in** to your Aiven Console.
2. Click **Create Service**.
3. Select **MongoDB**.
4. Choose a **Cloud Provider** and **Region** (e.g., Google Cloud / Your nearest region).
5. Select the **Plan** (Startup or Hobbyist usually works for testing).
6. Give it a name (e.g., `mediconnect-db`) and click **Create Service**.
7. Wait for the service to be "Running".
8. Copy the **Service URI** (Connection String). It looks like:
   `mongodb+srv://avnadmin:password@host-name.aivencloud.com:port/defaultdb?ssl=true`
9. **Important:** Add `/mediconnect` before the `?` to use a specific database name:
   `mongodb+srv://avnadmin:password@host-name.aivencloud.com:port/mediconnect?ssl=true`

   **Save this URI for the next step.**

---

## 🚀 Step 2: Backend (Render)

1. **Log in** to your Render Dashboard.
2. Click **New +** -> **Web Service**.
3. Connect your **GitHub Repository** (`ShivanshTIwaRISS/MediConnect`).
4. **Root Directory:** Enter `mediconnect-backend` (This is critical!).
5. **Runtime:** Node
6. **Build Command:** `npm install`
7. **Start Command:** `npm start`
8. Scroll down to **Environment Variables** and add:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (Generate a strong random string)
   - `JWT_EXPIRE`: `7d`
   - `MONGODB_URI`: (Paste the Aiven URI from Step 1)
   - `FRONTEND_URL`: (You will update this later with your Vercel URL, for now put `*`)
9. Click **Create Web Service**.
10. Wait for deployment to finish. Render will verify if the service is live.
11. **Copy the Backend URL** provided by Render (e.g., `https://mediconnect-backend.onrender.com`).

---

## 🌐 Step 3: Frontend (Vercel)

1. **Log in** to Vercel.
2. Click **Add New ...** -> **Project**.
3. Import your **GitHub Repository**.
4. **Framework Preset:** Create React App (should auto-detect).
5. **Root Directory:** Click "Edit" and select `mediconnect-frontend`.
6. Open **Environment Variables** and add:
   - `REACT_APP_API_URL`: `https://mediconnect-backend.onrender.com/api`
   *(Make sure to add `/api` at the end of your Render Backend URL)*
7. Click **Deploy**.
8. Wait for the deployment to complete.
9. **Copy the Frontend URL** (e.g., `https://mediconnect-frontend.vercel.app`).

---

## 🔄 Step 4: Final Configuration

1. Go back to your **Render Dashboard** (Backend).
2. Go to **Environment Variables**.
3. Update `FRONTEND_URL` to match your actual Vercel URL (e.g., `https://mediconnect-frontend.vercel.app`).
   *(This ensures CORS security only allows your frontend to connect).*
4. Save changes. Render will restart the backend automatically.

---

## 🎉 Done!

Your full-stack application is now live!
- **Frontend:** `https://mediconnect-frontend.vercel.app`
- **Backend:** `https://mediconnect-backend.onrender.com`
- **Database:** Hosted on Aiven

**Test it out:**
1. Open the Vercel URL.
2. Sign up a new user (this verifies Database write access).
3. Log in (verifies Backend logic and JWT).
