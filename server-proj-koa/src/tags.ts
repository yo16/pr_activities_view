/*
    tag関連
*/

import { nanoid } from 'nanoid';

import { HandlableError } from './HandlableError.js';
import { getDbConnection, getNowStr } from './db_sqlite/db.js';

/*
    指定されたTagGroupIdを持つtagを取得
*/
export const getTagsByTagGroupId = async (tag_group_id: string): Promise<{tag_id: string, tag_name: string}[]> => {
    let tags: {tag_id: string, tag_name: string}[] = [];
    try {
        const db = await getDbConnection();

        const query = `
            SELECT
                tag_id,
                tag_name
            FROM
                PRTagMaster
            WHERE
                tag_group_id = '${tag_group_id}' AND
                delete_flag = 0
            ORDER BY
            	tag_name
            ;
        `;
        const tag_recs = await db.all(query);
        tags = [...tag_recs];
        db.close();

    } catch (err) {
        if (err instanceof HandlableError) {
            throw new Error(err.message);
        }
        const errorMessage = "getTagsByTagGroupId error";
        console.error("getTagsByTagGroupId error", err);
        throw new Error(errorMessage);
    }

    return tags;
}
