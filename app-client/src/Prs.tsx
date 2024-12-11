import { useState, useEffect } from "react";

import { PrRecord } from "./PrRecord";
import { PrDetails } from "./PrDetails";
import { SERVER_URL } from "./constants";

import "./Prs.css";

type prMasterRecord = {
    pr_id: string,
    media_code: string,
    media_contents_id: string,
    posted_date: string,
    contents: string,
    media_name: string,
    latest_impressions: number,
};

export const Prs: React.FC = () => {
    const [prMasterRecords, setPrMasterRecords] = useState<prMasterRecord[]>([]);
    const [detailPrId, setDetailPrId] = useState<string | null>(null);
    const [selectedPrId, setSelectedPrId] = useState<string | null>(null);

    // 表示されたらレコード群を読む
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/prMasters`);
                const { prMasters } = await response.json();
                const recs: prMasterRecord[] = [];
                prMasters.forEach((rec: any) => {
                    // 同じ項目名をそのまま設定する
                    recs.push({...rec});
                });
                setPrMasterRecords(recs);

            } catch (err) {
                const error = err as Error;
                console.error("Error: Fetching PrMasters.", error.message);
            }
        };
        fetchRecords();
    }, []);

    // マウスクリック時に詳細を表示
    const handleOnMouseClick = (prId: string) => {
        setDetailPrId(prId);
        setSelectedPrId(prId);
    };

    return (
        <>
            <div
                className="prRecordsContainer"
            >
                <div
                    className="prRecordsTable"
                >
                {
                    prMasterRecords.map((rec, i) => (
                        <PrRecord
                            key={`prr_${i}`}
                            prId={rec.pr_id}
                            mediaCode={rec.media_code}
                            mediaContentsId={rec.media_contents_id}
                            postedDate={rec.posted_date}
                            contents={rec.contents}
                            mediaName={rec.media_name}
                            lastImpressions={rec.latest_impressions}
                            showHeader={(i===0)}
                            onMouseClick={() => handleOnMouseClick(rec.pr_id)}
                            isSelected={selectedPrId===rec.pr_id}
                        />
                    ))
                }
                </div>
                <div
                    className="prDetailRecordsTable"
                >{detailPrId&&(
                    <PrDetails
                        prId={detailPrId}
                    />
                )}</div>
            </div>
        </>
    );
}
