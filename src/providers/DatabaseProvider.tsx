import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { migrateQuickAccessDb } from '../store/quickAccess/quickAccessDb';
import { migrateFeatureDb } from '@/store/features/featureDb';

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
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const initDatabase = async () => {
            try {
                console.log('🔄 Initializing database... (attempt', retryCount + 1, ')');

                // Reset error state
                setError(null);

                // Mở database với retry logic
                const database = await SQLite.openDatabaseAsync('quickAccess.db');

                // Test connection trước khi migration
                console.log('🔍 Testing database connection...');
                await database.execAsync('PRAGMA journal_mode = WAL;');

                console.log('✅ Database connection successful');
                console.log('🔧 Running migrations...');

                // Chạy migration với error handling
                try {
                    await migrateQuickAccessDb(database);
                    console.log('✅ QuickAccess migration completed');
                } catch (migrationError) {
                    console.error('❌ QuickAccess migration failed:', migrationError);
                    throw migrationError;
                }

                try {
                    await migrateFeatureDb(database);
                    console.log('✅ Feature migration completed');
                } catch (migrationError) {
                    console.error('❌ Feature migration failed:', migrationError);
                    throw migrationError;
                }

                setDb(database);
                setIsReady(true);
                setError(null);
                setRetryCount(0);

                console.log('✅ Database initialized successfully');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown database error';
                console.error('❌ Database initialization failed:', errorMessage);

                setError(errorMessage);
                setIsReady(false);
                setDb(null);

                // Retry logic - thử lại tối đa 3 lần
                if (retryCount < 3) {
                    console.log('⏳ Retrying in 2 seconds...');
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, 2000);
                } else {
                    console.error('❌ Max retries reached. Database initialization failed permanently.');
                }
            }
        };

        initDatabase();
    }, [retryCount]);

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
