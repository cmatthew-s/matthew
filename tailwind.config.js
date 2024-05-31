/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // flowbite-svelte
                primary: {
                    700: '#2563eb'
                }
            }
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
    darkMode: 'class',
}