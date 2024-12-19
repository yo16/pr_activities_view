import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import { useMessage } from "./commomComponents/MessageProvider";
import { TagGroup } from "./TagGroup";
import { SERVER_URL } from "./constants";

export const TagMasterMaintenance = () => {
    const [ groups, setGroups ] = useState<{tagGroupId: string, tagGroupName: string}[]>([]);
    const { showMessage } = useMessage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // サーバーに問い合わせる
                const response: Response = await fetch(`${SERVER_URL}/tagGroups`);
                const responseObj = await response.json();
                if (!response.ok) {
                    throw new Error(responseObj.message);
                }
                
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
    }, []);

    return (
        <>
            <Box>
                <Grid container spacing={5}>
                    <Grid size={4}>
                        {groups.map((g, i) => <TagGroup
                            key={`taggroup_${i}`}
                            tagGroupId={g.tagGroupId}
                            tagGroupName={g.tagGroupName}
                        />)}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
