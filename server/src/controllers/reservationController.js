import { sendEvent } from "../routes/sseRoutes.js";
import {Reservation, Movie, Showtime, Building, Seat, User} from "../db/database-helper.js";
/**
 * @file reservationController.js
 * @description Handles CRUD operations for movie seat reservations.
 * Integrates Server-Sent Events (SSE) to broadcast seat updates to all connected clients.
 * Each change (create, update, delete) emits a 'seatUpdate' event with relevant metadata.
 */

/**
 * Create a new reservation.
 * @route POST /api/reservations
 * @returns {Object} 201 - Reservation created
 * @returns {Error} 400/409/500
 */
export async function createReservation(req, res) {
  const {
    movieId,
    showtimeId,
    phoneNumber,
    buildingId,
    seatClass,
    seats,
    totalPrice,
    seatCount
  } = req.body;

  const userId = req.user.id;

  if (!movieId || !showtimeId || !seats?.length || !seatClass || !buildingId || !seatCount) {
    return res.status(400).json({ message: "Missing required reservation data." });
  }

  if (seats.length !== seatCount) {
    return res.status(400).json({
      message: `Number of selected seats (${seats.length}) must match the number of people (${seatCount}).`,
    });
  }

  try {
    const existing = await Reservation.findOne({
      include: [{ model: Seat, where: { id: seats[0] } }],
      where: { showtimeId }
    });

    if (existing) {
      return res.status(409).json({ message: "Seat already reserved." });
    }

    const reservation = await Reservation.create({
      MovieId: movieId,
      UserId: userId,
      ShowtimeId: showtimeId,
      BuildingId: buildingId,
      phoneNumber,
      seatClass,
      totalPrice,
    });

    await reservation.setSeats(seats.map(id => Number(id)));

    sendEvent("seatUpdate", {
      action: "reserved",
      movieId,
      showtimeId,
      seatIds: seats,
      userId,
      seatClass,
      timestamp: new Date().toISOString()
    });

    const fullReservation = await Reservation.findByPk(reservation.id, {
      include: [Movie, Showtime, Building, Seat]
    });

    res.status(201).json({
      id: fullReservation.id,
      movieTitle: fullReservation.Movie?.title,
      showtime: `${fullReservation.Showtime?.date} ${fullReservation.Showtime?.time}`,
      building: fullReservation.Building?.name,
      seatClass: fullReservation.seatClass,
      phoneNumber: fullReservation.phoneNumber,
      totalPrice: fullReservation.totalPrice,
      seatCount: fullReservation.Seats?.length,
      seats: fullReservation.Seats?.map(s => `${s.row}${s.number}`)
    });
  } catch (err) {
    console.error("❌ Reservation error:", err);
    res.status(500).json({ message: "Reservation failed", error: err.message });
  }
}

/**
 * Get reservations for the logged-in user.
 * @route GET /api/reservations/my
 * @returns {Array} 200 - User's reservations
 * @returns {Error} 500
 */
