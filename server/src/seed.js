import { Movie, Showtime, Seat, User, Building } from './db/database-helper.js';
import bcrypt from 'bcrypt';

/**  Seed cinema buildings */
export async function seedBuildings() {
    const existing = await Building.count();
    if (existing > 0) return console.log("🏢 Buildings already seeded.");

    await Building.bulkCreate([
        { name: 'Cinema One', location: 'Main Street 1', capacity: 150 },
        { name: 'Galaxy Theatre', location: 'Downtown Center', capacity: 120 },
        { name: 'Grand Hall', location: 'Boulevard 88', capacity: 200 }
    ]);

    console.log("✅ Buildings seeded.");
}

/**  Seed movies, showtimes, and seats */
export async function seedMovies() {
    if (await Movie.count() > 0) return console.log("🎬 Movies already seeded.");

    const slugify = title => title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const movies = await Movie.bulkCreate([
        { title: "Oppenheimer", genre: "Drama / History", slug: slugify("Oppenheimer"), duration: 180, description: "The story of J. Robert Oppenheimer and the atomic bomb." },
        { title: "Interstellar", genre: "Sci‑Fi / Adventure", slug: slugify("Interstellar"), duration: 169, description: "Explorers travel through a wormhole in space to save humanity." },
        { title: "The Dark Knight", genre: "Action / Crime", slug: slugify("The Dark Knight"), duration: 152, description: "Batman faces the Joker's chaos in Gotham." },
        { title: "The Godfather", genre: "Crime / Drama", slug: slugify("The Godfather"), duration: 175, description: "A crime dynasty is handed to a reluctant son." },
        { title: "Green Book", genre: "Drama / Biography", slug: slugify("Green Book"), duration: 130, description: "A driver and pianist journey through 1960s America." },
        { title: "12 years a slave", genre: "Biography / History", slug: slugify("12 years a slave"), duration: 134, description: "A free man is sold into slavery pre‑Civil War." },
        { title: "Lincoln", genre: "Biography / History", slug: slugify("Lincoln"), duration: 150, description: "Lincoln fights to pass the 13th Amendment." },
        { title: "Django Unchained", genre: "Western / Action", slug: slugify("Django Unchained"), duration: 165, description: "A freed slave and bounty hunter rescue his wife." },
        { title: "Inglourious Basterds", genre: "War / Adventure", slug: slugify("Inglourious Basterds"), duration: 153, description: "Jewish soldiers plot to kill Nazis in France." },
        { title: "Munich", genre: "Thriller / Drama", slug: slugify("Munich"), duration: 164, description: "Mossad agents avenge the 1972 Olympics massacre." },
        { title: "Charlie and the Chocolate Factory", genre: "Family / Fantasy", slug: slugify("Charlie and the Chocolate Factory"), duration: 115, description: "Charlie visits a magical chocolate factory." },
        { title: "Edward Scissorhands", genre: "Fantasy / Romance", slug: slugify("Edward Scissorhands"), duration: 105, description: "A man with scissor hands tries to fit in." }
    ]);

    const buildings = await Building.findAll();
    const timeSlots = ["12:00", "14:30", "17:00", "19:15", "21:45"];
    const generateDates = (start, end, step = 3) => {
        const dates = [];
        const curr = new Date(start);
        const endDate = new Date(end);
        while (curr <= endDate) {
            dates.push(curr.toISOString().split("T")[0]);
            curr.setDate(curr.getDate() + step);
        }
        return dates;
    };
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);

    const dates = generateDates("2025-10-21", "2025-12-15");

    for (const movie of movies) {
        for (const building of buildings) {
            const showtimes = [];

            for (const date of dates) {
                const shuffledTimes = shuffle([...timeSlots]);

                for (let i = 0; i < 2; i++) {
                    const time = shuffledTimes[i];
                    const fullDateTime = new Date(`${date}T${time}`);
                    const minTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    if (fullDateTime <= minTime) continue;

                    const showtime = await Showtime.create({
                        MovieId: movie.id,
                        date,
                        time,
                        building: building.name
                    });

                    showtimes.push(showtime);
                }
            }

            await movie.addBuilding(building);

            for (const showtime of showtimes) {
                const seats = [];
                for (let row = 0; row < 5; row++) {
                    for (let num = 1; num <= 10; num++) {
                        const rowLabel = String.fromCharCode(65 + row);
                        let seatClass = "regular", price = 9;
                        if (row === 0) { seatClass = "first"; price = 15; }
                        else if (row === 1) { seatClass = "second"; price = 12; }

                        seats.push({
                            row: rowLabel,
                            number: num,
                            class: seatClass,
                            price,
                            reserved: false,
                            ShowtimeId: showtime.id
                        });
                    }
                }
                await Seat.bulkCreate(seats);
            }
        }
    }

    console.log("✅ All movies, showtimes, and seats seeded.");
}

/**  Seed admin and regular test user */
export async function seedAdmin() {
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    const existingUser = await User.findOne({ where: { email: 'user@example.com' } });

    if (!existingAdmin) {
        const hash = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: hash,
            role: 'admin',
            phoneNumber: '+31612345678'
        });
        console.log("✅ Admin user created.");
    }

    if (!existingUser) {
        const hash = await bcrypt.hash('user123', 10);
        await User.create({
            name: 'Test User',
            email: 'user@example.com',
            password: hash,
            role: 'user',
            phoneNumber: '+31687654321'
        });
        console.log("👤 Regular user created.");
    }
}

