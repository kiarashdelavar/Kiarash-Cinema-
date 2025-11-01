<script>
    import router from "page";
    import { auth, clearAuth } from "../stores/authStore.js";

    let token = "";
    let role = "";
    let name = "";

    $: token = $auth.token;
    $: role = $auth.role;
    $: name = $auth.name;

    function logout() {
        clearAuth();
        router("/login");
        location.reload();
    }
</script>

<nav class="bg-[#0a0a0a] text-white px-6 py-4 shadow-lg flex justify-between items-center font-sans">
    <div
            class="text-xl sm:text-2xl font-bold flex items-center gap-2 cursor-pointer"
            on:click={() => router("/")}
    >
        <span class="text-pink-400 text-2xl">🍿</span>
        <span class="text-white">Kiarash Cinema</span>
    </div>

    <div class="flex gap-6 text-sm sm:text-base items-center">
        <a href="/about" class="text-yellow-400 hover:text-yellow-300 transition">About us</a>

        {#if token}
      <span class="flex gap-4 items-center">
        {#if role === "admin"}
          <a href="/admin" class="text-blue-400 hover:text-blue-300 transition">Admin Panel</a>
        {:else}
          <a href="/dashboard" class="text-blue-400 hover:text-blue-300 transition">Dashboard</a>
        {/if}

          <span class="text-gray-400 hidden sm:inline">Hi, {name || "User"}</span>

        <button
                on:click={logout}
                class="text-red-400 hover:text-red-300 transition font-medium"
        >
          Logout
        </button>
      </span>
        {:else}
      <span class="flex gap-4 items-center">
        <a href="/login" class="text-green-400 hover:text-green-300 transition">Login</a>
        <a href="/register" class="text-green-400 hover:text-green-300 transition">Register</a>
        <a href="/admin-login" class="ml-4 text-yellow-400 hover:text-yellow-300 transition">Log in as Admin</a>
      </span>
        {/if}
    </div>
</nav>

