<script>
    /**
     * @file MovieDetail.svelte
     * @description Full movie reservation page with real-time seat updates (SSE),
     * seat class price calculation, movie/showtime/building fetch, and booking logic.
     */

    import { onMount } from "svelte";
    import router from "page";
    import { titleToFileName } from "../../lib/utils/titleToFileName.js";



    export let context;
    let movieSlug = context?.params?.slug || "";
    let movie = null;
    let showtimes = [];
    let selectedShowtime = "";
    $: if (selectedShowtime) {
        fetchSeatsForShowtime(selectedShowtime);
    }
    let selectedClass = "";
    let phoneNumber = "";
    let selectedSeats = [];
    let numAdults = 1;
    let numChildren = 0;
    let childAges = [];
    let seats = [];
    let rows = ["A", "B", "C", "D"];
    let seatsPerRow = 12;
    let idCounter = 1;
    let buildings = [];

    for (let row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
            seats.push({
                id: idCounter++,
                label: `${row}${i}`,
                reserved: false
            });
        }
    }

    let seatPrices = { First: 18, Second: 13, Regular: 10 };

    $: totalPrice = (() => {
        if (!selectedClass) return 0;
        const seatPrice = seatPrices[selectedClass];
        const adultTotal = numAdults * seatPrice;
        const childrenTotal = childAges.reduce((sum, age) => {
            if (!age) return sum;
            const discount = age < 10 ? 0.6 : 1;
            return sum + seatPrice * discount;
        }, 0);
        return adultTotal + childrenTotal;
    })();

    async function fetchMovie() {
        const slug = window.location.pathname.split("/").pop();
        const res = await fetch(`http://localhost:3000/api/movies/slug/${slug}`);
        const data = await res.json();
        movie = data;
        console.log("Movie fetched:", movie);
    }

    async function fetchSeatsForShowtime(showtimeId) {
        if (!showtimeId || !movie?.id || !buildings.length) return;

        const st = showtimes.find(s => s.id === Number(showtimeId));
        const buildingObj = buildings.find(b => b.name === st.building);

        if (!buildingObj) {
            console.error("No building found for showtime:", st);
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/seats?showtimeId=${showtimeId}`);
            const data = await res.json();

            const reservedRes = await fetch(`http://localhost:3000/api/reservations/reserved-seats?movieId=${movie.id}&showtimeId=${showtimeId}&buildingId=${buildingObj.id}`);
            const reservedData = await reservedRes.json();
            const reservedSeatIds = reservedData.seatIds;

            seats = data.map(seat => ({
                id: seat.id,
                label: `${seat.row}${seat.number}`,
                reserved: reservedSeatIds.includes(seat.id),
                row: seat.row,
                number: seat.number
            }));
        } catch (err) {
            console.error("Error fetching seat or reserved seat info:", err);
        }
    }


    async function fetchBuildings() {
        const res = await fetch("http://localhost:3000/api/buildings");
        const data = await res.json();
        if (res.ok) buildings = data;
    }

    async function fetchShowtimes() {
        if (!movie?.id) return;
        const res = await fetch(`http://localhost:3000/api/showtimes?movieId=${movie.id}`);
        const data = await res.json();
        if (res.ok) showtimes = data;
    }

    function listenToSeatUpdates() {
        const source = new EventSource("http://localhost:3000/api/sse/stream");
        source.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.movieId !== movie?.id || data.showtimeId !== selectedShowtime) return;
            const seat = selectedSeats.find((s) => s.number === data.seatNumber);
            if (seat) seat.reserved = data.action === "reserved";
        };
    }

    async function handleReserve() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❗ You must be logged in to make a reservation.");
            router("/login");
            return;
        }

        const seatCount = Number(numAdults) + Number(numChildren);

        //  Check if selected seats match total number of people
        if (selectedSeats.length !== seatCount) {
            alert(`⚠️ You selected ${selectedSeats.length} seat(s), but there are ${seatCount} person(s) (adults + children). Please select exactly ${seatCount} seats.`);
            return;
        }

        const reservationId = `R-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const st = showtimes.find(s => s.id === Number(selectedShowtime));
        if (!st) {
            alert("Invalid showtime selected.");
            return;
        }

        const buildingObj = buildings.find(b => b.name === st.building);
        if (!buildingObj) {
            alert("Could not find building ID for the selected showtime.");
            return;
        }

        const buildingId = buildingObj.id;

        const res = await fetch("http://localhost:3000/api/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                movieId: movie.id,
                showtimeId: selectedShowtime,
                buildingId,
                seatClass: selectedClass,
                phoneNumber,
                seats: selectedSeats.map(s => s.id),
                totalPrice,
                seatCount,
                reservationId,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("lastReservation", JSON.stringify({
                movieTitle: movie?.title,
                showtime: `${st?.date} ${st?.time}`,
                buildingId,
                buildingName: buildingObj.name,
                seatClass: selectedClass,
                seatCount,
                phoneNumber,
                totalPrice,
                selectedSeats: selectedSeats.map(s => s.label),
                reservationId: data.reservation?.id || "N/A"
            }));
            router("/reservation-success");
        } else {
            alert("❌ Error: " + (data.message || "Reservation failed"));
            if (res.status === 401) {
                alert("⚠️ You need to log in again.");
                router("/login");
            }
        }
    }

    function toggleSeat(seat) {
        const found = seats.find(s => s.label === seat.label);
        if (!found) return;

        const index = selectedSeats.findIndex((s) => s.id === found.id);
        if (index !== -1) selectedSeats.splice(index, 1);
        else selectedSeats.push(found);

        selectedSeats = [...selectedSeats];
    }

    onMount(async () => {
        await fetchMovie();
        await fetchShowtimes();
        await fetchBuildings();
        listenToSeatUpdates();
    });

    $: console.log(movie);
</script>

<div class="max-w-7xl mx-auto mt-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-12">

    <div class="w-full">
        {#if movie}
            <img src={titleToFileName[movie.title]} alt={movie.title} class="rounded-xl shadow-xl w-full h-auto object-cover border border-gray-700" />
        {/if}
    </div>

    <div class="space-y-6">
        <div>
            <h1 class="text-4xl font-extrabold text-yellow-400 drop-shadow">{movie?.title}</h1>
            <p class="text-sm text-gray-400 italic mt-1">{movie?.genre}</p>
            <p class="text-base text-gray-200 mt-2">{movie?.description}</p>
            <p class="text-sm text-gray-300 font-medium mt-1">🎬 Duration: {movie?.duration} mins</p>
        </div>

        <div>
            <label class="block font-semibold text-gray-300 mb-1">Choose Showtime:</label>
            <select bind:value={selectedShowtime} class="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">-- Select showtime --</option>
                {#each showtimes as st (st.id)}
                    <option value={st.id}>{st.date} – {st.time} at {st.building}</option>
                {/each}
            </select>
        </div>

        <div>
            <label class="block font-semibold text-gray-300 mb-1">Seat Class & Price:</label>
            <select bind:value={selectedClass} class="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option value="">-- Choose seat class --</option>
                <option value="First">First (€18)</option>
                <option value="Second">Second (€13)</option>
                <option value="Regular">Regular (€10)</option>
            </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block font-medium text-gray-300 mb-1">Adults:</label>
                <input type="number" min="1" bind:value={numAdults} class="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
                <label class="block font-medium text-gray-300 mb-1">Children:</label>
                <input type="number" min="0" bind:value={numChildren} class="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
        </div>

        {#if numChildren > 0}
            <div>
                <label class="block font-medium text-gray-300 mb-1">Child Ages:</label>
                {#each Array.from({ length: numChildren }).keys() as i (i)}
                    <input
                            type="number"
                            placeholder="Age"
                            min="1"
                            class="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded mb-1"
                            bind:value={childAges[i]}
                            on:input={(e) => childAges[i] = /** @type {HTMLInputElement} */ (e.target).valueAsNumber}
                    />
                {/each}
                <p class="text-sm text-green-400 mt-1">💡 Children under 12 get <span class="font-semibold">40% discount</span>!</p>
            </div>
        {/if}

        <div>
            <label class="block font-medium text-gray-300 mb-1">Phone Number (Optional):</label>
            <input type="tel" placeholder="e.g. +31612345678" bind:value={phoneNumber} class="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-400" />
        </div>


        <div class="text-right text-2xl font-bold text-green-400 border-t border-gray-600 pt-4">
            Total Price: €{totalPrice.toFixed(2)}
        </div>

        <button on:click={handleReserve} class="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-xl transition-all">
            Confirm Reservation
        </button>
    </div>
</div>


<div class="mt-12 p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl text-white">
    <h2 class="text-xl font-bold text-yellow-400 mb-6"> Select Your Seats:</h2>

    <div class="text-center mb-6">
        <div class="bg-gray-600 text-white font-semibold py-2 px-10 rounded-full inline-block shadow-md">
            Screen
        </div>
    </div>

    <div class="flex justify-center">
        <div class="flex flex-col gap-4 items-center">
            {#each [...new Set(seats.map(s => s.label.charAt(0)))] as row (row)}
                <div class="flex gap-3">
                    {#each seats.filter(s => s.label.startsWith(row)) as seat (seat.id)}
                        <button
                                class="w-12 h-12 rounded-xl text-sm flex items-center justify-center font-semibold border
                {selectedSeats.some(s => s.id === seat.id)
                  ? 'bg-red-600 text-white border-red-700'
                  : seat.reserved
                  ? 'bg-gray-400 text-white border-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-100 hover:bg-yellow-600 border-gray-500'}"
                                on:click={() => toggleSeat(seat)}
                                disabled={seat.reserved}
                        >
                            {seat.label}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    </div>


    <div class="mt-8 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-gray-300">
        <div class="text-center">
            <p class={selectedSeats.length === (Number(numAdults) + Number(numChildren)) ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                Selected {selectedSeats.length} / Required: {Number(numAdults) + Number(numChildren)}
            </p>
            {#if selectedSeats.length > (Number(numAdults) + Number(numChildren))}
                <p class="text-sm text-red-400 mt-1">⚠️ Too many seats selected.</p>
            {:else if selectedSeats.length < (Number(numAdults) + Number(numChildren))}
                <p class="text-sm text-yellow-300 mt-1"> Select more seats to match your group.</p>
            {/if}
        </div>

        <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-gray-800 border border-gray-500 rounded"></div>
            <span>Available</span>
        </div>
        <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-red-600 border border-red-700 rounded"></div>
            <span>Selected</span>
        </div>
        <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-gray-400 border border-gray-500 rounded"></div>
            <span>Reserved</span>
        </div>
    </div>
</div>
