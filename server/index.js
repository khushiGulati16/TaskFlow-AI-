const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', apiRoutes);

const startServer = async () => {
    await connectDB();

    // ✅ SAFE SYNC
    await sequelize.sync({ alter: true });

    console.log('Database synced');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();