import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { initTestDb } from "../db/initTestDb.js";


beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await initTestDb();
});

beforeEach(async () => {
    await initTestDb();
});

describe("Auth API", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "123456",
                role: "user"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it("should not register user with existing email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Duplicate",
                email: "test@example.com",
                password: "123456",
                role: "user"
            });
        expect(res.statusCode).toBe(409);
    });

    it("should login with valid credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "123456" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    it("should fail login with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "wrongpass" });
        expect(res.statusCode).toBe(401);
    });
});
