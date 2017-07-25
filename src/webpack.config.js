var webpack = require("webpack");

module.exports = {
    entry: {
        dnd: './main.js'
    },
    output: {
        filename: './bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['jsx'],
          exclude: /(node_modules)/
        },
        {
          test: /\.js$/,
          loader: 'babel',
          query:{
            compact:true,
            minified:true,
            plugins: [
              "transform-runtime",
              "transform-react-constant-elements",
              "transform-react-inline-elements",
              "transform-react-remove-prop-types"
            ],
            presets: ["es2015", "react"]
          },
          exclude: /(node_modules)/
        },
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass'],
          exclude: /(node_modules)\/react-toolbox/
        },
        {
            test    : /(\.scss|\.css)$/,
            include : /(node_modules)\/react-toolbox/,
            loaders : [
              require.resolve('style-loader'),
              require.resolve('css-loader') + '?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
              require.resolve('sass-loader') + '?sourceMap'
            ]
        }
      ]
    },
    toolbox: {
      theme: 'theme.scss'
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          'NODE_ENV': JSON.stringify("production")
        }
      }),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    ]
};
