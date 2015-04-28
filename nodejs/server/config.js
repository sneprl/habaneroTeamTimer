/**
 * The configuration module
 * @module server/config
 */
module.exports = (function () {
    //configuration object
    return {
        documentRoot: __dirname + '/../',
        hostname: process.env.HOSTNAME || 'localhost',
        port: 3000
    }
})();
