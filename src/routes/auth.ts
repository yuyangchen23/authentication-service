import express from "express";
import {deleteUsers, login, register, userlist, refresh, logout, logoutAll} from "../controllers/authControllers";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/logout-all', logoutAll);

router.get('/users', userlist);

// development-only
router.delete('/users', deleteUsers);

export default router;