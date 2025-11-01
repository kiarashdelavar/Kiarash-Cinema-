<script>
    import { onMount } from "svelte";

    let name = "";
    let email = "";
    let phoneNumber = "";
    let dateOfBirth = "";
    let favorites = "";
    let bio = "";
    let error = "";
    let success = false;


    onMount(async () => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();

            if (res.ok) {
                name = data.name || "";
                email = data.email || "";
                phoneNumber = data.phoneNumber || "";
                dateOfBirth = data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "";
                favorites = data.favoriteMovies || "";
                bio = data.bio || "";
            } else {
                error = data.message || "Failed to load profile.";
            }
        } catch (err) {
            error = "Error loading profile.";
            console.error(err);
        }
    });

    async function saveProfile() {
        if (!name || !email) {
            error = "Name and email are required.";
            success = false;
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/auth/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phoneNumber,
                    dateOfBirth,
                    favoriteMovies: favorites,
                    bio,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                error = data.message || "Failed to update profile.";
                success = false;
            } else {
                success = true;
                error = "";
            }
        } catch (err) {
            error = "An unexpected error occurred.";
            success = false;
            console.error(err);
        }
    }
</script>

<section class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
    <div class="w-full max-w-3xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-700 p-10">
        <div class="flex items-center space-x-3 mb-8">
            <h1 class="text-4xl font-extrabold text-yellow-400 tracking-tight font-cinzel">
                Edit Profile
            </h1>
        </div>

        {#if success}
            <p class="text-green-400">✅ Profile updated successfully.</p>
        {:else if error}
            <p class="text-red-500">⚠️ {error}</p>
        {/if}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label for="name" class="block text-sm font-semibold text-gray-200 mb-1">Full Name *</label>
                <input id="name" bind:value={name} class="w-full border border-gray-600 bg-black/30 text-white rounded-lg px-4 py-2 focus:ring-yellow-500 focus:outline-none" required />
            </div>

            <div>
                <label for="email" class="block text-sm font-semibold text-gray-200 mb-1">Email *</label>
                <input id="email" bind:value={email} type="email" class="w-full border border-gray-600 bg-black/30 text-white rounded-lg px-4 py-2 focus:ring-yellow-500 focus:outline-none" required />
            </div>

            <div>
                <label for="phone" class="block text-sm font-semibold text-gray-200 mb-1">Phone Number</label>
                <input id="phone" bind:value={phoneNumber} type="tel" pattern="[0-9]{10,15}" class="w-full border border-gray-600 bg-black/30 text-white rounded-lg px-4 py-2 focus:ring-yellow-500 focus:outline-none" />
            </div>

            <div>
                <label for="dob" class="block text-sm font-semibold text-gray-200 mb-1">Date of Birth</label>
                <input id="dob" bind:value={dateOfBirth} type="date" class="w-full border border-gray-600 bg-black/30 text-white rounded-lg px-4 py-2 focus:ring-yellow-500 focus:outline-none" />
            </div>

            <div class="sm:col-span-2">
                <label for="favorites" class="block text-sm font-semibold text-gray-200 mb-1">Favorite Movies</label>
                <input id="favorites" bind:value={favorites} placeholder="e.g. Interstellar, Joker, Parasite" class="w-full border border-gray-600 bg-black/30 text-white rounded-lg px-4 py-2 focus:ring-purple-500 focus:outline-none" />
            </div>

            <div class="sm:col-span-2">
                <label for="bio" class="block text-sm font-semibold text-gray-200 mb-1">Short Bio</label>
                <textarea id="bio" bind:value={bio} rows="3" placeholder="Tell us something about yourself..." class="w-full border border-gray-600 bg-black/30 text-white rounded-lg px-4 py-2 focus:ring-indigo-500 focus:outline-none"></textarea>
            </div>
        </div>

        <div class="flex justify-end mt-8">
            <button on:click={saveProfile} class="bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-xl transition duration-200">
                Save Changes
            </button>
        </div>
    </div>
</section>


