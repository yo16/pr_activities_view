/*
XのAPIを使ってフェッチして、metrics情報を返す
    retweet_count
    reply_count
    like_count
    quote_count
    bookmark_count
    impression_count
*/

export type xMetricsInfo = {
    retweet_count: number,
    reply_count: number,
    like_count: number,
    quote_count: number,
    bookmark_count: number,
    impression_count: number,
};

export const fetchX = async (mediaContentsId: string): Promise<xMetricsInfo | Error> => {
    // XのmediaContentsIdは、カンマ区切りで、accountId,tweetIdで格納している
    const [ _, tweetId ] = mediaContentsId.split(",");

    // エンドポイント
    const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`;

    // フェッチ
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`,
        },
    });
    
    // responseの表示
    console.log("--- X API v2 ---");
    //console.dir(response);
    //console.log("Status:", response.status);
    //console.log("Headers.x-rate-limit-limit:", response.headers.get("x-rate-limit-limit"));
    console.log("Limit remaining:", response.headers.get("x-rate-limit-remaining"));
    const resetDt = response.headers.get("x-rate-limit-reset");
    let resetDtString = "";
    if (resetDt) {
        const resetDtNum: number = parseInt(resetDt);
        const resetDate = new Date(resetDtNum * 1000);
        resetDtString = resetDate.toLocaleString();
    }
    console.log("Reset Time:", resetDtString);
    if (!response.ok) {
        console.log("----- X API v2 Error -----");
        console.error("Status:", response.status);
        console.dir(response);

        // status: 429の場合は、Too Many Requests
        if (response.status === 429) {
            const errorMessage = `Too Many Requests. Wait until ${resetDtString}.`;
            return new Error(errorMessage);
        }
        // 上記以外はそのまま返す
        return new Error(`Error: ${response.statusText}`);
    }
  
    // 戻り値の型へ移し替える
    const { data } = await response.json();
    const mtrx: xMetricsInfo = {
        ...data.public_metrics
    };

    return mtrx;
}
