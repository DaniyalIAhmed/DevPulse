// eslint-disable-next-line @typescript-eslint/no-require-imports
const Koa = require('koa');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const logger = require('koa-logger');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const router = require('@koa/router')();

const app = new Koa();

// middlewares

app.use(logger());

const helloWorld = (ctx) => {
  ctx.body = 'Hello World!!!';
};

router.get('/', helloWorld);

app.use(router.routes());

app.listen(3000);
