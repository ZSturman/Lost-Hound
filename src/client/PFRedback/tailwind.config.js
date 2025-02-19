/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Add Colors
                tiff_blue: "#A9E0E2",
                moss: "#236468",
                robin_blue: "#3EBDC6",
                sky_blue: "#8CBEE2",
                tiff_green: "#A8EAD5",
                tea_green: "#CCEECC",
                offwhite: "#FAF8EA",
                caramel: "#ECD0C0",
                gold_yellow: "#F7AF25",
                yellow_orange: "#F79525",
                rose_pink: "#DC7F90",
                light_purple: "#B5A3CA",
                item_bg: "#F7F7F7",
                dark_grey: "#6B6B6B",
                bg: "#9B9B9B"
            },
            fontFamily: {
                // Add Font Family
                pblack: ["Poppins-Black", "sans-serif"],
            },

            boxShadow: {
                item_card: '0px 2px 2px rgb(0 0 0 / 30%)'
            }
        },
    },
    plugins: [],
};
