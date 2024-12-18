import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";
import moment from "moment";

import { SERVER_URL } from "./constants";

type prDetailRecord = {
    unixDt: number,
    dateStr: string,
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
                        dateStr: rec.time_stamp,
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

    }, [prId]);

    // 開始日から終了日＋１日までの0:00を生成
    const generateTicks = (startDate: number, endDate: number) => {
        const ticks = [];
        let current = moment(startDate).startOf('day').valueOf(); // 開始日を0:00に
        const end = moment(endDate).add(1, 'day').startOf('day').valueOf(); // 最終日の翌日の0:00
    
        while (current <= end) {
        ticks.push(current);
        current = moment(current).add(1, 'day').valueOf(); // 次の日の0:00
        }
        return ticks;
    };
    // データ範囲に基づくticks
    const ticks = generateTicks(
        Math.min(...chartData.map(d => d.unixDt)), // 最小値
        Math.max(...chartData.map(d => d.unixDt))  // 最大値
    );

    return (
        <div
            style={{backgroundColor: "#FFF"}}
        >
            <LineChart
                data={chartData}
                width={300}
                height={300}
            >
                <Line type="monotone" dataKey="value" stroke="#f99" strokeWidth={3} />
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    dataKey="unixDt"
                    domain={["dataMin", "dataMax"]}
                    type="number"
                    tickFormatter={(tick) =>
                        moment(tick).format("MM/DD")
                    }
                    ticks={ticks}
                />
                <YAxis />
                <Tooltip
                    labelFormatter={(label) =>
                        moment(label).format("YYYY-MM-DD HH:mm:ss")
                    }
                />
            </LineChart>
        </div>
    );
};
