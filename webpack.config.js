module.exports = {
    // entry: ["webpack-dev-server/client",'./main.js'],
    entry: './main.js',
    output: {
        path: './',
        filename: 'main-compiled.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    }
};
