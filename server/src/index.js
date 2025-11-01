import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger-config.js';
import authRouter from './routes/authRoutes.js';
import { initDb } from './db/database-helper.js';
import movieRoutes from './routes/movieRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import buildingRoutes from "./routes/buildingRoutes.js";
import showtimeRoutes from './routes/showtimeRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import sseRoutes from "./routes/sseRoutes.js";


// Load env variables like JWT_SECRET from .env.dev or .env.prod
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

const nodeEnv = process.env.NODE_ENV || 'dev';
const app = express();
const port = 3000;

// JSON and CORS setup
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173']
}));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/buildings", buildingRoutes);
app.use('/api/auth', authRouter);
app.use('/api/movies', movieRoutes);
app.use('/api/reservations', reservationRoutes);
app.use("/api/sse", sseRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/showtimes', showtimeRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!'
    });
});

// Initialize DB and start server
initDb().then(() => {
    app.listen(port, () => {
        console.log(`App listening on port ${port}, running in ${nodeEnv} mode.`);
    });
});

export default app;
