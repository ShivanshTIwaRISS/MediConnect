#!/bin/bash

# MediConnect Setup Script
# This script helps you set up the MediConnect application

echo "🏥 MediConnect Setup Script"
echo "============================"
echo ""

# Check if MongoDB is needed
echo "📋 Step 1: MongoDB Configuration"
echo ""
echo "You need a MongoDB database. Choose an option:"
echo "  1. Local MongoDB (requires MongoDB installed)"
echo "  2. MongoDB Atlas (free cloud database)"
echo "  3. Aiven (as per project requirements)"
echo ""
read -p "Enter your MongoDB connection string: " MONGODB_URI

# Generate JWT secret
echo ""
echo "🔐 Step 2: Generating JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "Generated: $JWT_SECRET"

# Create backend .env file
echo ""
echo "📝 Step 3: Creating backend .env file..."
cat > mediconnect-backend/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=$MONGODB_URI

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
EOF

echo "✅ Backend .env created"

# Create frontend .env file
echo ""
echo "📝 Step 4: Creating frontend .env file..."
cat > mediconnect-frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

echo "✅ Frontend .env created"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 Next Steps:"
echo "  1. Start the backend:"
echo "     cd mediconnect-backend && npm run dev"
echo ""
echo "  2. In a new terminal, start the frontend:"
echo "     cd mediconnect-frontend && npm start"
echo ""
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed instructions, see README.md"
