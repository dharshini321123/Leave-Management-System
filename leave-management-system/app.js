
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

// Enable CORS for GitHub Pages
app.use(cors({
    origin: "https://dharshini321123.github.io"
}));

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", leaveRoutes);

// Start Server
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
