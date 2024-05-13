/** @type {import('tailwindcss').Config} */
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
    content: [
        './src/**/*.{html,js,svelte,ts}',  
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
        join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
    ],
    theme: {
        extend: {
            colors: {
                'dark': '#1A1A1A',
                'light-dark': '#212121',
                'main': '#04F5BC',
                'gray': '#1F1F1F',
                'light': '#94a3b8'
            }
        },
    },
    plugins: [
        require('flowbite/plugin'),
        skeleton
    ],
}

