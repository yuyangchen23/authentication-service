import express from "express";
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send("Great to see you again!");
});

app.get('/health', (req, res) => {
  return res.json({
    "status": "ok",
  });
})
;

app.listen(port, () => {
  console.log("Server is running...")
});