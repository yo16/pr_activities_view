import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid2';

import { useMessage } from "./commomComponents/MessageProvider";
import { TagGroup } from "./TagGroup";
import { SERVER_URL } from "./constants";

export const TagMasterMaintenance = () => {
    const [ groups, setGroups ] = useState<{tagGroupId: string, tagGroupName: string}[]>([]);
    const [ updateFlag, setUpdateFlag ] = useState<boolean>(true);
    const { showMessage } = useMessage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // サーバーに問い合わせる
                const response: Response = await fetch(`${SERVER_URL}/tagGroups`);
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                
                const responseObj = await response.json();
                setGroups(
                    responseObj.map((o: {tag_group_id: string, tag_group_name: string}) => {
                        return {tagGroupId: o.tag_group_id, tagGroupName: o.tag_group_name};
                    })
                );
            } catch (err) {
                const error = err as Error;
                console.error("Error: fetch TagGroups.", error.message);
                showMessage(error.message);
            }
        }

        fetchData();
    }, [updateFlag]);

    // 新規グループ作成
    const handleClickAddNewTagGroup = () => {
        // 名前を適当に決める
        const oldGroupNames = groups.map((g) => g.tagGroupName);
        console.log({oldGroupNames});
        const groupNameConst = "newGroup";
        let newGroupName = "";
        let i=1;
        do {
            newGroupName = `${groupNameConst}${i++}`;
        } while (oldGroupNames.includes(newGroupName));
        
        const addData = async () => {
            try {
                // 追加
                const response: Response = await fetch(`${SERVER_URL}/tagGroups`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tag_group_name: newGroupName,
                    })
                });
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                const responseObj = await response.json();
                
                setGroups([
                    ...groups,
                    {
                        tagGroupId: responseObj.tag_group_id,
                        tagGroupName: newGroupName,
                    },
                ]);
            } catch (err) {
                const error = err as Error;
                console.error("Error: fetch TagGroups.", error.message);
                showMessage(error.message);
            }
        }
        addData();
        //setUpdateFlag((oldVal) => !oldVal);
    }

    return (
        <>
            <Box>
                <Button
                    variant="contained"
                    sx={{marginBottom: "10px"}}
                    onClick={handleClickAddNewTagGroup}
                >Add new tag group</Button>
                <Grid container spacing={1}>
                    {groups.map((g, i) => (
                        <Grid
                            key={`taggroup_${i}`}
                            size={4}
                        >
                            <TagGroup
                                tagGroupId={g.tagGroupId}
                                tagGroupName={g.tagGroupName}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};
