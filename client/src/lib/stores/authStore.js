import { writable } from "svelte/store";

export const auth = writable({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    email: localStorage.getItem("email"),
    name: localStorage.getItem("name")
});

export function clearAuth() {
    localStorage.clear();
    auth.set({ token: null, role: null, name: null });
}

