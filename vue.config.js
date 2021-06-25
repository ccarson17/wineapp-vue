module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://oenofile-api.azurewebsites.net',        
                /* target: 'http://localhost:51044', */
                changeOrigin: true,
            },
        },
    },
}