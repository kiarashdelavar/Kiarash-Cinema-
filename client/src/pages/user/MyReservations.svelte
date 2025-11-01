<script>
    /**
     * @file MyReservations.svelte
     * @description Displays logged-in user's reservations. Allows cancel if >24h left.
     */
    import { onMount } from "svelte";

    let reservations = [], error = "", message = "", loading = true;

    const fetchReservations = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            error = "You must be logged in.";
            loading = false;
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/reservations/my", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) reservations = data;
            else error = data.message || "Failed to fetch reservations.";
        } catch {
            error = "Server error while fetching reservations.";
        } finally {
            loading = false;
        }
    };

    const showToast = (msg, type = "info") => {
        const toast = document.createElement("div");
        toast.textContent = msg;
        toast.className = `fixed bottom-5 right-5 z-50 px-4 py-2 rounded shadow-md text-white text-sm animate-fade-in-up
            ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600"}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("opacity-0");
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    const cancelReservation = async (id) => {
        if (!confirm("Cancel this reservation?")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/reservations/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Could not cancel.", "error");
                return;
            }

            showToast("✅ Reservation cancelled.", "success");
            fetchReservations();
        } catch (err) {
            console.error("Cancel error:", err);
            showToast("Something went wrong.", "error");
        }
    };

    onMount(fetchReservations);
</script>


<h1 class="text-3xl font-bold text-pink-400 mb-8">️ My Reservations</h1>

{#if loading}
    <p class="text-white">Loading reservations...</p>
{:else if error}
    <p class="text-red-500">{error}</p>
{:else if reservations.length === 0}
    <p class="text-white">You have no reservations yet.</p>
{:else}
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each reservations as r (r.id)}
            <li class="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-md p-6 text-white space-y-2 animate-fade-in-up transition-all duration-500">
                <h2 class="text-xl font-semibold text-blue-300">🎬 {r.movieTitle}</h2>
                <p><span class="text-gray-300">Showtime:</span> {r.showtime}</p>
                <p><span class="text-gray-300">Building:</span> {r.building}</p>
                <p><span class="text-gray-300">Class:</span> {r.seatClass}</p>
                <p><span class="text-gray-300">Phone:</span> {r.phoneNumber || '-'}</p>
                <p><span class="text-gray-300">Seats:</span> {r.seats?.join(', ') || 'No seats selected'}</p>
                <p><span class="text-gray-300">Total:</span> €{r.totalPrice?.toFixed(2)}</p>
                <p class="text-sm text-gray-400">ID: <code class="font-mono">{r.id}</code></p>

                <button
                        on:click={() => cancelReservation(r.id)}
                        class="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-full shadow text-white font-semibold animate-fade-in-up"
                >
                    Cancel Reservation
                </button>
            </li>
        {/each}
    </ul>
{/if}

{#if message}
    <div class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
        ✅ {message}
    </div>
{/if}