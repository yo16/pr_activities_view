import { useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';    /* Material Icons */
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useMessage } from "./commomComponents/MessageProvider";
import { Tag } from "./Tag";
import { DialogCreateNewTag } from './DialogCreateNewTag';
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
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const [ openDialogCreateNewTag, setOpenDialogCreateNewTag ] = useState<boolean>(false);
    const isOpenMenu = Boolean(anchorEl);
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

    const handleClickMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    // メニュー：新規タグ追加
    const handleMenuAddTag = () => {
        handleCloseMenu();
        setOpenDialogCreateNewTag(true);
    }
    const handleMenuRenameGroup = () => {
        handleCloseMenu();

    }
    const handleMenuDeleteGroup = () => {
        handleCloseMenu();
        
    }

    // 新規タグダイアログが閉じた時
    const onCloseDialogCreateNewTag = (newTagName?: string) => {
        setOpenDialogCreateNewTag(false);
        if ((!newTagName) || newTagName.length === 0) {
            return;
        }

        // 新規タグ登録
        console.log("しんきたくとうろく", newTagName);
        const postData = async () => {
            try {
                // サーバーに問い合わせる
                const response: Response = await fetch(`${SERVER_URL}/tags`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tag_name: newTagName,
                        tag_group_id: tagGroupId,
                    })
                });
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                const {tag_id, tag_name} = await response.json();

                // タグを追加
                setTags([...tags, {tagId: tag_id, tagName: tag_name}]);

            } catch (err) {
                const error = err as Error;
                console.error("Error: post Tags.", error.message);
                showMessage(error.message);
            }
        }

        postData();
    }

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
                                onClick={handleClickMenuOpen}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="tag-group-menu"
                                anchorEl={anchorEl}
                                open={isOpenMenu}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <MenuItem onClick={handleMenuAddTag}>
                                    <ListItemIcon><AddCircleIcon /></ListItemIcon>
                                    <ListItemText>Add new tag</ListItemText>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleMenuRenameGroup}>
                                    <ListItemIcon><EditIcon /></ListItemIcon>
                                    <ListItemText>Rename this group</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleMenuDeleteGroup}>
                                    <ListItemIcon><HighlightOffIcon /></ListItemIcon>
                                    <ListItemText>Delete this group</ListItemText>
                                </MenuItem>
                            </Menu>
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
            <DialogCreateNewTag
                open={openDialogCreateNewTag}
                onClose={onCloseDialogCreateNewTag}
            />
        </>
    );
}