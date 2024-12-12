import { getDbConnection } from './db_sqlite/db.js';

export const getPrDetails = async (prId: string) => {
    const db = await getDbConnection();

    // 下記を返す
    //[{
    //    pr_id: string,
    //    time_stamp: string,
    //    impressions: number,
    //},]
    const query = `
        SELECT 
            el.pr_id,
            el.time_stamp,
            el.impressions
        FROM
            EffectLog el
        WHERE 
            el.pr_id = '${prId}'
        ORDER BY 
            el.time_stamp
        ;`
    ;

    const prDetails = await db.all(query);
    return { prDetails };
}