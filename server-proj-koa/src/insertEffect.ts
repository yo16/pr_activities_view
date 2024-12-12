/*
メディアから取得したeffectInfoを、DBへ登録する
*/

import { getDbConnection, getNowStr } from './db_sqlite/db.js';
import type { effectInfo } from './fetchAllEffects.js';

export const insertEffect = async (effInfo: effectInfo) => {
    const db = await getDbConnection();

    const query = `
        INSERT INTO
            EffectLog
            (
                pr_id,
                time_stamp,
                impressions
            )
        VALUES
            (
                '${effInfo.prId}',
                '${getNowStr()}',
                ${effInfo.impressions}
            )
        ;
    `;
    db.run(query);
};
