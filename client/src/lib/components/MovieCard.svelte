<script>
    /**
     * @file MovieCard.svelte
     * @description Reusable movie card component to show movie data and allow reservation.
     * Props: `movie` (object), `onReserve` (function).
     */
    export let movie;
    export let onReserve = (slug) => {};
</script>

<div class="border rounded-lg shadow hover:shadow-lg transition-all bg-white overflow-hidden">
    <img
            src={movie.image}
            alt={movie.title}
            class="w-full h-[250px] object-cover rounded-t"
    />

    <div class="p-4">
        <h2 class="text-xl font-semibold text-gray-800">{movie.title}</h2>
        <p class="text-sm text-gray-500 italic">{movie.genre}</p>
        <p class="text-gray-600">{movie.description}</p>
        <p class="text-sm text-gray-500 mt-1">Duration: {movie.duration} mins</p>

        <button
                class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                on:click={() => movie.slug && onReserve(movie.slug)}
        >
            Reserve
        </button>
    </div>
</div>