import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import cors from '@koa/cors';
import { nanoid } from 'nanoid';

import { getDbConnection } from './db_sqlite/db.js';

const app = new Koa();
const router = new Router();

// CORSを有効化
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// ルーティング
router.get('/', (ctx) => {
    ctx.body = 'Hello, Koa with Router!';
});

//router.get('/about', (ctx) => {
//  ctx.body = 'This is the About page!';
//});

// 投稿のマスターデータであるGoogle DriveのSpread Sheetから、情報を取り出し
// ローカルのSQLiteへ登録する
router.get('/getAllPosts', (ctx) => {
    ctx.body = '';
});

router.get('/getNanoId', (ctx) => {
    const id10 = nanoid(10);
    ctx.body = id10;
});

router.get('/prMasters', async (ctx) => {
    const db = await getDbConnection();

    const prMasters = await db.all("SELECT * FROM PRMaster");
    ctx.body = { prMasters };
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
