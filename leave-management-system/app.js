
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const connectDB = require("./config/db");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", leaveRoutes);

// Start Server
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
