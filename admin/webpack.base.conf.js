module.exports = {
    entry: {
        app: ['babel-polyfill', './src/main.js']
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query:{presets:['es2015']},
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            }]
        }
}