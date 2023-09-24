
module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: "http://localhost:3001",
        // pathRewrite: { "/api":''},
        secure: false,
        changeOrigin: true,
      }
    },

  }
};
