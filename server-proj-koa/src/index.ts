import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import cors from '@koa/cors';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

import { getPrMasters } from './getPrMasters.js';
import { getPrDetails } from './getPrDetails.js';
import { fetchAllEffects } from './fetchAllEffects.js';
import { fetchOneEffect } from './fetchOneEffect.js';

// .envファイルの内容を読み込む
dotenv.config();

const app = new Koa();
const router = new Router();

// CORSを有効化
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// 静的ファイルサーバーを設定
app.use(serve('public'));

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
    ctx.body = await getPrMasters();
});

router.get('/prDetails', async (ctx) => {
    // クエリパラメータを取得
    const { prid } = ctx.query;

    ctx.body = await getPrDetails(prid as string);
});

router.get('/fetchAllEffects', async (ctx) => {
    ctx.body = await fetchAllEffects();
});
router.get('/fetchOneEffect', async (ctx) => {
    // クエリパラメータを取得
    const { prid } = ctx.query;
    if (!prid) {
        ctx.app.emit('error', ctx);
        ctx.throw(500, "Query parameter prid is not found");
    }

    const res = await fetchOneEffect(prid as string);
    if (res instanceof Error) {
        console.log("--------------------- X ERROR X ----------------------");
        ctx.app.emit('error', ctx, res);
        const ms = res.message;
        console.log("ms", ms);
        ctx.throw(500, ms);
    }
    ctx.body = res;
});

router.get('/tagMasterMainte', async (ctx) => {
    ctx.body = "aa";
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
    .use(router.allowedMethods())
;

app.on('error', (err: Error, ctx) => {
    console.error('server error, err:', err);
    console.error('server error, ctx:', ctx);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
});
  
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled rejection at:", promise, "reason:", reason);
});

// サーバー起動
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
