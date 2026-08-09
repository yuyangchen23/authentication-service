import express from "express";
import {deleteUsers, login, register, userlist} from "../controllers/authControllers";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/users', userlist);

// development-only
router.delete('/users', deleteUsers);

export default router;