# 📊 Statastic — Fighter Management System

Statastic is a full-stack web application for managing combat sports fighters, fight history, and performance measurements in one centralized system. The app is designed around real gym workflows, allowing authenticated users to track records, monitor physical data, and manage fighter profiles efficiently.

## 🚀 Features

User authentication with protected routes

Create, edit, and delete fighter profiles

Track fight history with outcomes, methods, and promotions

Record and manage fighter measurements (height, weight, dates)

Automatically calculated fighter records (W-L-D, finishes)

Responsive UI with structured navigation and tabs

---

## 🛠 Tech Stack

### Frontend

React

TypeScript

React Router

Tailwind CSS / Material UI

### Backend

Node.js

Express

PostgreSQL

JWT Authentication

---

## 🧠 Architecture & Ownership

Designed the relational database schema for fighters, fights, and measurements

Built RESTful APIs with full CRUD functionality and authentication

Implemented client-side routing, forms, and conditional UI based on auth state

Owned the project end-to-end from planning and data modeling to feature implementation

---

### 📦 Installation
git clone https://github.com/your-username/statastic.git
cd statastic
npm install


Start the client and server in separate terminals:

npm run dev

🔒 Environment Variables

Create a .env file with:

DATABASE_URL=
JWT_SECRET=

### 📌 Status

This project is actively developed as a portfolio piece and foundation for future features such as analytics dashboards and role-based access.
