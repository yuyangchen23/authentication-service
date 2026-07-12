import app from "./app";
import "dotenv/config";

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
});