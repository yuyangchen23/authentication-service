import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Great to see you again!");
});

app.get('/health', (req, res) => {
  return res.json({
    "status": "ok",
  });
})
;

app.post('/auth/register', (req, res) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  console.log("User email: " + email);

  return res.status(201).json({
    message: "User registered"
  });
});

app.post('/auth/login', (req, res) => {
  return res.status(200).json({
    message: "Login successful"
  });
});

app.listen(port, () => {
  console.log("Server is running...")
});