export async function getMyReservations(req, res) {
  try {
    const reservations = await Reservation.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Movie,
          attributes: ["id", "title"],
        },
        {
          model: Showtime,
          attributes: ["date", "time"],
        },
        {
          model: Building,
          attributes: ["name", "location"],
        },
        {
          model: Seat,
          attributes: ["row", "number"],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const response = reservations.map((r) => ({
      id: r.id,
      movieTitle: r.Movie && r.Movie.title ? r.Movie.title : "Unknown movie",
      showtime: r.Showtime ? `${r.Showtime.date} ${r.Showtime.time}` : "N/A",
      building: r.Building?.name || "Unknown building",
      seats: r.Seats?.map(s => `${s.row}${s.number}`) || [],
      seatClass: r.seatClass,
      phoneNumber: r.phoneNumber,
      totalPrice: r.totalPrice,
      createdAt: r.createdAt,
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ getMyReservations error:", err);
    res.status(500).json({ message: "Failed to fetch reservations", error: err.message });
  }
}

/**
 * Admin: Get all reservations.
 * @route GET /api/reservations
 * @returns {Array} 200 - All reservations
 * @returns {Error} 500
 */
export async function getReservations(req, res) {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Movie,
          attributes: ["id", "title"],
        },
        {
          model: User,
          attributes: ["id", "email"],
        },
        {
          model: Showtime,
          attributes: ["date", "time"],
        },
        {
          model: Building,
          attributes: ["name", "location"],
        },
        {
          model: Seat,
          attributes: ["row", "number", "price"],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const response = reservations.map((r) => ({
      id: r.id,
      movieTitle: r.Movie?.title || "Unknown movie",
      userEmail: r.User?.email || "Unknown user",
      showtime: r.Showtime ? `${r.Showtime.date} ${r.Showtime.time}` : "N/A",
      building: r.Building?.name || "Unknown building",
      seats: r.Seats?.map((s) => `${s.row}${s.number}`) || [],
      seatClass: r.seatClass,
      totalPrice: r.totalPrice,
      phoneNumber: r.phoneNumber,
      createdAt: r.createdAt,
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ getReservations error:", err);
    res.status(500).json({ message: "Failed to fetch all reservations", error: err.message });
  }
}

/**
 * Delete a reservation.
 * @route DELETE /api/reservations/:id
 * @returns {Object} 200 - Deleted
 * @returns {Error} 400/403/404/500
 */
export async function deleteReservation(req, res) {
  const id = req.params.id;

  try {
    const reservation = await Reservation.findByPk(id, {
      include: [Showtime]
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const date = reservation.Showtime?.date;
    const time = reservation.Showtime?.time;

    if (!date || !time) {
      return res.status(400).json({ message: "Invalid showtime information" });
    }

    const showtimeDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    const hoursDiff = (showtimeDateTime - now) / (1000 * 60 * 60); // Convert ms to hours

    if (hoursDiff < 24) {
      return res.status(403).json({
        message: "Reservations can only be cancelled at least 24 hours before the showtime.",
      });
    }

    // Continue if valid
    const { movieId, userId } = reservation;

    await reservation.destroy();

    sendEvent("seatUpdate", {
      action: "cancelled",
      movieId,
      userId,
      timestamp: new Date().toISOString(),
    });

    res.json({ message: "Reservation cancelled" });

  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
}


/**
 * Update reservation details.
 * @route PUT /api/reservations/:id
 * @returns {Object} 200 - Updated reservation
 * @returns {Error} 404/500
 */
export async function updateReservation(req, res) {
  const reservationId = req.params.id;
  const {
    showtimeId,
    seatIds,
    phoneNumber,
    building,
    seatClass,
    totalPrice
  } = req.body;

  try {
    const reservation = await Reservation.findByPk(reservationId, {
      include: [Seat],
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Update fields if provided
    if (showtimeId) reservation.ShowtimeId = showtimeId;
    if (phoneNumber !== undefined) reservation.phoneNumber = phoneNumber;
    if (building !== undefined) reservation.building = building;
    if (seatClass !== undefined) reservation.seatClass = seatClass;
    if (totalPrice !== undefined) reservation.totalPrice = totalPrice;

    await reservation.save();

    // Update seats if new seatIds are provided
    if (seatIds && Array.isArray(seatIds)) {
      const seats = await Seat.findAll({ where: { id: seatIds } });
      await reservation.setSeats(seats);
    }

    // Emit Server-Sent Event update
    sendEvent("seatUpdate", {
      action: "updated",
      reservationId,
      showtimeId,
      seatIds,
      phoneNumber,
      building,
      seatClass,
      totalPrice,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      message: "Reservation updated successfully.",
      reservation,
    });

  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({
      message: "Error updating reservation",
      error: err.message,
    });
  }
}

/**
 * Get reserved seats for a movie, showtime, and building.
 * @route GET /api/reservations/reserved-seats
 * @returns {Object} 200 - List of reserved seat IDs
 * @returns {Error} 400/500
 */
export async function getReservedSeats(req, res) {
  const { movieId, showtimeId, buildingId } = req.query;

  if (!movieId || !showtimeId || !buildingId) {
    return res.status(400).json({ message: "Missing query parameters." });
  }

  try {
    const reservations = await Reservation.findAll({
      where: {
        MovieId: Number(movieId),
        ShowtimeId: Number(showtimeId),
        BuildingId: Number(buildingId)
      },
      include: [{
        model: Seat,
        through: { attributes: [] }
      }]
    });

    console.log(" Fetched reservations:", reservations.map(r => ({
      id: r.id,
      seats: r.Seats.map(s => `${s.row}${s.number}`)
    })));

    const reservedSeatIds = reservations.flatMap(r => r.Seats.map(s => s.id));
    res.json({ seatIds: reservedSeatIds });
  } catch (err) {
    console.error(" Error fetching reserved seats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
