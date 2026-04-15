# 🚀 TaskFlow AI

### Smart Kanban Project Management Tool

TaskFlow AI is a modern, Trello-inspired Kanban project management application built with a powerful full-stack architecture. It combines an intuitive drag-and-drop interface with smart risk analysis and productivity insights to help users manage tasks efficiently.

---

## ✨ Features

### 📌 Dynamic Kanban Board

* Drag and drop lists and cards seamlessly
* Organize workflows visually and efficiently

### ⚠️ Smart Risk Indicator

* Cards dynamically change color based on:

  * Deadline proximity
  * Checklist completion

### 📊 Productivity Dashboard

* Visual insights into:

  * Task distribution
  * Completion rates
* Built using Recharts for interactive analytics

### 🎨 Premium UI/UX

* Modern dark theme
* Glassmorphism design
* Smooth animations using Framer Motion

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* Lucide Icons
* @hello-pangea/dnd

### Backend

* Node.js
* Express.js
* Sequelize ORM

### Database

* MySQL

---

## ⚙️ Setup Instructions

### 1️⃣ Database Setup

1. Open MySQL (Workbench or terminal)
2. Run the SQL script:

```bash
server/schema.sql
```

This will:

* Create the database `taskflow_ai`
* Create required tables
* Insert initial seed data

---

### 2️⃣ Environment Configuration

Create or update `.env` file inside `server/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=taskflow_ai
```

---

### 3️⃣ Install Dependencies

```bash
# Backend setup
cd server
npm install

# Frontend setup
cd ../client
npm install
```

---

### 4️⃣ Run the Application

Open **two terminals**:

#### ▶️ Backend

```bash
cd server
npm run dev
```

#### ▶️ Frontend

```bash
cd client
npm run dev
```

📍 App runs at:

```
http://localhost:5173
```

---

## 🧠 Smart Logic

### 🔴 Risk Indicator System

| Status         | Condition          |
| -------------- | ------------------ |
| 🔴 Overdue     | Past due date      |
| 🟠 High Risk   | ≤ 2 days remaining |
| 🟡 Medium Risk | 3–5 days remaining |
| 🟢 Low Risk    | > 5 days remaining |

---

### ⚡ "At Risk" Badge

A dynamic badge appears when:

* Task deadline is within 2 days
  **AND**
* Checklist is incomplete

---

## 📂 Project Structure

```
TaskFlow-AI/
│
├── client/        # Frontend (React)
├── server/        # Backend (Node + Express)
├── README.md
```

---

## 🚀 Future Enhancements

* User authentication (JWT / OAuth)
* Real-time collaboration (WebSockets)
* Notifications & reminders
* Cloud deployment (AWS / Vercel)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 💡 Author

Built by *Khushi*
