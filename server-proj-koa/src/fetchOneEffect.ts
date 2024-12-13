/*
PRMasterに登録されている情報の１つをfetchする

*/

import { getDbConnection } from './db_sqlite/db.js';
import { fetchOnePrIdByMedia } from './fetchAllEffects.js';
import { insertEffect } from './insertEffect.js';
import type { effectInfo } from './fetchAllEffects.js';

export const fetchOneEffect = async (
    prId: string,
): Promise<string> => {
    // PRMasterのpr_id,media_codeを取得
    const db = await getDbConnection();
    const query = `
        SELECT 
            prm.pr_id,
            prm.media_code,
            prm.media_contents_id
        FROM
            PRMaster prm
        WHERE
            prm.pr_id = '${prId}'
        ;`
    ;
    const prs = await db.all(query);
    // 見つからない場合は、見つからない旨を返す
    if (prs.length !== 1) {
        console.warn(`Warn: Cannot find prId(${prId})`);
        return `prId "${prId}" is not found!`;
    }

    // media_codeごとにeffectを取得して、DBへ追加
    const eff: effectInfo | null = await fetchOnePrIdByMedia(
        prs[0].pr_id,
        prs[0].media_code,
        prs[0].media_contents_id
    );
    if (!eff) {
        console.warn(`Warn: fetchOnePrIdByMedia returns null ! (${prId})`);
        return "error!";
    }

    // 取得した情報を、DBへ登録
    if (eff) {
        insertEffect(eff);
    }

    return "finished";
};

