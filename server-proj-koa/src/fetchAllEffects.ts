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
        const eff: effectInfo | null | Error = await fetchOnePrIdByMedia(
            prs[i].pr_id,
            prs[i].media_code,
            prs[i].media_contents_id
        );
        if (!eff) {
            continue;
        }
        if (eff instanceof Error) {
            continue;
        }

        // 取得した情報を、DBへ登録
        if (eff) {
            insertEffect(eff);
        }
    }

    return "finished";
};

// メディアコードに従って１件取得する
export const fetchOnePrIdByMedia = async (
    prId: string,
    mediaCode: number,
    mediaContentsId: string
): Promise<effectInfo | null | Error> => {
    let eff: effectInfo | null = null;
    switch (mediaCode) {
        case 1: // X(Twitter)
            const met: xMetricsInfo | Error = await fetchX(mediaContentsId);
            if (met instanceof Error ) {
                return met;
            }
            eff = {
                prId: prId,
                impressions: met.impression_count,
            };
            break;

        default:    // unknown
            const errorMessage = `Unknown media_code[${mediaCode}]. (pr_id=${prId})`;
            console.warn(errorMessage);
            return new Error(errorMessage);
    }

    return eff;
}