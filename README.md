# SKILLTOBILL

**SkillToBill (STB)** is an early-stage platform that connects beginners and freelancers (Earners) with clients. This is the **Phase-1 MVP**, focused on stability, usability, and beginner-friendliness.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Phase-1 Features](#phase-1-features)
4. [Getting Started](#getting-started)
5. [Running the Project](#running-the-project)
6. [Future Plans](#future-plans)
7. [Contact](#contact)

---

## Project Overview
STB aims to help users:
- Learn new skills
- Earn income as freelancers
- Track progress in courses
- Connect with clients (Phase-2)

Phase-1 MVP focuses on:
- Core signup/login flows
- Course enrollment & tracking
- In-app notifications
- Beginner-friendly dashboards
- Stable backend & frontend

---

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** JWT, bcrypt
- **Image Upload:** Multer
- **Deployment:** Free hosting (Render / Vercel)

---

## Phase-1 Features

### Backend / API
- Stable signup/login for **Earner** and **Client**
- Role-based access & redirects
- Course tracking (`enrolledCourses` array in User model)
- APIs:
  - `GET /my-courses` — fetch enrolled courses + progress
  - `POST /:id/enroll` — enroll in a course
  - `POST /:id/complete` — mark course complete
- Simple **in-app notifications**:
  - "Course enrolled successfully"
  - "Course marked as completed"
  - "Profile updated"
  - "Welcome to SkillToBill"

### Frontend / UX
- Beginner-friendly error messages
- Course progress displayed as `% Completed` or `Completed`
- Breadcrumb/back navigation in learner player
- Profile page with dashboard content
- Image upload for profile picture
- Password visibility toggle in signup/login forms

### Client Side (Placeholder)
- Static/sample tasks in dashboard
- Simple contact/info form
- Clear labels: "Coming Soon" / "Phase-2"

### Testing & Cleanup
- Debug logs removed
- End-to-end flows verified:
  signup → login → dashboard → courses → enroll → progress → notifications
- Minor UX polish done

---

## Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/sameer-3492/SKILLTOBILL.git
cd SKILLTOBILL
Install dependencies

bash
Copy code
npm install
Set environment variables (.env file)

env
Copy code
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
Running the Project
Start Backend
bash
Copy code
npm run dev
Open Frontend
Open index.html or relevant dashboard HTML in browser

Backend APIs are already connected

Future Plans (Phase-2+)
Payments (Razorpay integration)

Real-time chat / messaging

Ratings & reviews

Public freelancer marketplace

Course creation for Earners

Admin dashboard & search/filter functionality

Contact
Founder: Sameer Khan
Email: sameerk41207@gmail.com
GitHub Repo: https://github.com/sameer-3492/SKILLTOBILL

