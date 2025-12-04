// src/server.js
import express from "express";
import "dotenv/config";
import emailRoutes from "./routes/emailRoutes.js";
import startScheduler from "./scheduler/scheduler.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api/emails", emailRoutes);

// Start consumer + batching scheduler
startScheduler();

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
