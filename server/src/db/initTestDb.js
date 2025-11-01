import fs from "fs";
import path from "path";
import { sequelize } from "../db/database-helper.js";

/**
 * Clean and initialize fresh test DB
 */
export async function initTestDb() {
    const dbPath = path.resolve("./db/test.sqlite");

    // Delete old test DB
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
    await sequelize.sync({ force: true });
}
