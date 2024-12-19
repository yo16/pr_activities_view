import Koa, { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import cors from '@koa/cors';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import bodyParser from 'koa-bodyparser';

import { getPrMasters } from './getPrMasters.js';
import { getPrDetails } from './getPrDetails.js';
import { fetchAllEffects } from './fetchAllEffects.js';
import { fetchOneEffect } from './fetchOneEffect.js';
import { getTagGroups, postTagGroup } from './tagGroups.js';
import { getTagsByTagGroupId } from './tags.js';

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

// body parser
app.use(bodyParser());

// ルートの登録
app.use(router.routes());
// サポートされていないHTTPメソッドに対するハンドリング
app.use(router.allowedMethods());

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
        ctx.throw(400, ms);
    }
    ctx.body = res;
});

// tagGroups
// タググループ一覧を返す
router.get('/tagGroups', async (ctx) => {
    let ret = null;
    try {
        ret = await getTagGroups();
    }
    catch (err) {
        let errorMessage = "getTagGroups error";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        ctx.app.emit(errorMessage, ctx);
        ctx.throw(400, errorMessage);
    }
    ctx.body = ret;
});

// タググループを追加
interface TagGroups_post {
    tag_group_name: string;
}
router.post('/tagGroups', async (ctx: ParameterizedContext) => {
    const { tag_group_name } = ctx.request.body as TagGroups_post;

    // DBへ登録
    let newTagGroupId: string = "";
    try {
        newTagGroupId = await postTagGroup(tag_group_name);
    }
    catch (err) {
        let errorMessage = "Error while processing postTagGroups";
        if (err instanceof Error) {
            errorMessage = err.message;
        };
        ctx.app.emit(errorMessage, ctx);
        ctx.throw(400, errorMessage);
    }

    ctx.body = {
        tag_group_id: `${newTagGroupId}`,
        tag_group_name: `${tag_group_name}`
    };
});

// tag
// タグ一覧を返す
router.get('/tags', async (ctx) => {
    // クエリパラメータを取得
    const { tag_group_id } = ctx.query;
    if (!tag_group_id) {
        ctx.throw(400, "Illigal parameter tag_group_id");
    }
    const strTagGroupId: string = tag_group_id as string;

    let ret = null;
    try {
        ret = await getTagsByTagGroupId(strTagGroupId);
    }
    catch (err) {
        let errorMessage = "getTagsByTagGroupId error";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        ctx.app.emit(errorMessage, ctx);
        ctx.throw(400, errorMessage);
    }
    ctx.body = ret;
});

interface Tags_post {
    tag_name: string;
}
// タグを追加
router.post('/tags', async (ctx) => {
    const { tag_name } = ctx.request.body as Tags_post;
    ctx.body = "OK";
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
