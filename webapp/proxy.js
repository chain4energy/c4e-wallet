const Koa = require('koa');
const cors = require('@koa/cors');
const proxy = require('koa-proxies');
const app = new Koa();
const port = process.env.PORT || 3006;

app.use(cors());

app.use(
  proxy('/', {
    target: 'https://airdrop.c4e.io/',
    changeOrigin: true,
    logs: true,
  })
);

app.listen(port);
console.log(`listening on port ${port}`);
