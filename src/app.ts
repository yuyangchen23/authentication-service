import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// global middleware (JSON middleware)
app.use(express.json());

// Mount authentication routes
app.use('/auth', authRouter);
app.use('/users', userRouter);

// Application routes
app.get('/', (req, res) => {
  return res.send("Great to see you again!");
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});

// Add 404 handler (404 handler)
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} was not found`
  });
});

// Error handler
app.use(errorHandler);

export default app;