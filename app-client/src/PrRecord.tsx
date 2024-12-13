
import { SERVER_URL } from "./constants";

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
    onMouseClick: () => void;
    isSelected: boolean;
}
export const PrRecord: React.FC<PrRecordProps> = ({
    prId,
    mediaName,
    mediaContentsId,
    postedDate,
    contents,
    lastImpressions,
    showHeader,
    onMouseClick,
    isSelected,
}) => {
    const mediaUrl = MEDIA_URL[mediaName](mediaContentsId);
    const selectedClassName = isSelected? " divPrRecordCommonSelected": "";

    // 更新ボタンクリック時
    function handleOnClickUpdateButton() {
        const fetchRecords = async () => {
            try {
                // サーバーに問い合わせる
                const response = await fetch(`${SERVER_URL}/fetchOneEffect?prid=${prId}`);
                console.log({response});

            } catch (err) {
                const error = err as Error;
                console.error("Error: fetchOneEffect.", prId, error.message);
            }
        };
        fetchRecords();

        // 全体のクリックイベントを呼んで、更新する
        onMouseClick();
    }

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
                className={`divPrRecordCommon divPrOneRecord ${selectedClassName}`}
                onMouseDown={onMouseClick}
            >
                <div>
                    <a href={mediaUrl} target="_blank">{mediaName}</a></div>
                <div>{postedDate}</div>
                <div>{contents}</div>
                <div>{lastImpressions}<br /><button onClick={handleOnClickUpdateButton}>更新</button></div>
            </div>
        </>
    );
};
