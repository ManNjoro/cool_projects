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
          UNIQUE(cow_id, date, day_time),
          FOREIGN KEY (cow_id) REFERENCES cows (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS creamery_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_time TEXT NOT NULL CHECK(day_time IN ('Morning', 'Afternoon')),
        date TEXT NOT NULL,
        litres REAL NOT NULL CHECK(litres > 0),
        price_per_litre REAL DEFAULT 42,
        total_amount REAL GENERATED ALWAYS AS (litres * price_per_litre) STORED,
        notes TEXT,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT DEFAULT (datetime('now', 'localtime')),
        UNIQUE(date, day_time)
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        cost REAL NOT NULL CHECK(cost > 0),
        quantity REAL,
        unit TEXT,
        description TEXT,
        date TEXT DEFAULT (datetime('now', 'localtime')),
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT DEFAULT (datetime('now', 'localtime'))
      );

      CREATE TRIGGER IF NOT EXISTS update_expense_timestamp
      AFTER UPDATE ON expenses
      BEGIN
        UPDATE expenses SET updated_at = datetime('now', 'localtime') 
        WHERE id = NEW.id;
      END;
  
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
      return true;
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
    // throw error;
    return []
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
      // Check for existing record for this cow, date and time
      const existing = await db.getFirstAsync(
        `SELECT id FROM milk_records 
         WHERE cow_id = ? AND date = ? AND day_time = ?`,
        [record.cowId, record.date, record.dayTime]
      );
      
      if (existing) {
        throw new Error('Milk record already exists for this cow, date and time period');
      }
  
      return await db.runAsync(
        `INSERT INTO milk_records 
          (cow_id, day_time, date, litres, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          record.cowId,
          record.dayTime,
          record.date,
          record.litres,
          record.notes || null
        ]
      );
    } catch (error) {
      console.error('Error adding milk record:', error);
      throw error;
    }
  };

export const getMilkRecordsByCow = async (cowId) => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM milk_records WHERE cow_id = ? ORDER BY updated_at DESC',
      [cowId]
    );
    
  } catch (error) {
    console.error('Error fetching milk records:', error);
    return []
  }
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


export const getDailyProductionSummary = async (startDate = null, endDate = null) => {
  try {
    let query = `
      SELECT 
        date,
        SUM(litres) as total_litres,
        COUNT(*) as milking_sessions
      FROM milk_records
    `;
    
    const params = [];
    
    // Add date range filtering if provided
    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE date >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE date <= ?';
      params.push(endDate);
    }
    
    query += ' GROUP BY date ORDER BY date DESC';
    
    const result = await db.getAllAsync(query, params);
    
    // Format the results with additional calculated fields
    return result.map(item => ({
      ...item,
      average_per_session: item.total_litres / item.milking_sessions,
      date: item.date // Ensure date is in YYYY-MM-DD format
    }));
    
  } catch (error) {
    console.error('Error fetching daily production summary:', error);
    throw error;
  }
};

// In your database.js file
// In your database.js file
export const getMilkRecordsByDateRange = async (startDate = null, endDate = null) => {
  try {
    // First get the individual records
    let recordsQuery = `
      SELECT 
        milk_records.id,
        milk_records.date,
        milk_records.day_time,
        milk_records.litres,
        milk_records.notes,
        cows.name as cow_name,
        cows.id as cow_id
      FROM milk_records
      LEFT JOIN cows ON milk_records.cow_id = cows.id
    `;
    
    const params = [];
    
    if (startDate && endDate) {
      recordsQuery += ' WHERE milk_records.date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      recordsQuery += ' WHERE milk_records.date >= ?';
      params.push(startDate);
    } else if (endDate) {
      recordsQuery += ' WHERE milk_records.date <= ?';
      params.push(endDate);
    }
    
    recordsQuery += ' ORDER BY milk_records.date DESC, milk_records.day_time ASC';
    
    const records = await db.getAllAsync(recordsQuery, params);

    // Then get the daily totals per cow
    let totalsQuery = `
      SELECT 
        milk_records.date,
        cows.id as cow_id,
        cows.name as cow_name,
        SUM(milk_records.litres) as daily_total
      FROM milk_records
      LEFT JOIN cows ON milk_records.cow_id = cows.id
    `;
    
    if (params.length > 0) {
      totalsQuery += ' WHERE milk_records.date BETWEEN ? AND ?';
    }
    
    totalsQuery += ' GROUP BY milk_records.date, cows.id, cows.name';
    
    const cowTotals = await db.getAllAsync(totalsQuery, params);

    // Combine the data
    const recordsWithTotals = records.map(record => {
      const cowTotal = cowTotals.find(
        total => total.date === record.date && total.cow_id === record.cow_id
      );
      
      return {
        ...record,
        litres: parseFloat(record.litres),
        cow_daily_total: cowTotal ? parseFloat(cowTotal.daily_total) : 0,
        date: record.date
      };
    });

    return recordsWithTotals;
    
  } catch (error) {
    console.error('Error fetching milk records by date range:', error);
    throw error;
  }
};

// Creamery Records CRUD Operations
// In your database.js
export const addCreameryRecord = async (record) => {
  try {
    // First check if record exists for this date and time
    const existing = await db.getFirstAsync(
      `SELECT id FROM creamery_records 
       WHERE date = ? AND day_time = ?`,
      [record.date, record.dayTime]
    );
    
    if (existing) {
      throw new Error('Record already exists for this date and time period');
    }

    return await db.runAsync(
      `INSERT INTO creamery_records 
        (day_time, date, litres, price_per_litre, notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        record.dayTime,
        record.date,
        record.litres,
        record.pricePerLitre || 42,
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

export const getDailyProductionTotal = async (date) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT COALESCE(SUM(litres), 0) as total 
       FROM milk_records 
       WHERE date = ?`,
      [date]
    );
    return result?.total ?? 0;
  } catch (error) {
    console.error("Error fetching daily production:", error);
    return 0;
  }
};

export const getCreamerySalesToday = async (date) => {
  const result = await db.getFirstAsync(
    `SELECT SUM(litres) as total 
     FROM creamery_records 
     WHERE date = ?`,
    [date]
  );
  return result?.total || 0;
};

export const getMonthlyCreameryRevenue = async (startDate, endDate) => {
  const result = await db.getFirstAsync(
    `SELECT SUM(litres * price_per_litre) as total 
     FROM creamery_records 
     WHERE date BETWEEN ? AND ?`,
    [startDate, endDate]
  );
  return result?.total || 0;
};

export const getActiveCowsCount = async () => {
  const result = await db.getFirstAsync(
    `SELECT COUNT(*) as count 
     FROM cows 
     WHERE status = 'active'`
  );
  return result?.count || 0;
};

export const getAverageProductionPerCow = async () => {
  const result = await db.getFirstAsync(
    `SELECT AVG(litres) as avg 
     FROM milk_records 
     WHERE date = ?`,
    [new Date().toISOString().split('T')[0]]
  );
  return result?.avg || 0;
};

export const updateMilkRecord = async (id, { date, dayTime, litres, notes }) => {
  try {
    // First check if another record exists for this cow with the same date and time
    const existingRecord = await db.getFirstAsync(
      `SELECT id FROM milk_records 
       WHERE id != ? AND cow_id = (
         SELECT cow_id FROM milk_records WHERE id = ?
       ) AND date = ? AND day_time = ?`,
      [id, id, date, dayTime]
    );

    if (existingRecord) {
      throw new Error('A milk record already exists for this cow, date and time period');
    }

    // Update the record
    const result = await db.runAsync(
      `UPDATE milk_records SET
        date = ?,
        day_time = ?,
        litres = ?,
        notes = ?,
        updated_at = datetime('now', 'localtime')
       WHERE id = ?`,
      [date, dayTime, litres, notes || null, id]
    );

    if (result.changes === 0) {
      throw new Error('No record was updated - record may not exist');
    }

    return result;
  } catch (error) {
    console.error('Error updating milk record:', error);
    throw error;
  }
};

// CRUD Operations for Expenses
export const addExpense = async (expense) => {
  try {
    return await db.runAsync(
      `INSERT INTO expenses 
        (name, category, cost, quantity, unit, description, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        expense.name,
        expense.category,
        expense.cost,
        expense.quantity || null,
        expense.unit || null,
        expense.description || null,
        expense.date || new Date().toISOString().split('T')[0]
      ]
    );
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async (filter = {}) => {
  try {
    let query = 'SELECT * FROM expenses';
    const params = [];
    
    if (filter.startDate && filter.endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(filter.startDate, filter.endDate);
    } else if (filter.category) {
      query += ' WHERE category = ?';
      params.push(filter.category);
    }
    
    query += ' ORDER BY date DESC';
    
    return await db.getAllAsync(query, params);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const getExpenseCategories = async () => {
  try {
    return await db.getAllAsync(
      'SELECT DISTINCT category FROM expenses ORDER BY category'
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getTotalExpenses = async (filter = {}) => {
  try {
    let query = 'SELECT SUM(cost) as total FROM expenses';
    const params = [];
    
    if (filter.startDate && filter.endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(filter.startDate, filter.endDate);
    } else if (filter.category) {
      query += ' WHERE category = ?';
      params.push(filter.category);
    }
    
    const result = await db.getFirstAsync(query, params);
    return result?.total || 0;
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    return 0;
  }
};

// Update an existing expense
export const updateExpense = async (id, { name, category, cost, quantity, unit, description, date }) => {
  try {
    const result = await db.runAsync(
      `UPDATE expenses SET
        name = ?,
        category = ?,
        cost = ?,
        quantity = ?,
        unit = ?,
        description = ?,
        date = ?,
        updated_at = datetime('now', 'localtime')
      WHERE id = ?`,
      [name, category, cost, quantity, unit, description, date, id]
    );
    
    if (result.changes === 0) {
      throw new Error('No expense was updated - record may not exist');
    }
    
    return result;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (id) => {
  try {
    return await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Utility function to close database
export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
  }
};