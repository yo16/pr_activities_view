import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDbConnection() {
  // SQLite3データベースへの接続を初期化
  return open({
    filename: './data/pra.db',
    driver: sqlite3.Database,
  });
}
