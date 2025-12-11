/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                spotify: '#1DB954',
                'spotify-light': '#1ed760',
                dark: '#121212',
                darker: '#000000',
                card: '#181818',
                'card-hover': '#282828'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
