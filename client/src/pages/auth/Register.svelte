<script>
    /**
     * @file Register.svelte
     * @description User registration with name, email, and password.
     */
    import router from "page";
    import registerImage from "../../assets/auth/register.jpg";

    let name = "";
    let email = "";
    let password = "";
    let error = "";
    let success = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    async function register() {
        error = "";
        success = "";

        if (!name || !email || !password) {
            error = "All fields are required.";
            return;
        }

        if (!emailRegex.test(email)) {
            error = "Invalid email format.";
            return;
        }

        if (!passwordRegex.test(password)) {
            error = "Password must be at least 6 characters.";
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role: "user" })
            });

            const data = await res.json();

            if (res.ok) {
                success = "✅ Registered successfully! Redirecting...";
                setTimeout(() => router("/login"), 2000);
            } else {
                error = data.message || "Registration failed.";
            }
        } catch (err) {
            error = "Server error.";
            console.error(err);
        }
    }
</script>

<section class="w-screen h-screen flex flex-row overflow-hidden">

    <div class="hidden md:flex w-1/2 h-full">
        <img src={registerImage} alt="Cinema Register Background" class="object-cover w-full h-full" />
    </div>


    <div class="w-full md:w-1/2 flex items-center justify-center bg-gray-900">
        <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
            <h1 class="text-3xl font-bold mb-6 text-center text-gray-900"> Register</h1>

            <form on:submit|preventDefault={register} class="space-y-5">
                <!-- Name -->
                <div>
                    <label class="block mb-1 text-gray-700 font-semibold">Full Name</label>
                    <input
                            type="text"
                            bind:value={name}
                            placeholder="Enter your name"
                            class="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-600 text-gray-900 bg-white"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-gray-700 font-semibold">Email</label>
                    <input
                            type="email"
                            bind:value={email}
                            placeholder="Enter your email"
                            class="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-600 text-gray-900 bg-white"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-gray-700 font-semibold">Password</label>
                    <input
                            type="password"
                            bind:value={password}
                            placeholder="Enter your password"
                            class="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-600 text-gray-900 bg-white"
                    />
                </div>

                <button
                        type="submit"
                        class="bg-yellow-600 hover:bg-yellow-700 text-white py-2 w-full rounded-lg font-bold transition duration-300"
                >
                    Register
                </button>

                {#if error}
                    <p class="text-red-600 text-center text-sm mt-2">{error}</p>
                {/if}
                {#if success}
                    <p class="text-green-600 text-center text-sm mt-2">{success}</p>
                {/if}


                <p class="text-center text-sm text-gray-600 mt-4">
                    Already have an account?
                    <a href="/auth/Login" class="text-yellow-600 hover:underline font-semibold">Login here</a>
                </p>
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