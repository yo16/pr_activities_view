import { Chip } from "@mui/material";

interface TagProps {
    tagId: string,
    tagGroupId: string,
    tagName: string
};

export const Tag: React.FC<TagProps> = ({
    tagName,
}) => {
    return (
        <>
            <Chip label={tagName} color="primary" />
        </>
    );
}
