/*
    tagGroup関連
*/

import { nanoid } from 'nanoid';

import { HandlableError } from './HandlableError.js';
import { getDbConnection, getNowStr } from './db_sqlite/db.js';

/*
    TagGroupを全件取得
*/
export const getTagGroups = async (): Promise<{tag_group_id: string, tag_group_name: string}[]> => {
    let tagGroups: {tag_group_id: string, tag_group_name: string}[] = [];
    try {
        const db = await getDbConnection();

        const query = `
            SELECT
                tag_group_id,
                tag_group_name
            FROM
                PRTagGroupMaster
            WHERE
                delete_flag = 0
            ORDER BY
            	tag_group_name
            ;
        `;
        const tgs = await db.all(query);
        tagGroups = [...tgs];
        db.close();

    } catch (err) {
        if (err instanceof HandlableError) {
            throw new Error(err.message);
        }
        const errorMessage = "postTagGroup error";
        console.error("postTagGroup error", err);
        throw new Error(errorMessage);
    }

    return tagGroups;
}

/*
    TagGroupを追加
    正常に登録出来たらIDを返す
    異常時はThrow
*/
export const postTagGroup = async (tagGroupName: string): Promise<string> => {
    if ((!tagGroupName) || (tagGroupName.length === 0)) {
        throw new Error("Post TagGroup error. group_name is empty.");
    }

    // IDを取得
    const id10 = nanoid(10);

    try {
        const db = await getDbConnection();

        // 同じ名前のグループが既にあったらエラー
        const query1 = `
            SELECT
                1
            FROM
                PRTagGroupMaster tgm
            WHERE
                tgm.tag_group_name = '${tagGroupName}' and
                delete_flag = 0
            ;`
        ;
        const row = await db.get(query1);
        if (row) {
            // 存在している
            throw new HandlableError(`Tag group name '${tagGroupName}' is already exists.`);
        }

        // insert
        const query2 = `
            INSERT INTO
                PRTagGroupMaster
                (
                    tag_group_id,
                    tag_group_name,
                    delete_flag,
                    create_dt
                )
            VALUES
                (
                    '${id10}',
                    '${tagGroupName}',
                    0,
                    '${getNowStr()}'
                )
            ;
        `;
        db.run(query2);
        db.close();

    } catch (err) {
        if (err instanceof HandlableError) {
            throw new Error(err.message);
        }
        const errorMessage = "postTagGroup error";
        console.error("postTagGroup error", err);
        throw new Error(errorMessage);
    }


    return id10;
}
