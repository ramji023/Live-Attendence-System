# 🚀 Live Attendance System

A real-time employee attendance tracking system built with modern web technologies. Employees can mark their attendance, and admins can monitor live activity instantly.

---

## 🧠 Tech Stack

* **Frontend:** React.js + Tailwind CSS
* **Backend:** Node.js + Express.js
* **Real-time:** Socket.IO

---

## ✨ Features

### 👤 Employee

* Login as employee
* View live clock
* Check-In / Check-Out functionality
* Prevent multiple check-ins
* Clean and minimal dashboard

### 🛠 Admin

* Login as admin
* View real-time attendance updates
* Filter employees by:

  * Date
  * Active users
  * All users
* View employee logs (Check-In / Check-Out times)

---

## ⚡ Real-Time Functionality

* Instant updates using Socket.IO
* Admin dashboard updates without refresh
* Live tracking of active employees

---

## 📁 Project Structure

```
frontend/    → React frontend  
backend/    → Node + Express + Socket.IO backend  
```

---

## 🚀 Getting Started

### 1. Clone the repo

```
git clone <your-repo-url>
cd attendance-system
```

### 2. Install dependencies

```
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 3. Run the project

```
# start backend
cd backend
pnpm run dev

# start frontend
cd ../frontend
pnpm run dev
```

---

## 🔮 Future Improvements

* Improve UI/UX for a more polished experience
* Add secure authentication 
* Better error handling and user feedback
* Add search and advanced filters
* Store attendance history in database
* Add analytics dashboard

---

---

## 💡 Author

Built with ❤️ by Ram
