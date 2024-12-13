import { getDbConnection } from './db_sqlite/db.js';

export const getPrMasters = async () => {
    const db = await getDbConnection();

    // 下記を返す
    //[{
    //    pr_id: string,
    //    media_code: string,
    //    media_contents_id: string,
    //    posted_date: number,
    //    contents: string,
    //    media_name: string,
    //    latest_impressions: number,
    //    latest_impressions_dt: string,
    //},]
    const query = `
        SELECT
            p.pr_id AS pr_id,
            p.media_code AS media_code,
            p.media_contents_id AS media_contents_id,
            p.posted_date AS posted_date,
            p.contents as contents,
            mm.media_name AS media_name,
            el.latest_impressions AS latest_impressions,
            el.latest_impressions_dt AS latest_impressions_dt
        FROM
            PRMaster AS p
            INNER JOIN
                (
                    SELECT 
                        el.pr_id AS pr_id,
                        el.impressions AS latest_impressions,
                        el.time_stamp AS latest_impressions_dt
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

    return { prMasters };
}
