import { Sequelize, DataTypes } from 'sequelize';
import {seedAdmin, seedBuildings, seedMovies} from '../seed.js';
import dotenv from "dotenv";

dotenv.config();

/**
 * @file database-helper.js
 * @description Defines Sequelize models and relationships for the cinema reservation system.
 * Includes User, Movie, Showtime, Seat, Building, and Reservation models.
 * Also sets up the database connection and test seeding.
 */

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === "test" ? ":memory:" : `db/database.${process.env.NODE_ENV}.sqlite`,
  logging: false,
});
export { sequelize };

// user model
export const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  favoriteMovies: { type: DataTypes.STRING, allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true }
});

// movie model
export const Movie = sequelize.define('Movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: true }
});

// building model
export const Building = sequelize.define('Building', {
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false }
});

// showtime model
export const Showtime = sequelize.define('Showtime', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  building: { type: DataTypes.STRING, allowNull: false }
});

// seat model
export const Seat = sequelize.define('Seat', {
  row: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.INTEGER, allowNull: false },
  reserved: { type: DataTypes.BOOLEAN, defaultValue: false },
  class: {
    type: DataTypes.ENUM('first', 'second', 'regular'),
    allowNull: false,
    defaultValue: 'regular'
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10
  }
}, {
  indexes: [
    {
      name: 'unique_row_number_showtime',
      unique: true,
      fields: ['row', 'number', 'ShowtimeId']
    }
  ]
});


// reservation model
export const Reservation = sequelize.define('Reservation', {
  name: { type: DataTypes.STRING, allowNull: true },
  phoneNumber: { type: DataTypes.STRING, allowNull: true },
  type: { type: DataTypes.ENUM('regular', 'premium'), defaultValue: 'regular' },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  seatClass: { type: DataTypes.STRING, allowNull: true },
  totalPrice: { type: DataTypes.FLOAT, allowNull: true }
});



// Movie ↔ Showtime
Movie.hasMany(Showtime);
Showtime.belongsTo(Movie);

// Movie ↔ Building (many-to-many)
Movie.belongsToMany(Building, { through: "MovieBuildings" });
Building.belongsToMany(Movie, { through: "MovieBuildings" });

// Showtime ↔ Seat
Showtime.hasMany(Seat);
Seat.belongsTo(Showtime);

// User ↔ Reservation
User.hasMany(Reservation);
Reservation.belongsTo(User);

// Showtime ↔ Reservation
Showtime.hasMany(Reservation);
Reservation.belongsTo(Showtime);

// Reservation ↔ Movie
Movie.hasMany(Reservation);
Reservation.belongsTo(Movie);
Reservation.belongsTo(Building);
// Reservation ↔ Seat (many-to-many)
Reservation.belongsToMany(Seat, { through: 'ReservationSeats' });
Seat.belongsToMany(Reservation, { through: 'ReservationSeats' });


/**
 * Syncs the database and seeds it with initial data.
 * @function initDb
 * @returns {Promise<void>}
 */
export async function initDb() {
  await sequelize.sync({ force: true });
  await seedBuildings();
  await seedMovies();
  await seedAdmin();
}

