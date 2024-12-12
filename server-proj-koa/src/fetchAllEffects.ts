/*
PRMasterに登録されている情報をfetchする

*/

import { getDbConnection } from './db_sqlite/db.js';
import { fetchX } from './fetchX.js';
import type { xMetricsInfo } from './fetchX.js';
import { insertEffect } from './insertEffect.js';

export type effectInfo = {
    prId: string,
    impressions: number,
};

export const fetchAllEffects = async () => {
    // PRMasterのpr_id,media_codeを取得
    const db = await getDbConnection();
    const query = `
        SELECT 
            prm.pr_id,
            prm.media_code,
            prm.media_contents_id
        FROM
            PRMaster prm
        ;`
    ;
    const prs = await db.all(query);

    // media_codeごとにeffectを取得して、DBへ追加
    for (let i=0; i<prs.length; i++) {
        // mediaから情報を取得
        let eff: effectInfo | null = null;
        switch (prs[i].media_code) {
            case 1: // X(Twitter)
                const met: xMetricsInfo = await fetchX(prs[i].media_contents_id);
                eff = {
                    prId: prs[i].pr_id,
                    impressions: met.impression_count,
                };
                break;

            default:    // unknown
                console.warn(`Unknown media_code[${prs[i].media_code}]. (pr_id=${prs[i].pr_id})`);
                continue;
        }

        // 取得した情報を、DBへ登録
        if (eff) {
            insertEffect(eff);
        }
    }

    return "finished";
};

