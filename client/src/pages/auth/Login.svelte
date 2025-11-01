<script>
  import router from "page";
  import { auth } from "../../lib/stores/authStore.js";
  import loginImage from "../../assets/auth/login.jpg";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  /** @constant {RegExp} emailRegex - Validates email format */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /** @constant {RegExp} passwordRegex - Ensures password has at least 6 characters */
  const passwordRegex = /^.{6,}$/;

  /**
   * @function handleLogin
   * @description Handles the user login process:
   *  - Validates email & password format.
   *  - Sends POST request to `/api/auth/login`.
   *  - Stores user info and token in `localStorage`.
   *  - Updates `auth` store and redirects based on role.
   * @async
   * @returns {Promise<void>} Redirects to dashboard or admin page on success.
   */
  async function handleLogin() {
    error = "";

    if (!email || !password) {
      error = "Both fields are required.";
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

    loading = true;

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        error = data.message || "Login failed.";
        return;
      }

      const user = data.user || data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);

      auth.set({
        token: data.token,
        role: data.role,
        email: user.email,
        name: user.name
      });

      router(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (e) {
      error = "Could not connect to the server.";
      console.error(e);
    } finally {
      loading = false;
    }
  }
</script>


<section class="w-screen h-screen flex flex-row overflow-hidden">
  <div class="hidden md:flex w-1/2 h-full">
    <img src={loginImage} alt="Cinema background" class="object-cover w-full h-full" />
  </div>

  <div class="w-full md:w-1/2 flex items-center justify-center bg-gray-900">
    <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-900">
        Login
      </h1>

      <form on:submit|preventDefault={handleLogin} class="space-y-5">

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
                disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>


        {#if error}
          <p class="text-red-600 text-center text-sm mt-2">{error}</p>
        {/if}


        <p class="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?
          <a href="/register" class="text-yellow-600 hover:underline font-semibold">Register here</a>
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