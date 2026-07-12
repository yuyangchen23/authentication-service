import express from "express";
import authRouter from "./routes/auth";

const app = express();

// global middleware
app.use(express.json());

// Mount authentication routes
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  return res.send("Great to see you again!");
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});

// Add 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} was not found`
  });
});

export default app;