import express from "express";
const router = express.Router();

let clients = [];

/**
 * @openapi
 * /api/stream:
 *   get:
 *     summary: Establishes an SSE connection for real-time seat updates
 *     tags: [Stream]
 *     responses:
 *       200:
 *         description: SSE stream connected
 */
router.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clientId = Date.now();
    clients.push({ id: clientId, res });
    console.log(`Client ${clientId} connected`);

    req.on("close", () => {
        console.log(`Client ${clientId} disconnected`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

// Utility to broadcast seat updates (used in reservationController)
export function sendEvent(event, data) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach(c => c.res.write(message));
}

export default router;
