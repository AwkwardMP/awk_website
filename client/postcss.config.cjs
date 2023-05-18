module.exports = {
    plugins: {
        tailwindcss: {
            content: [
                "./index.html",
                "./src/**/*.{vue,js}",
                
            ],
            theme: {
                extend: {},
            },
            plugins: [
            ],
        },
        autoprefixer: {},
    },
}