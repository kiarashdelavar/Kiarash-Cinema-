<script>
    import cinemaImage from "../../assets/about/cinema.jpg";
    import screenImage from "../../assets/about/screen.jpg";
    import seatsImage from "../../assets/about/seats.jpg";
</script>

<section class="w-full min-h-screen bg-gradient-to-br from-black via-[#111111] to-[#0a0a0a] text-white font-cinzel">
    <div class="relative">
        <img src={cinemaImage} alt="Cinema Exterior" class="w-full h-80 object-cover rounded-b-3xl shadow-xl" />
        <div class="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-yellow-400 drop-shadow-md">
                Welcome to Kiarash Cinema
            </h1>
            <p class="mt-2 text-lg md:text-xl text-gray-200">Experience movies like never before</p>
        </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-12">
        <h2 class="text-3xl font-bold text-yellow-300 mb-4"> Our Story</h2>
        <p class="text-gray-300 leading-relaxed mb-8">
            Since 2025, <span class="text-white font-semibold">Kiarash Cinema</span> has been the heart of movie entertainment in Deventer.
            We aim to bring communities together through powerful storytelling, immersive visuals, and unforgettable sound.
        </p>

        <h2 class="text-3xl font-bold text-yellow-300 mt-10 mb-6"> What We Offer</h2>
        <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-[#1e1e1e] rounded-xl shadow-lg p-4">
                <img src={screenImage} alt="Screen" class="w-full h-40 object-cover rounded mb-3" />
                <h3 class="font-bold text-lg text-yellow-200">Ultra HD Screens</h3>
                <p class="text-sm text-gray-400">4K Dolby Atmos screens for a breathtaking experience.</p>
            </div>
            <div class="bg-[#1e1e1e] rounded-xl shadow-lg p-4">
                <img src={seatsImage} alt="Seats" class="w-full h-40 object-cover rounded mb-3" />
                <h3 class="font-bold text-lg text-yellow-200">Luxury Seating</h3>
                <p class="text-sm text-gray-400">Reclining leather seats with legroom and tray tables.</p>
            </div>
            <div class="bg-[#1e1e1e] rounded-xl shadow-lg p-4">
                <img src={cinemaImage} alt="Snacks" class="w-full h-40 object-cover rounded mb-3" />
                <h3 class="font-bold text-lg text-yellow-200">Snacks & Bar</h3>
                <p class="text-sm text-gray-400">Fresh popcorn, soft drinks, and curated movie snacks.</p>
            </div>
        </div>

        <div class="mt-12 bg-[#2a2a2a] p-6 rounded-2xl shadow-xl border border-gray-700">
            <h2 class="text-2xl font-bold text-yellow-300 mb-3">📍 Visit Us</h2>
            <p class="text-gray-300 mb-1">️Address: Kiarash Cinema, Handelskade 75, 7417 DH Deventer, Netherlands</p>
            <p class="text-gray-300 mb-1">Phone: +31 612345678</p>
            <p class="text-gray-300">Email: contact@kiarashcinema.nl</p>
        </div>
    </div>
</section>

