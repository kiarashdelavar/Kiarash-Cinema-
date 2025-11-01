<script>
    import { onMount } from "svelte";

    let section = "reservations";
    let reservationSearch = "";
    let userSearch = "";
    let users = [];
    let userLoading = false;
    let userError = "";

    let filteredUsers = [];

    async function fetchUsers() {
        userLoading = true;
        userError = "";
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:3000/api/auth/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const data = await res.json();
                userError = data.message || "Failed to fetch users.";
                return;
            }

            users = await res.json();
            filteredUsers = users;
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            userError = "Server error.";
        } finally {
            userLoading = false;
        }
    }

    // Filter users reactively
    $: filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    async function updateUserRole(id, newRole) {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3000/api/auth/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();
            if (res.ok) fetchUsers();
            else alert(data.message || "Failed to update user.");
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert("Update failed.");
        }
    }

    async function deleteUserById(id) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:3000/api/auth/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) fetchUsers();
            else alert(data.message || "Failed to delete user.");
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            alert("Delete failed.");
        }
    }

    let reservations = [];
    let resError = "";
    let resLoading = true;
    let filteredReservations = [];

    async function fetchReservations() {
        const token = localStorage.getItem("token");
        resLoading = true;
        try {
            const res = await fetch("http://localhost:3000/api/reservations", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!res.ok) resError = data.message || "Failed to load reservations.";
            else reservations = data;
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            resError = "Server error.";
        } finally {
            resLoading = false;
        }
    }

    $: filteredReservations = reservations.filter(r =>
        r.movieTitle.toLowerCase().includes(reservationSearch.toLowerCase())
    );

    // Group by movie title for better readability
    $: groupedReservations = filteredReservations.reduce((groups, r) => {
        const title = r.movieTitle || "Unknown movie";
        if (!groups[title]) groups[title] = [];
        groups[title].push(r);
        return groups;
    }, {});

    let movies = [];
    let movieError = "";
    let movieLoading = false;

    let newMovie = {
        title: "",
        genre: "",
        duration: "",
        description: "",
        poster: ""
    };

    let editingMovieId = null;
    let editForm = {
        title: "",
        genre: "",
        duration: "",
        posterUrl: "",
        description: ""
    };

    function exportReservationsCSV() {
        const csvRows = [
            ["Movie", "User", "Showtime", "Seats", "Total"]
        ];
        reservations.forEach(r => {
            csvRows.push([
                r.movieTitle,
                r.userEmail,
                r.showtime,
                r.seats.join(" "),
                r.totalPrice
            ]);
        });
        const csvContent = csvRows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reservations.csv";
        a.click();
    }

    async function fetchMovies() {
        movieLoading = true;
        movieError = "";
        try {
            const res = await fetch("http://localhost:3000/api/movies");
            if (!res.ok) throw new Error("Failed to fetch movies");
            movies = await res.json();
        } catch (err) {
            movieError = err.message;
        } finally {
            movieLoading = false;
        }
    }

    function startEdit(movie) {
        editingMovieId = movie.id;
        editForm = {
            title: movie.title,
            genre: movie.genre,
            duration: movie.duration,
            posterUrl: movie.posterUrl,
            description: movie.description
        };
    }

    async function saveEdit(id) {
        try {
            const res = await fetch(`http://localhost:3000/api/movies/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(editForm)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update movie.");

            alert("Movie updated!");
            editingMovieId = null;
            fetchMovies();
        } catch (error) {
            console.error(error);
            alert("Failed to update movie.");
        }
    }

    async function createMovie() {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:3000/api/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newMovie)
            });
            if (!res.ok) throw new Error("Failed to create movie");
            alert("Movie created!");
            newMovie = { title: "", genre: "", duration: "", description: "", poster: "" };
            fetchMovies();
        } catch (err) {
            alert(err.message);
        }
    }

    async function deleteMovie(id) {
        const token = localStorage.getItem("token");
        if (!confirm("Delete this movie?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/movies/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete");
            fetchMovies();
        } catch (err) {
            alert(err.message);
        }
    }

    onMount(() => {
        fetchReservations();
    });

    $: if (section === "reservations") fetchReservations();
    $: if (section === "users") fetchUsers();
    $: if (section === "movies") fetchMovies();
</script>

<section class="p-6 bg-gray-900 min-h-screen text-white">
    <h1 class="text-4xl font-bold mb-8 text-center tracking-wide">🎬 Admin Panel</h1>

    <nav class="flex justify-center space-x-6 border-b border-gray-700 pb-4 mb-8 text-lg font-semibold">
        <button on:click={() => section = 'reservations'} class={section === 'reservations' ? 'text-yellow-400 underline' : 'text-white hover:text-yellow-400'}>
            🧾 Reservations
        </button>
        <button on:click={() => section = 'users'} class={section === 'users' ? 'text-yellow-400 underline' : 'text-white hover:text-yellow-400'}>
            👥 Users
        </button>
        <button on:click={() => section = 'movies'} class={section === 'movies' ? 'text-yellow-400 underline' : 'text-white hover:text-yellow-400'}>
            🎬 Movies
        </button>
    </nav>

    {#if section === "reservations"}
        {#if resLoading}
            <p>Loading reservations...</p>
        {:else if resError}
            <p class="text-red-600">{resError}</p>
        {:else if reservations.length === 0}
            <p>No reservations found.</p>
        {:else}
            <input
                    type="text"
                    placeholder="🔍 Search by movie title..."
                    bind:value={reservationSearch}
                    class="w-full p-3 mb-6 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button on:click={exportReservationsCSV} class="bg-blue-600 text-white px-4 py-2 rounded mt-4">
                Export CSV
            </button>

            {#each Object.entries(groupedReservations) as [movieTitle, movieReservations] (movieTitle)}
                <div class="bg-gray-800 rounded-2xl shadow-xl mb-8 p-6 border border-yellow-500">
                    <h2 class="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                        🎞️ {movieTitle}
                    </h2>

                    <ul class="space-y-4">
                        {#each movieReservations as r (r.id)}
                            <li class="bg-gray-700 p-4 rounded-xl shadow border border-gray-600">
                                <p class="text-white"><strong> User:</strong> {r.userEmail}</p>
                                <p class="text-white"><strong> Showtime:</strong> {r.showtime}</p>
                                <p class="text-white"><strong> Seats:</strong> {r.seats.join(", ")}</p>
                                <p class="text-white"><strong> Total:</strong> €{r.totalPrice}</p>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        {/if}
    {/if}

    {#if section === "users"}
        {#if userLoading}
            <p>Loading users...</p>
        {:else if userError}
            <p class="text-red-600">{userError}</p>
        {:else if users.length === 0}
            <p>No users found.</p>
        {:else}
            <input
                    type="text"
                    placeholder="🔍 Search user by email..."
                    bind:value={userSearch}
                    class="border p-2 rounded w-full mb-4"
            />
            <div class="space-y-4">
                {#each filteredUsers as u (u.id)}
                    <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-yellow-400 space-y-2 text-white">
                        <p class="text-lg font-semibold"><span class="text-yellow-300"> Email:</span> {u.email}</p>
                        <p><span class="text-yellow-300"> Role:</span> {u.role}</p>
                        <p class="text-sm text-gray-300"> ID: {u.id}</p>

                        <div class="flex flex-wrap gap-4 mt-4">
                            <button
                                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-semibold transition"
                                    on:click={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                            >
                                🔄 Change to {u.role === "admin" ? "user" : "admin"}
                            </button>

                            <button
                                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
                                    on:click={() => deleteUserById(u.id)}
                            >
                                 Delete
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}

    {#if section === "movies"}
        <div class="space-y-6">
            <form
                    on:submit|preventDefault={createMovie}
                    class="bg-gray-800 p-6 rounded-2xl shadow-xl border border-yellow-500 text-white space-y-4"
            >
                <h2 class="text-2xl font-bold text-yellow-400 flex items-center gap-2 mb-2">
                    ➕ Create New Movie
                </h2>

                <input
                        placeholder=" Title"
                        bind:value={newMovie.title}
                        class="bg-gray-700 text-white p-3 w-full rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                />
                <input
                        placeholder=" Genre"
                        bind:value={newMovie.genre}
                        class="bg-gray-700 text-white p-3 w-full rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                />
                <input
                        placeholder=" Duration (min)"
                        bind:value={newMovie.duration}
                        type="number"
                        class="bg-gray-700 text-white p-3 w-full rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                />
                <input
                        placeholder=" Poster URL"
                        bind:value={newMovie.poster}
                        class="bg-gray-700 text-white p-3 w-full rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                />
                <textarea
                        placeholder=" Description"
                        bind:value={newMovie.description}
                        rows="3"
                        class="bg-gray-700 text-white p-3 w-full rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                ></textarea>

                <button
                        type="submit"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                     Create Movie
                </button>
            </form>


            {#if movieLoading}
                <p>Loading movies...</p>
            {:else if movieError}
                <p class="text-red-600">{movieError}</p>
            {:else}
                <ul class="space-y-6">
                    {#each movies as movie (movie.id)}
                        <li class="bg-gray-800 text-white p-6 rounded-xl shadow-md border border-gray-700">
                            {#if editingMovieId === movie.id}
                                <div class="space-y-3">
                                    <input
                                            class="bg-gray-700 border border-gray-600 text-white p-2 w-full rounded"
                                            bind:value={editForm.title}
                                            placeholder=" Title"
                                    />
                                    <input
                                            class="bg-gray-700 border border-gray-600 text-white p-2 w-full rounded"
                                            bind:value={editForm.genre}
                                            placeholder=" Genre"
                                    />
                                    <input
                                            class="bg-gray-700 border border-gray-600 text-white p-2 w-full rounded"
                                            bind:value={editForm.duration}
                                            type="number"
                                            placeholder=" Duration (min)"
                                    />
                                    <input
                                            class="bg-gray-700 border border-gray-600 text-white p-2 w-full rounded"
                                            bind:value={editForm.posterUrl}
                                            placeholder=" Poster URL"
                                    />
                                    <textarea
                                            class="bg-gray-700 border border-gray-600 text-white p-2 w-full rounded"
                                            bind:value={editForm.description}
                                            rows="3"
                                            placeholder=" Description"
                                    ></textarea>

                                    <div class="flex gap-3">
                                        <button
                                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                                                on:click={() => saveEdit(movie.id)}
                                        >
                                             Save
                                        </button>
                                        <button
                                                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                                                on:click={() => editingMovieId = null}
                                        >
                                             Cancel
                                        </button>
                                    </div>
                                </div>
                            {:else}
                                <h3 class="text-xl font-bold text-yellow-300">{movie.title}</h3>
                                <p class="text-sm mb-1">
                                    <span class="text-gray-300 font-semibold"> Genre:</span> {movie.genre} |
                                    <span class="text-gray-300 font-semibold"> Duration:</span> {movie.duration} min
                                </p>
                                <p class="text-gray-300 text-sm mb-4">{movie.description}</p>

                                <div class="flex gap-3">
                                    <button
                                            class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                            on:click={() => startEdit(movie)}
                                    >
                                         Edit
                                    </button>
                                    <button
                                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            on:click={() => deleteMovie(movie.id)}
                                    >
                                         Delete
                                    </button>
                                </div>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    {/if}
</section>