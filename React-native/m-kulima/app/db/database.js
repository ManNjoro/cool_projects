import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
    try {
      db = await SQLite.openDatabaseAsync('farm_management.db');
      
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        
        -- Create fresh tables with proper schema
        CREATE TABLE IF NOT EXISTS cows (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          updated_at TEXT DEFAULT (datetime('now', 'localtime'))
        );
        
        CREATE TABLE IF NOT EXISTS milk_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cow_id INTEGER NOT NULL,
          day_time TEXT NOT NULL CHECK(day_time IN ('Morning', 'Afternoon', 'Evening')),
          date TEXT NOT NULL,
          litres REAL NOT NULL CHECK(litres > 0),
          notes TEXT,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          updated_at TEXT DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (cow_id) REFERENCES cows (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS creamery_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_time TEXT NOT NULL CHECK(day_time IN ('Morning', 'Afternoon')),
        date TEXT NOT NULL,
        litres REAL NOT NULL CHECK(litres > 0),
        price_per_litre REAL,
        total_amount REAL GENERATED ALWAYS AS (litres * price_per_litre) STORED,
        notes TEXT,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT DEFAULT (datetime('now', 'localtime'))
      );
  
        -- Triggers remain the same
        CREATE TRIGGER IF NOT EXISTS update_cow_timestamp
        AFTER UPDATE ON cows
        BEGIN
          UPDATE cows SET updated_at = datetime('now', 'localtime') 
          WHERE id = NEW.id;
        END;
  
        CREATE TRIGGER IF NOT EXISTS update_milk_record_timestamp
        AFTER UPDATE ON milk_records
        BEGIN
          UPDATE milk_records SET updated_at = datetime('now', 'localtime') 
          WHERE id = NEW.id;
        END;

        CREATE TRIGGER IF NOT EXISTS update_creamery_record_timestamp
      AFTER UPDATE ON creamery_records
      BEGIN
        UPDATE creamery_records SET updated_at = datetime('now', 'localtime') 
        WHERE id = NEW.id;
      END;

      -- Indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_milk_records_date ON milk_records(date);
      CREATE INDEX IF NOT EXISTS idx_creamery_records_date ON creamery_records(date);
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
      'SELECT * FROM cows ORDER BY updated_at DESC;'
    );
  } catch (error) {
    console.error('Error fetching cows:', error);
    throw error;
  }
};

export const getCowById = async (id) => {
    const result = await db.getFirstAsync('SELECT * FROM cows WHERE id = ?', [id]);
    return result;
  };
  
  export const updateCow = async (id, { name, status }) => {
    return await db.runAsync(
      `UPDATE cows SET 
        name = ?,
        status = ?,
        updated_at = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')
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
    'SELECT * FROM milk_records WHERE cow_id = ? ORDER BY updated_at DESC',
    [cowId]
  );
};

export const getMilkRecords = async () => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM milk_records ORDER BY updated_at DESC;'
    );
  } catch (error) {
    console.error('Error fetching milk records:', error);
    throw error;
  }
};

// Creamery Records CRUD Operations
export const addCreameryRecord = async (record) => {
  try {
    return await db.runAsync(
      `INSERT INTO creamery_records 
        (day_time, date, litres, price_per_litre, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        record.dayTime,
        record.date,
        record.litres,
        record.pricePerLitre || null,
        record.notes || null
      ]
    );
  } catch (error) {
    console.error('Error adding creamery record:', error);
    throw error;
  }
};

export const getCreameryRecords = async (filter = {}) => {
  try {
    let query = 'SELECT * FROM creamery_records';
    const params = [];
    
    // Add filtering if provided
    if (filter.date) {
      query += ' WHERE date = ?';
      params.push(filter.date);
    }
    
    query += ' ORDER BY date DESC, day_time ASC';
    
    return await db.getAllAsync(query, params);
  } catch (error) {
    console.error('Error fetching creamery records:', error);
    throw error;
  }
};

export const getCreameryRecordById = async (id) => {
  try {
    return await db.getFirstAsync(
      'SELECT * FROM creamery_records WHERE id = ?',
      [id]
    );
  } catch (error) {
    console.error('Error fetching creamery record:', error);
    throw error;
  }
};

export const updateCreameryRecord = async (id, record) => {
  try {
    return await db.runAsync(
      `UPDATE creamery_records SET
        day_time = ?,
        date = ?,
        litres = ?,
        price_per_litre = ?,
        notes = ?,
        updated_at = datetime('now', 'localtime')
       WHERE id = ?`,
      [
        record.dayTime,
        record.date,
        record.litres,
        record.pricePerLitre || null,
        record.notes || null,
        id
      ]
    );
  } catch (error) {
    console.error('Error updating creamery record:', error);
    throw error;
  }
};

export const deleteCreameryRecord = async (id) => {
  try {
    return await db.runAsync(
      'DELETE FROM creamery_records WHERE id = ?',
      [id]
    );
  } catch (error) {
    console.error('Error deleting creamery record:', error);
    throw error;
  }
};


// Utility function to close database
export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
  }
};