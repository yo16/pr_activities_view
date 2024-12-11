import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';

const app = new Koa();
const router = new Router();

// ルーティング
router.get('/', (ctx) => {
  ctx.body = 'Hello, Koa with Router!';
});

router.get('/about', (ctx) => {
  ctx.body = 'This is the About page!';
});

// ルーターをKoaに登録
app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof Error) {
        ctx.status = ctx.status || 500;
        ctx.body = { message: err.message };
        console.error('Error:', err.message);
      } else {
        ctx.status = 500;
        ctx.body = { message: 'An unknown error occurred.' };
        console.error('Unknown Error:', err);
      }
    }
  })
  .use(router.routes())
  .use(router.allowedMethods());

// 静的ファイルサーバーを設定
app.use(serve('public'));

// サーバー起動
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
