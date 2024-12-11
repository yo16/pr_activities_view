import { useState, useEffect } from "react";

import { PrRecord } from "./PrRecord";

const SERVER_URL = "http://localhost:3000";

type prMasterRecord = {
    pr_id: string,
    media_code: string,
    media_contents_id: string,
    posted_date: number,
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
            PRS---
            {
                prMasterRecords.map((prd) => (
                    <PrRecord
                        prId={prd.pr_id}
                    />
                ))
            }
        </>
    );
}
