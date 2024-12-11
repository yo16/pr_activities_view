import Koa from 'koa';

const app = new Koa();

// ミドルウェア
app.use(async (ctx) => {
  ctx.body = 'Hello, Koa!';
});

// サーバー起動
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
