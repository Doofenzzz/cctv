/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    850: '#1e293b', // Custom darker slate if needed
                }
            }
        },
    },
    plugins: [],
}
