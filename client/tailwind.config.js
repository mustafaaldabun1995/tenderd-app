/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            backgroundColor: {
                'theme': 'var(--color-background)',
                'theme-secondary': 'var(--color-background-secondary)',
            },
            textColor: {
                'theme': 'var(--color-text)',
                'theme-secondary': 'var(--color-text-secondary)',
            },
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    light: 'var(--color-primary-light)',
                    dark: 'var(--color-primary-dark)',
                },
            },
        },
    },
    plugins: [],
} 