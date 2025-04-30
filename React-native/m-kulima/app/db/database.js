import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('farm_management.db');
    
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      
      CREATE TABLE IF NOT EXISTS cows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
      );
      
      CREATE TABLE IF NOT EXISTS milk_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cow_id INTEGER NOT NULL,
        day_time TEXT NOT NULL CHECK(day_time IN ('Morning', 'Afternoon', 'Evening')),
        date TEXT NOT NULL,
        litres REAL NOT NULL,
        notes TEXT,
        FOREIGN KEY (cow_id) REFERENCES cows (id) ON DELETE CASCADE
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Cow CRUD Operations
export const addCow = async (cow) => {
  try {
    return await db.runAsync(
      'INSERT INTO cows (name) VALUES (?)',
      [cow.name]
    );
  } catch (error) {
    console.error('Error adding cow:', error);
    throw error;
  }
};

export const getCows = async () => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM cows WHERE status = "active" ORDER BY name;'
    );
  } catch (error) {
    console.error('Error fetching cows:', error);
    throw error;
  }
};

export const getCowById = async (id) => {
    const result = await db.getAsync('SELECT * FROM cows WHERE id = ?', [id]);
    return result;
  };
  
  export const updateCow = async (id, { name, status }) => {
    return await db.runAsync(
      `UPDATE cows SET 
        name = ?,
        status = ?,
       WHERE id = ?`,
      [name, status, id]
    );
  };
  
  export const deleteCow = async (id) => {
    return await db.runAsync('DELETE FROM cows WHERE id = ?', [id]);
  };
  
  
  // Milk Records Operations
  export const addMilkRecord = async (record) => {
      try {
          return await db.runAsync(
      `INSERT INTO milk_records (cow_id, day_time, date, litres, notes) 
      VALUES (?, ?, ?, ?, ?)`,
      [record.cowId, record.dayTime, record.date, record.litres, record.notes || null]
    );
  } catch (error) {
      console.error('Error adding milk record:', error);
    throw error;
}
};

export const getMilkRecordsByCow = async (cowId) => {
  return await db.getAllAsync(
    'SELECT * FROM milk_records WHERE cow_id = ? ORDER BY date DESC',
    [cowId]
  );
};

export const getMilkRecords = async () => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM milk_records ORDER BY date DESC;'
    );
  } catch (error) {
    console.error('Error fetching milk records:', error);
    throw error;
  }
};

// Utility function to close database
export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
  }
};