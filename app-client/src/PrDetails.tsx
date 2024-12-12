import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import moment from "moment";

import { SERVER_URL } from "./constants";

type prDetailRecord = {
    unixDt: number,
    value: number,
};

interface PrDetailsProps {
    prId: string;
};
export const PrDetails: React.FC<PrDetailsProps> = ({
    prId,
}) => {
    const [chartData, setChartData] = useState<prDetailRecord[]>([]);

    // 読み込まれたら、DBから詳細情報を取得する
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/prDetails?prid=${prId}`);
                const { prDetails } = await response.json();
                const recs: prDetailRecord[] = [];
                prDetails.forEach((rec: any) => {
                    recs.push({
                        unixDt: moment(rec.time_stamp).valueOf(),
                        value: rec.impressions,
                    });
                });
                setChartData(recs);

            } catch (err) {
                const error = err as Error;
                console.error("Error: Fetching PrMasters.", error.message);
            }
        };
        fetchRecords();

    }, []);

    return (
        <>
            <ResponsiveContainer width={400} height={300}>
                <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis
                        dataKey="unixDt"
                        domain={["dataMin", "dataMax"]}
                        type="number"
                        tickFormatter={(tick) =>
                            moment(tick).format("MM/DD HH:mm")
                        }
                        interval={0}
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(label) =>
                            moment(label).format("YYYY-MM-DD HH:mm:ss")
                        }
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};
