<script>
    /**
     * @file Home.svelte
     * @description Landing page showing now-playing movies, styled like Dashboard/About page.
     */

    import { onMount } from "svelte";
    import router from "page";
    import { titleToFileName } from "../../lib/utils/titleToFileName.js";

    let movies = [];
    let error = "";
    let loading = true;

    onMount(async () => {
        try {
            const res = await fetch("http://localhost:3000/api/movies");
            const data = await res.json();
            if (!res.ok) {
                error = data.message || "Failed to fetch movies.";
                return;
            }
            movies = data.map((movie) => ({
                ...movie,
                image: titleToFileName[movie.title] || "/fallback.jpg"
            }));
        } catch (e) {
            error = "Could not connect to server.";
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>


<div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-['Poppins']">

    <section class="text-center mb-12 py-10">
        <h1 class="text-5xl font-extrabold text-yellow-400 mb-3 drop-shadow"> Welcome to Kiarash Cinema</h1>
        <p class="text-lg text-white/80">Discover the latest blockbusters and reserve your seat today!</p>
    </section>

    <section class="px-4 md:px-12 pb-20">
        {#if loading}
            <div class="text-center text-gray-400 text-xl">️ Loading movies...</div>
        {:else if error}
            <div class="text-center text-red-500 font-semibold text-lg">🚫 {error}</div>
        {:else if movies.length === 0}
            <div class="text-center text-gray-400 text-lg">🎥 No movies available at the moment.</div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {#each movies as movie (movie.id)}
                    <div class="bg-gray-900 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
                        <img
                                src={titleToFileName[movie.title]}
                                alt={movie.title}
                                class="h-64 w-full object-cover rounded-t-2xl"
                        />
                        <div class="p-4 flex flex-col justify-between h-60">
                            <div>
                                <h2 class="text-xl font-bold text-white mb-1">{movie.title}</h2>
                                <p class="text-sm text-pink-400 italic mb-1">{movie.genre}</p>
                                <p class="text-sm text-gray-300 line-clamp-3">{movie.description}</p>
                            </div>
                            <div class="mt-auto flex justify-between items-center pt-4">
                                <span class="text-sm text-gray-400">Duration: {movie.duration} mins</span>
                                <button
                                        class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold py-1.5 px-4 rounded-lg shadow hover:from-yellow-500 hover:to-yellow-600 transition"
                                        on:click={() => router(`/item/${movie.slug}`)}
                                >
                                    Reserve
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </section>
</div>
