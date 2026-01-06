# MediConnect Quick Start Guide

## Issue: Port 5000 Already in Use ✅ FIXED

The port conflict has been resolved. I've:
1. ✅ Killed processes blocking port 5000
2. ✅ Created `.env` files for both backend and frontend

## Issue: MongoDB Not Running ⚠️ NEEDS ATTENTION

Your backend needs MongoDB to be running. Here are your options:

### Option 1: Start MongoDB (Recommended for Local Testing)

```bash
# Create data directory if it doesn't exist
mkdir -p ~/data/db

# Start MongoDB in a new terminal window
mongod --dbpath ~/data/db
```

Keep this terminal open - MongoDB will run here.

### Option 2: Use MongoDB Atlas (Cloud - Free)

If local MongoDB is problematic, use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster (M0 Sandbox)
3. Create a database user
4. Get your connection string
5. Update `mediconnect-backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediconnect
   ```

### Option 3: Fix MongoDB Service

```bash
# Stop any existing MongoDB processes
brew services stop mongodb-community@6.0

# Remove old plist file
rm ~/Library/LaunchAgents/homebrew.mxcl.mongodb-community@6.0.plist

# Restart the service
brew services start mongodb-community@6.0
```

## After MongoDB is Running

Your nodemon should automatically restart and you'll see:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running in development mode on port 5000
```

Then open http://localhost:3000 in your browser!

## Quick Test

Once MongoDB is running, test the backend:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"success":true,"message":"MediConnect API is running","timestamp":"..."}
```

## Current Status

✅ Backend code ready
✅ Frontend code ready  
✅ Dependencies installed
✅ .env files created
✅ Port 5000 cleared
⚠️ **MongoDB needs to be started**

Choose one of the options above to start MongoDB, and your application will be ready!
