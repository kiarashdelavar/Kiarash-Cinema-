import { writable } from "svelte/store";

export const currentRoute = writable("/");
export const currentPage = writable(null);
export const currentContext = writable({});
