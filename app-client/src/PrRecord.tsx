import "./PrRecord.css";

const MEDIA_URL: {
    [key: string]: (contentsId: string) => string;
} = {
    "X(Twitter)": (contentsId) => {
        const [accountId, tweetId] = contentsId.split(",");
        return `https://x.com/${accountId}/status/${tweetId}`;
    },
};

interface PrRecordProps {
    prId: string;
    mediaCode: string;
    mediaContentsId: string;
    postedDate: string;
    contents: string;
    mediaName: string;
    lastImpressions: number;
    showHeader: boolean;
}

export const PrRecord: React.FC<PrRecordProps> = ({
    mediaName,
    mediaContentsId,
    postedDate,
    contents,
    lastImpressions,
    showHeader
}) => {
    const mediaUrl = MEDIA_URL[mediaName](mediaContentsId);

    return (
        <>
            {showHeader&&(
                <div
                    className="divPrRecordCommon divPrHeader"
                >
                    <div>media</div>
                    <div>posted</div>
                    <div>contents</div>
                    <div>last imp.</div>
                </div>
            )}
            <div
                className="divPrRecordCommon divPrOneRecord"
            >
                <div>
                    <a href={mediaUrl} target="_blank">{mediaName}</a></div>
                <div>{postedDate}</div>
                <div>{contents}</div>
                <div>{lastImpressions}</div>
            </div>
        </>
    );
};
