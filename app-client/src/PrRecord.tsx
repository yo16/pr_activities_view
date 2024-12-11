
interface PrRecordProps {
    prId: string;
}

export const PrRecord: React.FC<PrRecordProps> = ({ prId }) => {
    return (
        <>
            <div>REC:{prId}</div>
        </>
    );
};
