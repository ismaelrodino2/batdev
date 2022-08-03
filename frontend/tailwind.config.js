/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        colors: {
            primary: '#222222',
            secondary: '#444444',
            'primary-medium': '#74C2BD',
            'neutral-low-high': '#F5F5F5',
            white: '#FFFFFF',
            gray: '#909699'
        },
        extend: {
            fontFamily: {
                raleway: 'Raleway'
            }
        }
    },
    plugins: []
}
