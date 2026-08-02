import express from "express";
import { authenticate } from "../middleware/authenticate";
import { getCurrentUser } from "../controllers/authControllers";

const router = express.Router();

router.get('/me', authenticate, getCurrentUser);

export default router;