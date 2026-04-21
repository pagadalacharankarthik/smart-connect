# SmartConnect - Community Event Management Platform

A full-stack modern event management platform that connects communities with events.  
Eventify enables organizations to host events efficiently while helping individuals discover, register, and earn recognition through certificates and gamification.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mindarchitecture8-9617s-projects/v0-smart-connect)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

---

## 🚀 Problem Statement

### 🔹 For Communities
Manual event management is time-consuming. Organizers need tools to:
- Create and manage events
- Track registrations
- Monitor attendance and performance

### 🔹 For Attendees
Users struggle to:
- Find quality events
- Get recognition for participation
- Stay engaged with communities

---

## 💡 Solution

SmartConnect provides a unified platform where:
- Organizers manage events with analytics dashboards
- Users discover events, register instantly, and earn certificates
- Gamification (badges, points, leaderboard) keeps users engaged

---

## ✨ Features

- 📝 **Event Discovery & Registration**  
  Browse events with filters, register instantly, and get confirmation

- 📅 **Event Management**  
  Create events, track registrations, mark attendance

- 📜 **Auto-Generated Certificates**  
  PDF certificates generated automatically after participation

- 🏆 **Gamification System**  
  Earn badges (Bronze / Silver / Gold), gain points, climb leaderboard

- 💬 **Community Feedback**  
  Ratings, reviews, and discussion threads

- 📊 **Analytics Dashboard**  
  Real-time charts for performance tracking

- 🤖 **AI Chatbot**  
  Answers event queries and provides insights

- 🌓 **Dark Mode**  
  Persistent theme toggle

- 📈 **Live Event Insights**  
  Real-time metrics (views, registrations, attendance)

- 👥 **Leaderboard**  
  Top users ranked with medals 🥇🥈🥉

- 📱 **Responsive Design**  
  Optimized for mobile, tablet, and desktop

---

## 🛠 Tech Stack

**Frontend**
- Next.js 15+
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

**Other Tools**
- Recharts (data visualization)
- jsPDF + html2canvas (certificate generation)
- React Hooks + Context API (state management)
- localStorage (data storage)
- Lucide React (icons)

**Deployment**
- Vercel

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/pagadalacharankarthik/smart-connect.git
cd smart-connect
```
###2. Install Dependencies
```bash
npm install
```
###3. Run Development Server
```bash
npm run dev
```
###4. Open App
- Visit: http://localhost:3000

---
## Project Structure
smartconnect/
├── app/
│   ├── dashboard/
│   ├── events/
│   ├── event/[id]/
│   ├── create-event/
│   ├── org-dashboard/
│   ├── my-certificates/
│   ├── admin/analytics/
│   ├── login/signup/
│   └── layout.tsx
│
├── components/
│   ├── navbar.tsx
│   ├── chatbot.tsx
│   ├── leaderboard.tsx
│   ├── event-insights.tsx
│   └── ...
│
├── lib/
│   ├── storage.ts
│   ├── dummy-data.ts
│   └── utils.ts
│
└── public/

---
##🌐 Deployment (Vercel)


#1. Push to GitHub
```bash
git add .
git commit -m "Eventify deployment"
git push origin main
```
#2. Deploy
- Go to https://vercel.com
- Click New Project
- Import your GitHub repo
- Click Deploy
- Your app will be live

####🌟 Final Note

#Eventify — Empowering Communities Through Events



















