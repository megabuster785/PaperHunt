# PaperHunt

**PaperHunt** is a full-stack web application to explore, fetch, and manage research papers from arXiv and GitHub. It includes user authentication, email verification, paper bookmarking, profile management, and a trending section.

---

## Features

### Authentication & User Management
- JWT-based login and registration
- Email verification using Nodemailer
- Password reset via email

### Paper Management
- Search papers by keyword
- Select source: arXiv or GitHub
- Fetch and add papers
- Bookmark and remove papers

### Profile
- View bookmarked and added papers

### Trending
- Displays trending papers on homepage

---

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Nodemailer for emails

---

## Project Structure


PaperHunt/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── main.jsx
├── .gitignore
├── README.md




## Getting Started

### 1. Clone the Repo

bash
git clone https://github.com/your-username/PaperHunt.git
cd PaperHunt


### 2. Backend Setup
bash
cd backend
npm install


#### Create `.env` in backend with:

PORT=5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_Access_TokenSecret
REFRESH_TOKEN_SECRET=your_Refresh_TokenSecret
EMAIL_USER=your_email
EMAIL_APP_PASS=your_email_password_or_app_password

#### Start Backend

bash
node server.js


### 3. Frontend Setup

bash
cd ../frontend
npm install
npm start




## Running the App

- Visit `http://localhost:5173`
- Register and verify your email
- Start searching and managing papers

---

## Notes

- Make sure MongoDB is running locally or use MongoDB Atlas.
- Gmail users may need to use an **App Password** instead of a regular password for Nodemailer.
- Both frontend and backend must run simultaneously in separate terminals.

---


