import { SQLiteDatabase } from "expo-sqlite";
import { Feature } from '@/types/FeatureTypes';

export async function migrateFeatureDb(db: SQLiteDatabase | null) {
    if (!db) {
        throw new Error('Database connection is null');
    }

    try {
        console.log('🔧 Running feature migration...');

        // Tạo bảng nếu chưa tồn tại (không xóa data cũ)
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS feature (
                idFeature UUID PRIMARY KEY,
                featureGroup TEXT NOT NULL,
                featureName TEXT NOT NULL,
                iconComponent TEXT NOT NULL,
                enabled BOOLEAN NOT NULL,
                roles TEXT NOT NULL
            );
        `);

        // Check if table has data
        const result = await db.getFirstAsync(`SELECT COUNT(*) as count FROM feature;`);
        const count = (result as any)?.count || 0;
        console.log('📊 Feature table has', count, 'records');

        console.log('✅ Feature migration completed successfully');
    } catch (error) {
        console.error('❌ Feature migration failed:', error);
        throw error;
    }
}

export async function insertFeature(db: SQLiteDatabase | null, feature: Feature) {
    if (!db) {
        console.error('❌ Database connection is null');
        return false;
    }

    try {
        // Use INSERT OR REPLACE to handle duplicates
        await db.runAsync(
            `INSERT OR REPLACE INTO feature (idFeature, featureGroup, featureName, iconComponent, enabled, roles)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                feature.idFeature,
                feature.basicInfo.featureGroup,
                feature.basicInfo.featureName,
                feature.basicInfo.iconComponent,
                feature.basicInfo.enabled ? 1 : 0, // Convert boolean to integer for SQLite
                JSON.stringify(feature.basicInfo.roles)
            ]
        );
        console.log('💾 Saved feature:', feature.basicInfo.featureName);
        return true;
    } catch (error) {
        console.error("Error inserting feature:", error);
        return false;
    }
}

export async function updateFeature(db: SQLiteDatabase | null, idFeature: string, updates: Partial<Feature>) {
    if (!db) {
        console.error('❌ Database connection is null');
        return false;
    }

    try {
        const setClause = [];
        const values = [];

        if (updates.basicInfo?.featureGroup !== undefined) {
            setClause.push('featureGroup = ?');
            values.push(updates.basicInfo.featureGroup);
        }
        if (updates.basicInfo?.featureName !== undefined) {
            setClause.push('featureName = ?');
            values.push(updates.basicInfo.featureName);
        }
        if (updates.basicInfo?.iconComponent !== undefined) {
            setClause.push('iconComponent = ?');
            values.push(updates.basicInfo.iconComponent);
        }
        if (updates.basicInfo?.enabled !== undefined) {
            setClause.push('enabled = ?');
            values.push(updates.basicInfo.enabled ? 1 : 0);
        }
        if (updates.basicInfo?.roles !== undefined) {
            setClause.push('roles = ?');
            values.push(JSON.stringify(updates.basicInfo.roles));
        }

        if (setClause.length === 0) {
            return false; // No updates to perform
        }

        values.push(idFeature); // Add idFeature for WHERE clause

        await db.runAsync(
            `UPDATE feature SET ${setClause.join(', ')} WHERE idFeature = ?`,
            values
        );
        return true;
    } catch (error) {
        console.error("Error updating feature:", error);
        return false;
    }
}

export async function deleteFeatures(db: SQLiteDatabase | null, idFeature: string) {
    if (!db) {
        console.error('❌ Database connection is null');
        return false;
    }

    try {
        await db.runAsync(
            `DELETE FROM feature WHERE idFeature = ?`,
            [idFeature]
        );
        return true;
    } catch (error) {
        console.error("Error deleting feature:", error);
        return false;
    }
}

export async function getAllFeaturesFromLocalStorage(db: SQLiteDatabase | null): Promise<Feature[]> {
    if (!db) {
        console.error('❌ Database connection is null');
        return [];
    }

    try {
        const results = await db.getAllAsync(`SELECT * FROM feature;`);
        const features = results.map((result: any) => ({
            idFeature: result.idFeature as string,
            basicInfo: {
                featureGroup: result.featureGroup as string,
                featureName: result.featureName as string,
                iconComponent: result.iconComponent as string,
                enabled: Boolean(result.enabled), // Convert from integer back to boolean
                roles: JSON.parse(result.roles as string)
            }
        }));

        console.log('📦 Local storage returned', features.length, 'features');
        return features;
    } catch (error) {
        console.error("Error getting all feature:", error);
        return [];
    }
}

export async function getFeatureByIdFeature(db: SQLiteDatabase | null, idFeature: string): Promise<Feature | null> {
    if (!db) {
        console.error('❌ Database connection is null');
        return null;
    }

    try {
        const result = await db.getFirstAsync(
            `SELECT * FROM feature WHERE idFeature = ?`,
            [idFeature]
        );
        if (!result) return null;

        const row = result as any;
        return {
            idFeature: row.idFeature as string,
            basicInfo: {
                featureGroup: row.featureGroup as string,
                featureName: row.featureName as string,
                iconComponent: row.iconComponent as string,
                enabled: Boolean(row.enabled), // Convert from integer back to boolean
                roles: JSON.parse(row.roles as string)
            }
        };
    } catch (error) {
        console.error("Error getting feature detail:", error);
        return null;
    }
}

export async function getFeatureByRole(db: SQLiteDatabase | null, userRole: string): Promise<Feature[]> {
    if (!db) {
        console.error('❌ Database connection is null');
        return [];
    }

    try {
        const allFeature = await getAllFeaturesFromLocalStorage(db);
        return allFeature.filter((feature: Feature) =>
            feature.basicInfo.enabled && feature.basicInfo.roles.includes(userRole)
        );
    } catch (error) {
        console.error("Error getting feature by role:", error);
        return [];
    }
}

export async function clearFeature(db: SQLiteDatabase | null) {
    if (!db) {
        console.error('❌ Database connection is null');
        return false;
    }

    try {
        await db.execAsync(`DELETE FROM feature;`);
        return true;
    } catch (error) {
        console.error("Error clearing feature:", error);
        return false;
    }
}