import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initWebSocketServer } from "./socket";
import authRoutes from "./routes/auth/auth";
import attendenceRoutes from "./routes/attendence/attendence";
import { connectDB } from "./connection/db";

const app = express(); // initialize express server

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frotnend url
    credentials: true,
  }),
);

// test route
app.get("/", (req, res) => {
  res.send("server is working");
});
// route to handle basic login controllers
app.use("/api/v1/auth", authRoutes);

// route to handle basic attendence controllers
app.use("/api/v1/attendence", attendenceRoutes);

const httpServer = createServer(app);
initWebSocketServer(httpServer);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    httpServer.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
