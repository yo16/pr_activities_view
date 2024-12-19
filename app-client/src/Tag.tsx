import { Chip } from "@mui/material";
import { Face } from "@mui/icons-material";

interface TagProps {
    tagId: string,
    tagGroupId: string,
    tagName: string
};

export const Tag: React.FC<TagProps> = ({
    tagId,
    tagGroupId,
    tagName,
}) => {
    return (
        <>
            {tagId} / {tagGroupId} / {tagName}
            <Chip label="あいうえお" />
            <Chip label="あいうえお" color="primary" />
            <Chip label="あいうえお" sx={{ bgcolor:"pink", color:"#FFF" }} />
            <Chip label="あいうえお" sx={{ color:"pink" }} variant="outlined" />
            <Chip
                label="あいうえお"
                onDelete={() => console.log('削除されました')}
            />
            <Chip
                label="あいうえお"
                onClick={() => console.log("clicked!")}
                onDelete={() => console.log('削除されました')}
            />
            <Chip
                label="あいうえお"
                icon={<Face />}
            />
            <Chip
                label="あいうえお"
                icon={<Face />}
                size="small"
            />
        </>
    );
}
