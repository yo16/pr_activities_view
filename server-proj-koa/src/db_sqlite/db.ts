import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
const sqlite = sqlite3.verbose();

export async function getDbConnection() {
    // SQLite3データベースへの接続を初期化
    return open({
        filename: './data/pra.db',
        driver: sqlite.Database,
    });
}

export function getNowStr() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
