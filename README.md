Telegram Mini App
A Telegram Mini App for earning points by watching ads and withdrawing via DANA.
Setup

Install dependencies: npm install
Create a .env file with:REACT_APP_BOT_TOKEN=7380366315:AAH9dnuF50OpUDjGIy06bLioyEa9Fr4bfS8


Run locally: npm start
Deploy to Netlify: npm run build and netlify deploy --prod
Deploy Firestore rules: firebase deploy --only firestore:rules

Features

Earn 1 point per ad watched (1 point = 1 Rupiah).
Withdraw at 20,000 points via DANA.
Withdrawal requests sent to Telegram channel -1002697590626.

