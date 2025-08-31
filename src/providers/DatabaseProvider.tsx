import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { migrateQuickAccessDb } from '../store/quickAccessDb';

// Định nghĩa type cho Database Context
interface DatabaseContextType {
    db: SQLite.SQLiteDatabase | null;
    isReady: boolean;
    error: string | null;
}

// Tạo Context
const DatabaseContext = createContext<DatabaseContextType>({
    db: null,
    isReady: false,
    error: null,
});

// Provider component
export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initDatabase = async () => {
            try {
                console.log('Initializing database...');

                // Mở database
                const database = await SQLite.openDatabaseAsync('quickAccess.db');

                // Chạy migration
                await migrateQuickAccessDb(database);

                setDb(database);
                setIsReady(true);
                setError(null);

                console.log('Database initialized successfully');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown database error';
                console.error('Database initialization failed:', errorMessage);
                setError(errorMessage);
                setIsReady(false);
            }
        };

        initDatabase();
    }, []);

    const value: DatabaseContextType = {
        db,
        isReady,
        error,
    };

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    );
};

// Hook để sử dụng Database Context
export const useDatabase = (): DatabaseContextType => {
    const context = useContext(DatabaseContext);

    if (context === undefined) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }

    return context;
};

// Hook để lấy database instance (với error handling)
export const useDatabaseConnection = (): SQLite.SQLiteDatabase => {
    const { db, isReady, error } = useDatabase();

    if (error) {
        throw new Error(`Database error: ${error}`);
    }

    if (!isReady || !db) {
        throw new Error('Database is not ready yet');
    }

    return db;
};
