const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");

axios.defaults.baseURL = 'http://localhost:5000';

module.exports = function (app) {
    app.use(
        "/tarefa",
        createProxyMiddleware({
            target: "http://localhost:5000",
            pathRewrite: { "^/tarefa": "/tarefa" },
            changeOrigin: true,
        })
    );
};
