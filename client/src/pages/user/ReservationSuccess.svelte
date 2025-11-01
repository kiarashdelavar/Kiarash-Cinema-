<script>
    import { onMount } from "svelte";
    import router from "page";

    let data = null;

    onMount(() => {
        const stored = localStorage.getItem("lastReservation");
        if (stored) data = JSON.parse(stored);
    });

    function goToReservations() {
        router("/my-reservations");
    }
</script>

{#if data}
    <section class="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-6">
        <div class="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl max-w-xl w-full p-8 border border-white/20">
            <div class="text-center mb-8">
                <div class="text-5xl mb-3">🎉</div>
                <h2 class="text-2xl font-bold text-green-400">Reservation Confirmed!</h2>
                <p class="text-sm text-gray-300 mt-1">Thank you for booking with <span class="text-pink-300 font-semibold">Kiarash Cinema</span></p>
            </div>

            <div class="space-y-4 text-base leading-relaxed">
                <div>
                    <span class="text-gray-300 font-medium"> Movie:</span>
                    <span class="text-cyan-300 ml-2">{data.movieTitle}</span>
                </div>
                <div>
                    <span class="text-gray-300 font-medium"> Showtime:</span>
                    <span class="text-cyan-300 ml-2">{data.showtime}</span>
                </div>
                <div>
                    <span class="text-gray-300 font-medium"> Building:</span>
                    <span class="text-cyan-300 ml-2">{data.buildingName}</span>
                </div>
                <div>
                    <span class="text-gray-300 font-medium"> Seat Class:</span>
                    <span class="text-cyan-300 ml-2">{data.seatClass}</span>
                </div>
                <div>
                    <span class="text-gray-300 font-medium"> Phone:</span>
                    <span class="text-cyan-300 ml-2">{data.phoneNumber || '-'}</span>
                </div>
                <div>
                    <span class="text-gray-300 font-medium"> Seats:</span>
                    <span class="text-cyan-300 ml-2">{data.selectedSeats?.join(', ') || '-'}</span>
                </div>
                <div>
                    <span class="text-gray-300 font-medium"> Total Paid:</span>
                    <span class="text-yellow-400 ml-2 font-semibold">€{data.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div class="mt-6 text-xs text-gray-400 text-center">
                Reservation ID: <code class="font-mono">{data.reservationId || 'N/A'}</code>
            </div>

            <div class="mt-8 text-center">
                <button
                        on:click={goToReservations}
                        class="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition duration-300 text-white font-semibold px-6 py-2 rounded-full shadow-md"
                >
                    View My Reservations
                </button>
            </div>
        </div>
    </section>
{/if}
