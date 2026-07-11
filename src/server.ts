import express from "express";
import authRouter from "./routes/auth";
import "dotenv/config";

const app = express();
const port = Number(process.env.PORT) || 3000;

// Global middleware
app.use(express.json());

//Mount authentication routes
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  return res.send("Great to see you again!");
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});

// Add 404 Handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} was not found`
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
});