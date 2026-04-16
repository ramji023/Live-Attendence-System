import express from "express";
import { createServer } from "http";
import { initWebSocketServer } from "./socket";
import authRoutes from "./routes/auth/auth";

const app = express(); // initialize express server

app.use(express.json());
// test route
app.get("/", (req, res) => {
  res.send("server is working");
});
// route to handle basic login controller
app.use("/api/auth", authRoutes);

const httpServer = createServer(app);
initWebSocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server running on port 3000");
});
