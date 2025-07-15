#  Leaderboard Task – React + Node.js

This is a full-stack Leaderboard application built as part of the **Round 1 Technical Task**.

##  Live URLs

- **Frontend (Netlify)**: [https://leaderboard-task-tanmay.netlify.app](https://leaderboard-task-tanmay.netlify.app)
- **Backend (Render)**: [https://leaderboard-task-jqww.onrender.com](https://leaderboard-task-jqww.onrender.com)
- **GitHub Repo**: [https://github.com/tanmaythorat/Leaderboard-Task](https://github.com/tanmaythorat/Leaderboard-Task)

---

##  Task Features Implemented

- ✅ Add new users via form input
- ✅ Claim random points (1-10) per user
- ✅ Save each claim in a `ClaimHistory` collection (MongoDB)
- ✅ Display dynamic rankings based on total points
- ✅ Real-time UI updates after each claim
- ✅ Full leaderboard with clean UX
- ✅ Claim history with filtering per user
- ✅ Responsive layout using TailwindCSS
- ✅ Backend deployed on Render, Frontend on Netlify

---

##  Tech Stack

- **Frontend**: ReactJS + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas)
- **Deployment**: Render (backend) & Netlify (frontend)

---

##  Folder Structure

leaderboard/
│
├── client/ # React frontend
│ ├── components/ # Reusable UI components
│ ├── services/ # API service abstraction
│ └── App.jsx # App layout and tab handling
│
├── server/ # Node.js backend
│ ├── models/ # MongoDB schemas (User, ClaimHistory)
│ ├── routes/ # Express routes for users and claims
│ └── server.js # Entry point for backend


