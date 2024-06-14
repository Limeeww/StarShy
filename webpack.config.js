const webpack = require('webpack');

require('dotenv').config({ path: './.env' });


module.exports = (env, argv) => {
    console.log(process.env.REACT_APP_ID);
    return {
        plugins: [
            new webpack.DefinePlugin({
                "process.env": JSON.stringify(process.env)
            }),
        ],
    }
};