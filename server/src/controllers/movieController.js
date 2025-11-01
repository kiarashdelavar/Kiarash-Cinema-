import {Building, Movie, Seat, Showtime} from "../db/database-helper.js";
import slugify from "slugify";

/**
 * Get all movies.
 * @route GET /api/movies
 * @returns {Array} 200 - List of movies
 */
export async function getAllMovies(req, res) {
  try {
    const { sort, limit } = req.query;

    const order = [];
    if (sort) {
      const direction = sort.startsWith("-") ? "DESC" : "ASC";
      const field = sort.replace("-", "");
      order.push([field, direction]);
    }

    const movies = await Movie.findAll({
      order,
      limit: limit ? parseInt(limit) : undefined,
    });

    res.json(movies);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies" });
  }
}

/**
 * Get one movie by slug.
 * @route GET /api/movies/slug/:slug
 * @returns {Object} 200 - Movie found
 * @returns {Error} 404 - Not found
 */
export async function getMovieBySlug(req, res) {
  const { slug } = req.params;

  const movie = await Movie.findOne({
    where: { slug },
    include: [Showtime, Building],
  });

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.json(movie);
}

/**
 * Create a new movie (auto-generated showtimes + seats)
 * @route POST /api/movies
 * @returns {Object} 201 - Movie created
 * @returns {Error} 400/500 - Error creating
 */
export async function createMovie(req, res) {
  const { title, description, duration, genre, image } = req.body;

  if (!title || !duration) {
    return res.status(400).json({ message: "Title and duration are required" });
  }

  try {
    const slug = slugify(title, { lower: true, strict: true });
    const movie = await Movie.create({ title, slug, description, duration, genre, image });

    // Auto-create showtimes for this movie
    const building = await Building.findOne();
    if (!building) return res.status(400).json({ message: "No building available." });

    const times = ["14:30", "17:00"];
    const date = new Date();
    date.setDate(date.getDate() + 2);
    const dateStr = date.toISOString().split("T")[0];

    for (const time of times) {
      const showtime = await Showtime.create({
        MovieId: movie.id,
        date: dateStr,
        time,
        building: building.name,
      });

      const seats = [];
      for (let row = 0; row < 5; row++) {
        for (let number = 1; number <= 10; number++) {
          const rowLabel = String.fromCharCode(65 + row);
          let seatClass = "regular", price = 9;
          if (row === 0) { seatClass = "first"; price = 15; }
          else if (row === 1) { seatClass = "second"; price = 12; }

          seats.push({
            row: rowLabel,
            number,
            class: seatClass,
            price,
            reserved: false,
            ShowtimeId: showtime.id,
          });
        }
      }
      await Seat.bulkCreate(seats);
    }

    res.status(201).json(movie);
  } catch (err) {
    console.error("❌ Error creating movie:", err);
    res.status(500).json({ message: "Error creating movie", error: err.message });
  }
}

/**
 * Delete movie by ID.
 * @route DELETE /api/movies/:id
 * @returns {Message} 200 - Deleted
 * @returns {Error} 404/500
 */
export async function deleteMovie(req, res) {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.destroy();
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    res
        .status(500)
        .json({ message: "Error deleting movie", error: err.message });
  }
}

/**
 * Update movie info.
 * @route PUT /api/movies/:id
 * @returns {Object} 200 - Updated movie
 * @returns {Error} 404/500
 */
export async function updateMovie(req, res) {
  const movieId = req.params.id;
  const { title, description, duration, genre, image } = req.body;

  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie)
      return res.status(404).json({ message: "Movie not found" });

    await movie.update({ title, description, duration, genre, image });
    res.status(200).json(movie);
  } catch (err) {
    res
        .status(500)
        .json({ message: "Error updating movie", error: err.message });
  }
}

/**
 * Get movie by ID.
 * @route GET /api/movies/:id
 * @returns {Object} 200 - Movie
 * @returns {Error} 404/500
 */
export async function getMovieById(req, res) {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie)
      return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Error fetching movie" });
  }
}
