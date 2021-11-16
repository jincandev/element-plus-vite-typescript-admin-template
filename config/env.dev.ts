
export default {
    host: "0.0.0.0",
    port: 4000,
    open: false,
    proxy: {
        "/api": {
            target: "http://127.0.0.1:5000",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
        },
        "jpeg$": {
            target: "http://127.0.0.1:5000",
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, '')
            rewrite(path) {
                console.log("Path:", path)
            }
        }
    },
    cors: true
}