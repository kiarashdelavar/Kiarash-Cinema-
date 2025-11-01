import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../index.js";
import { initDb } from "../db/database-helper.js";
import { User } from "../db/database-helper.js";
import jwt from "jsonwebtoken";

let token;

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await initDb();

    const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "$2b$10$h4s0UEW70tpVKzKzVcLOcu3GLXcpFykU9mHqHeY0LHX6ChhEkZKei", // hashed "test1234"
        role: "user"
    });

    token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "2h",
    });
});

describe("Reservation API", () => {
    it("should return 400 when required fields are missing", async () => {
        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
    });

    it("should return 409 if seat already reserved", async () => {
        // First create a valid reservation
        const firstRes = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${token}`)
            .send({
                movieId: 1,
                showtimeId: 1,
                phoneNumber: "0612345678",
                buildingId: 1,
                seatClass: "regular",
                seats: [1],
                totalPrice: 10,
            });

        expect(firstRes.statusCode).toBe(201);

        // Try reserving the same seat again
        const secondRes = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${token}`)
            .send({
                movieId: 1,
                showtimeId: 1,
                phoneNumber: "0612345678",
                buildingId: 1,
                seatClass: "regular",
                seats: [1],
                totalPrice: 10,
            });

        expect(secondRes.statusCode).toBe(409);
        expect(secondRes.body.message).toBe("Seat already reserved.");
    });

    it("should fetch user's own reservations", async () => {
        const res = await request(app)
            .get("/api/reservations/my")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should cancel a reservation", async () => {
        const createRes = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${token}`)
            .send({
                movieId: 1,
                showtimeId: 1,
                buildingId: 1,
                seatClass: "regular",
                phoneNumber: "0612345678",
                seats: [2],
                totalPrice: 10
            });

        const reservationId = createRes.body.id;
        const deleteRes = await request(app)
            .delete(`/api/reservations/${reservationId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.statusCode).toBe(200);
    });


});
