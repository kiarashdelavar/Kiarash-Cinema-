<script>
  import router from "page";
  import { writable } from "svelte/store";
  import Home from "./pages/general/Home.svelte";
  import About from "./pages/general/About.svelte";
  import Login from "./pages/auth/Login.svelte";
  import Dashboard from "./pages/user/Dashboard.svelte";
  import AdminLogin from "./pages/auth/AdminLogin.svelte";
  import MyReservations from "./pages/user/MyReservations.svelte";
  import MovieDetail from "./pages/movies/MovieDetail.svelte";
  import Header from "./lib/components/Header.svelte";
  import AdminPanel from "./pages/admin/AdminPanel.svelte";
  import Register from "./pages/auth/Register.svelte";
  import ReservationSuccess from "./pages/user/ReservationSuccess.svelte";
  import Profile from "./pages/user/Profile.svelte";


  const currentRoute = writable("/");
  const currentPage = writable(null);
  const context = writable({});

  function isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  function getRole() {
    return localStorage.getItem("role");
  }


  router("/", ctx => {
    currentPage.set(Home);
    currentRoute.set(ctx.pathname);
    context.set({});
  });

  router("/about", ctx => {
    currentPage.set(About);
    currentRoute.set(ctx.pathname);
    context.set({});
  });

  router("/login", ctx => {
    currentPage.set(Login);
    currentRoute.set(ctx.pathname);
    context.set({});
  });

  router("/dashboard", ctx => {
    if (!isLoggedIn()) return router.redirect("/login");
    currentPage.set(Dashboard);
    currentRoute.set(ctx.pathname);
  });

  router("/my-reservations", ctx => {
    if (!isLoggedIn()) return router.redirect("/login");
    currentPage.set(MyReservations);
    currentRoute.set(ctx.pathname);
    context.set({});
  });

  router("/item/:id", ctx => {
    currentPage.set(MovieDetail);
    currentRoute.set(ctx.pathname);
    context.set(ctx);
  });

  router("/admin", ctx => {
    if (!isLoggedIn()) return router.redirect("/login");
    if (getRole() !== "admin") return router.redirect("/dashboard");

    currentPage.set(AdminPanel);
    currentRoute.set(ctx.pathname);
  });

  router("/register", ctx => {
    currentPage.set(Register);
    currentRoute.set(ctx.pathname);
    context.set({});
  });

  router("/admin-login", ctx => {
    currentPage.set(AdminLogin);
    currentRoute.set(ctx.pathname);
    context.set({});
  });

  router("/reservation-success", ctx => {
    currentPage.set(ReservationSuccess);
    currentRoute.set(ctx.pathname);
    context.set({});
  });

  router("/profile", ctx => {
    currentPage.set(Profile);
    currentRoute.set(ctx.pathname);
    context.set({});
  });


  router.start();
</script>
<Header active={$currentRoute} />

<div class="min-h-screen h-full bg-[#0f172a] text-white">
  {#if $currentPage}
    <svelte:component this={$currentPage} context={$context} />
  {:else}
    <p class="text-red-500">⚠️ No page found!</p>
  {/if}
</div>



