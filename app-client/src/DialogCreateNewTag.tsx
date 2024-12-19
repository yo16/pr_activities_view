/*
    新規タグ用ダイアログ
*/

import { FormEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface DialogCreateNewTagProps {
    open: boolean;
    onClose: (newTagName?: string) => void;
}
export const DialogCreateNewTag = (props: DialogCreateNewTagProps) => {
    //const [ open, setOpen ] = useState<boolean>(false);

    const { open, onClose } = props;

    const handleClose = () => {
        //setOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const newTagName = formJson.tagName;
                        //console.log("New tag name:", newTagName);
                        onClose(newTagName);
                    },
                }}
            >
                <DialogTitle>Add new tag</DialogTitle>
                <DialogContent>
                    <DialogContentText>新しく作るタグの名前を入力してください。</DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="tagName"
                        name="tagName"
                        label="タグ名"
                        type="text"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                    >
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
