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

    // 下記を返す
    //type prMasterRecord = {
    //    pr_id: string,
    //    media_code: string,
    //    media_contents_id: string,
    //    posted_date: number,
    //    media_name: string,
    //    latest_impressions: number,
    //};
    const query = `
        SELECT
            p.pr_id AS pr_id,
            p.media_code AS media_code,
            p.media_contents_id AS media_contents_id,
            p.posted_date AS posted_date,
            p.contents as contents,
            mm.media_name AS media_name,
            el.latest_impressions AS latest_impressions
        FROM
            PRMaster AS p
            INNER JOIN
                (
                    SELECT 
                        el.pr_id AS pr_id,
                        el.impressions AS latest_impressions
                    FROM
                        EffectLog AS el,
                        (
                            SELECT
                                pr_id,
                                max(time_stamp) AS latest_time_stamp
                            FROM
                                EffectLog
                            GROUP BY
                                pr_id
                        ) AS latest_el
                    WHERE 
                        el.pr_id = latest_el.pr_id AND 
                        el.time_stamp = latest_el.latest_time_stamp
                ) AS el
                ON
                    p.pr_id = el.pr_id
            INNER JOIN
                MediaMaster AS mm 
                ON
                    p.media_code = mm.media_code
        ORDER BY
            p.posted_date
        ;`
    ;

    const prMasters = await db.all(query);
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
