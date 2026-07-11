import express from "express";
import {login, register, userlist} from "../controllers/authControllers";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', userlist);

export default router;