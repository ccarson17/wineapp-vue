module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://wineapi-dev.us-east-1.elasticbeanstalk.com',        
                /* target: 'http://localhost:51044', */
                changeOrigin: true,
            },
        },
    },
    proxyTable: {
        '/api': {
            target: 'http://wineapi-dev.us-east-1.elasticbeanstalk.com',        
            changeOrigin: true,
        },
    },

}