<script>
    import { onMount } from "svelte";
    import router from "page";

    let user = localStorage.getItem("name") || localStorage.getItem("email") || "Guest";
    let role = localStorage.getItem("role");

    onMount(() => {
        if (role === "admin") {
            router.redirect("/admin");
        }
    });

    function goTo(path) {
        router(path);
    }
</script>

<section class="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#000000] px-6 py-12 md:px-20 font-cinzel">
    <div class="max-w-4xl mx-auto bg-[#1b1b1b] rounded-3xl shadow-2xl p-10 border border-gray-700">
        <div class="flex items-center mb-6">
            <span class="text-4xl text-yellow-400">🎬</span>
            <h1 class="text-4xl font-bold text-yellow-400 ml-4">Welcome back, {user}!</h1>
        </div>

        <p class="text-gray-300 text-lg mb-8">
            This is your personal cinema dashboard. What would you like to do today?
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div on:click={() => goTo("/profile")} class="cursor-pointer transition hover:scale-[1.03] bg-[#2a2a2a] hover:bg-[#333333] p-6 rounded-xl shadow-lg border border-yellow-500">
                <h2 class="text-xl font-semibold text-yellow-300 mb-2">🔐 View & update profile</h2>
                <p class="text-gray-400 text-sm">Update your personal details and preferences.</p>
            </div>


            <div on:click={() => goTo("/my-reservations")} class="cursor-pointer transition hover:scale-[1.03] bg-[#2a2a2a] hover:bg-[#333333] p-6 rounded-xl shadow-lg border border-red-500">
                <h2 class="text-xl font-semibold text-red-400 mb-2">🎟️ Manage your reservations</h2>
                <p class="text-gray-400 text-sm">Check your bookings and cancel if needed.</p>
            </div>

            <div on:click={() => goTo("/")} class="cursor-pointer transition hover:scale-[1.03] bg-[#2a2a2a] hover:bg-[#333333] p-6 rounded-xl shadow-lg border border-purple-600 col-span-1 sm:col-span-2">
                <h2 class="text-xl font-semibold text-purple-400 mb-2">📽️ Browse more movies</h2>
                <p class="text-gray-400 text-sm">Explore upcoming films and reserve your favorite seats.</p>
            </div>
        </div>
    </div>
</section>

