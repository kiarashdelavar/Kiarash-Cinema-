import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../index.js";
import { initTestDb } from "../db/initTestDb.js";
import { User } from "../db/database-helper.js";
import jwt from "jsonwebtoken";

let adminToken;
let userId;

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await initTestDb();

    const user = await User.create({
        name: "Test User",
        email: "user@example.com",
        password: "$2b$10$testtesttesttesttesttesttesttesttesttesttestte", // hashed
        role: "user",
    });
    userId = user.id;

    const admin = await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: "$2b$10$testtesttesttesttesttesttesttesttesttesttestte",
        role: "admin",
    });

    adminToken = jwt.sign(
        { id: admin.id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
});

describe(" Admin User API", () => {
    it("should fetch all users (admin only)", async () => {
        const res = await request(app)
            .get("/api/auth/users")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should update a user by ID (admin only)", async () => {
        const res = await request(app)
            .put(`/api/auth/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Updated Name" });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Updated Name");
    });

    it("should delete a user by ID (admin only)", async () => {
        const res = await request(app)
            .delete(`/api/auth/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if non-admin tries to access", async () => {
        const user = await User.create({
            name: "Normal Guy",
            email: "normal@example.com",
            password: "$2b$10$testtesttesttesttesttesttesttesttesttesttestte",
            role: "user",
        });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const res = await request(app)
            .get("/api/auth/users")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
    });
});
