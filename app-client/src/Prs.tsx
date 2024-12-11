import { useState, useEffect } from "react";

import { PrRecord } from "./PrRecord";

import "./Prs.css";

const SERVER_URL = "http://localhost:3000";

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

    return (
        <>
            <div
                className="prRecordsTable"
            >
            {
                prMasterRecords.map((rec, i) => (
                    <PrRecord
                        prId={rec.pr_id}
                        mediaCode={rec.media_code}
                        mediaContentsId={rec.media_contents_id}
                        postedDate={rec.posted_date}
                        contents={rec.contents}
                        mediaName={rec.media_name}
                        lastImpressions={rec.latest_impressions}
                        showHeader={(i===0)}
                    />
                ))
            }
            </div>
        </>
    );
}
