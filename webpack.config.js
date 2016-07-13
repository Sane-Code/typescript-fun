var path = require('path');

module.exports = {  
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ["src", "node_modules"]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
