import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { beforeAll } from 'vitest';
import {initTestDb} from "../db/initTestDb.js";


beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await initTestDb();
});

describe("GET /api/movies", () => {
    it("should return 200 and an array of movies", async () => {
        const res = await request(app).get("/api/movies");
        console.log("Response body:", res.body);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("title");
            expect(res.body[0]).toHaveProperty("description");
            expect(res.body[0]).toHaveProperty("genre");
        }
    });

    it("should get movie by ID", async () => {
        const res = await request(app).get("/api/movies/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title");
    });

    it("should return 404 for non-existing movie", async () => {
        const res = await request(app).get("/api/movies/99999");
        expect(res.statusCode).toBe(404);
    });
});

