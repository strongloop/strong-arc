module.exports = function mountRestApi(server) {
  server.use(server.loopback.rest());
};
