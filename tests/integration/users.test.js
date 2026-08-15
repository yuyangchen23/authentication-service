"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../src/app"));
const prisma_1 = require("../../src/lib/prisma");
(0, vitest_1.describe)("Authentication integration", () => {
    (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.prisma.user.deleteMany();
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.prisma.$disconnect();
    }));
    (0, vitest_1.it)("registers a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
            email: "test@example.com",
            password: "StrongPassword123",
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data).toEqual(vitest_1.expect.objectContaining({
            email: "test@example.com",
        }));
    }));
    (0, vitest_1.it)("login a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `test-${Date.now()}@example.com`;
        const password = "StrongPassword123";
        yield (0, supertest_1.default)(app_1.default)
            .post("/auth/register")
            .send({ email, password })
            .expect(201);
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/login")
            .send({ email, password })
            .expect(200);
        (0, vitest_1.expect)(loginRes.body.data.accessToken).toEqual(vitest_1.expect.any(String));
    }));
});
