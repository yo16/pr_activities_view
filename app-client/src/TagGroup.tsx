import { useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';    /* Material Icons */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useMessage } from "./commomComponents/MessageProvider";
import { Tag } from "./Tag";
import { SERVER_URL } from "./constants";

interface TagGroupProps {
    tagGroupId: string;
    tagGroupName: string;
};

export const TagGroup: React.FC<TagGroupProps> = ({
    tagGroupId,
    tagGroupName
}) => {
    const [ tags, setTags ] = useState<{tagId: string, tagName: string}[]>([]);
    const { showMessage } = useMessage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // サーバーに問い合わせる
                const response: Response = await fetch(`${SERVER_URL}/tags?tag_group_id=${tagGroupId}`);
                if (!response.ok) {
                    throw new Error(await response.text());
                }

                const responseObj = await response.json();
                setTags(
                    responseObj.map((o: {tag_id: string, tag_name: string}) => {
                        return {tagId: o.tag_id, tagName: o.tag_name};
                    })
                );
            } catch (err) {
                const error = err as Error;
                console.error("Error: fetch TagGroups.", error.message);
                showMessage(error.message);
            }
        }

        fetchData();
    }, [tagGroupId]);

    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    border: "2px solid #ccc",
                    borderRadius: "10px"
                }}
            >
                <CardContent>
                    <AppBar
                        position="relative" 
                        color="primary"
                        sx={{
                            borderRadius: "8px"
                        }}
                    >
                        <Toolbar
                            variant="dense"
                        >
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1 }}
                            >
                                {tagGroupName}
                            </Typography>
                            <IconButton
                                size="large"
                                aria-label="display more actions"
                                edge="end"
                                color="inherit"
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {(tags.length === 0)
                        ? (
                            <Typography
                                color="textDisabled"
                            >
                                no tags...
                            </Typography>
                        )
                        : tags.map((t, i) => (
                            <Tag
                                key={`tag_${i}`}
                                tagId={t.tagId}
                                tagGroupId={tagGroupId}
                                tagName={t.tagName}
                            />
                        )
                    )}
                </CardContent>
            </Card>
        </>
    );
}