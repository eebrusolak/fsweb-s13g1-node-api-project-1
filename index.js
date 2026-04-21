const server = require('./api/server');

const port = 9000;

server.listen(port, () => {
    console.log(`\n=== Server listening on http://localhost:${port} ===\n`);
});