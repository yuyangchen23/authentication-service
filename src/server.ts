import express from "express";
import authRouter from "./routes/auth";

const app = express();
const port = 3000;

// Global middleware
app.use(express.json());

//Mount Root Router
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  return res.send("Great to see you again!");
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: "ok"
  });
});


app.listen(port, () => {
  console.log("Server is running...")
});