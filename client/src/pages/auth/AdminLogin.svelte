<script>
    import router from "page";
    import { auth } from "../../lib/stores/authStore.js";
    import loginImage from "../../assets/auth/admin.jpg";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin() {
        error = "";
        loading = true;

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                error = data.message || "Login failed.";
                return;
            }

            if (data.user.role !== "admin") {
                error = "You are not an admin!";
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("name", data.user.name);

            auth.set({
                token: data.token,
                role: data.user.role,
                email: data.user.email,
                name: data.user.name,
            });

            router("/admin");

            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            error = "Server error.";
        } finally {
            loading = false;
        }
    }
</script>

<section class="w-screen h-screen flex flex-row overflow-hidden">

    <div class="hidden md:flex w-1/2 h-full">
        <img src={loginImage} alt="Admin background" class="object-cover w-full h-full" />
    </div>

    <div class="w-full md:w-1/2 flex items-center justify-center bg-gray-900">
        <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
            <h1 class="text-3xl font-bold mb-6 text-center text-gray-900"> Admin Login</h1>

            <form on:submit|preventDefault={handleLogin} class="space-y-5">
                <div>
                    <label class="block mb-1 text-gray-700 font-semibold">Admin Email</label>
                    <input
                            type="email"
                            bind:value={email}
                            placeholder="Enter admin email"
                            class="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-600 text-gray-900 bg-white"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-gray-700 font-semibold">Password</label>
                    <input
                            type="password"
                            bind:value={password}
                            placeholder="Enter admin password"
                            class="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-600 text-gray-900 bg-white"
                    />
                </div>

                <button
                        type="submit"
                        class="bg-red-600 hover:bg-red-700 text-white py-2 w-full rounded-lg font-bold transition duration-300"
                        disabled={loading}
                >
                    {loading ? "Logging in..." : "Admin Login"}
                </button>

                {#if error}
                    <p class="text-red-600 text-center text-sm mt-2">{error}</p>
                {/if}
            </form>
        </div>
    </div>
</section>

<style>
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
        animation: fade-in 0.6s ease-out;
    }
</style>

