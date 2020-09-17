const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: './src/index.ts',
    // Prevents warnings from TypeScript compiler in node_modules
    externals: [
        nodeExternals({
					allowlist: ['webpack/hot/poll?100']
        })
    ],
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, 'lib'),
        filename: '[name].js'
    },
    target: 'node',
    mode: 'production',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {transpileOnly: true}
                    }
                ]
            }
        ]
    }
}
