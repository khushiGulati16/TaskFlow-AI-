# TaskFlow AI – Smart Kanban Project Management Tool

TaskFlow AI is a premium, Trello-inspired Kanban tool built with React, Node.js, and MySQL. It features smart risk indicators, drag-and-drop interactions, and a productivity insights dashboard.

## 🚀 Key Features

- **Dynamic Kanban Board**: Drag and drop lists and cards to organize your workflow.
- **Smart Risk Indicator**: Cards change color based on urgency and checklist completion.
- **Productivity Dashboard**: Visualize task distribution and completion rates with Recharts.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: MySQL.
- **Interactions**: @hello-pangea/dnd.

---

## ⚙️ Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or terminal).
2. Run the script found in `server/schema.sql`. This will create the database `taskflow_ai`, set up the tables, and seed initial data.

### 2. Environment Configuration
Check `server/.env` and ensure the database credentials match your local MySQL setup:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=taskflow_ai
```

### 3. Install Dependencies
Run the following in the root directory:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Application
You will need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 🧠 Smart Logic

### Risk Indicator
The card border color updates dynamically:
- 🔴 **Overdue**: Past due date.
- 🟠 **High Risk**: <= 2 days remaining.
- 🟡 **Medium Risk**: 3-5 days remaining.
- 🟢 **Low Risk**: > 5 days remaining.

### "At Risk" Badge
A special animated badge appears if a card is within 2 days of its deadline **and** has incomplete checklist items.
