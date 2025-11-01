<script>
    import { onMount } from "svelte";
    import router from "page";
    import { auth } from "../../lib/stores/authStore.js";
    import { get } from "svelte/store";
    import AdminPanel from "./AdminPanel.svelte";

    let user = {};

    onMount(() => {
        user = get(auth);
        if (!user || user.role !== "admin") {
            router("/dashboard");
        }
    });
</script>

{#if user.role === "admin"}
    <AdminPanel />
{:else}
    <p class="text-red-500 p-6">🔒 Access denied. Redirecting to dashboard...</p>
{/if}