import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('milk_records.db');

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS milk_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cow_name TEXT NOT NULL,
        day_time TEXT NOT NULL,
        date TEXT NOT NULL,
        litres REAL,
        notes TEXT
      );`
    );
  });
};

export const addMilkRecord = (record) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO milk_records (cow_name, day_time, date, litres, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [record.cowName, record.dayTime, record.date, record.litres, record.notes],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getMilkRecords = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM milk_records ORDER BY date DESC;',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};