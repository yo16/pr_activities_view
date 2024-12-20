/*
    tag関連
*/

import { nanoid } from 'nanoid';

import { HandlableError } from './HandlableError.js';
import { getDbConnection, getNowStr } from './db_sqlite/db.js';
import { FORMAT } from 'sqlite3';
import { on } from 'events';

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


/*
    PrTagsを追加
    正常に登録出来たらtagIdを返す
    異常時はThrow
*/
export const postTag = async (tagGroupId: string, tagName: string): Promise<string> => {
    if ((!tagGroupId) || (tagGroupId.length === 0)) {
        throw new Error("Post Tag error. group_id is empty.");
    }
    if ((!tagName) || (tagName.length === 0)) {
        throw new Error("Post Tag error. tag_name is empty.");
    }

    // IDを取得
    const id10 = nanoid(10);

    try {
        const db = await getDbConnection();

        // 同じ名前のタグが既にあったらエラー
        const query1 = `
            SELECT
                1
            FROM
                PRTagMaster tm
            WHERE
                tm.tag_name = '${tagName}' AND
                tm.tag_group_id = '${tagGroupId}' AND
                delete_flag = 0
            ;`
        ;
        const row = await db.get(query1);
        if (row) {
            // 存在している
            throw new HandlableError(`Tag name '${tagName}' is already exists.`);
        }

        // insert
        const query2 = `
            INSERT INTO
                PRTagMaster
                (
                    tag_id,
                    tag_group_id,
                    tag_name,
                    delete_flag,
                    create_dt
                )
            VALUES
                (
                    '${id10}',
                    '${tagGroupId}',
                    '${tagName}',
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
        const errorMessage = "postTag error";
        console.error("postTag error", err);
        throw new Error(errorMessage);
    }

    return id10;
};


/*
    PrTagMasterのtag_nameを更新
*/
export const updateTag = async (tagId: string, tagName: string): Promise<void> => {
    if ((!tagId) || (tagId.length === 0)) {
        throw new Error("Post Tag error. tag_id is empty.");
    }
    if ((!tagName) || (tagName.length === 0)) {
        throw new Error("Post Tag error. tag_name is empty.");
    }

    try {
        const db = await getDbConnection();

        // 同じ名前のタグが既にあったらエラー
        const query1 = `
            SELECT
                1
            FROM
                PRTagMaster tm
            WHERE
                tm.tag_name = '${tagName}' AND
                tm.tag_id != '${tagId}'
            ;`
        ;
        const row = await db.get(query1);
        if (row) {
            // 存在している
            throw new HandlableError(`Tag name '${tagName}' is already exists.`);
        }

        // update
        const query2 = `
            UPDATE
                PRTagMaster
            SET
                tag_name = '${tagName}'
            WHERE
                tag_id = '${tagId}'
            ;`
        ;
        db.run(query2);
        db.close();

    } catch (err) {
        if (err instanceof HandlableError) {
            throw new Error(err.message);
        }
        const errorMessage = "patchTag error";
        console.error("updateTag error", err);
        throw new Error(errorMessage);
    }

    return ;
};
