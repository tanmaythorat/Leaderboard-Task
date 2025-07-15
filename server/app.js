const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/claim", require("./routes/claimRoutes"));

module.exports = app;
