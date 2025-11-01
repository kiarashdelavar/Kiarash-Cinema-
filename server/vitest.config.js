import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
export default defineConfig({
    test: {
        environment: 'node',
        env: loadEnv('test', process.cwd(), ''),
    },
})