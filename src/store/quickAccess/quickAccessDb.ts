import { SQLiteDatabase } from 'expo-sqlite';
import { Feature } from '@/types/FeatureTypes';

export async function migrateQuickAccessDb(db: SQLiteDatabase) {
    // Xóa bảng cũ nếu tồn tại để đảm bảo schema đúng
    await db.execAsync(`DROP TABLE IF EXISTS quick_access;`);

    // Tạo bảng mới với schema đúng
    await db.execAsync(`
        CREATE TABLE quick_access (
            idFeature UUID PRIMARY KEY,
            featureGroup TEXT NOT NULL,
            featureName TEXT NOT NULL,
            iconComponent TEXT NOT NULL,
            enabled BOOLEAN NOT NULL,
            roles TEXT NOT NULL
        );
    `);
}

export async function insertQuickAccessFeature(db: SQLiteDatabase, feature: Feature) {
    try {
        await db.runAsync(
            `INSERT INTO quick_access (idFeature, featureGroup, featureName, iconComponent, enabled, roles)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                feature.idFeature,
                feature.basicInfo.featureGroup,
                feature.basicInfo.featureName,
                feature.basicInfo.iconComponent,
                feature.basicInfo.enabled ? 1 : 0,
                JSON.stringify(feature.basicInfo.roles)
            ]
        );
        return true;
    } catch (error) {
        console.error('Error inserting quick access feature:', error);
        return false;
    }
}

export async function deleteQuickAccessFeature(db: SQLiteDatabase, idFeature: string) {
    try {
        await db.runAsync(
            `DELETE FROM quick_access WHERE idFeature = ?`,
            [idFeature]
        );
        return true;
    } catch (error) {
        console.error('Error deleting quick access feature:', error);
        return false;
    }
}

export async function getQuickAccessFeatures(db: SQLiteDatabase): Promise<Feature[]> {
    try {
        const result = await db.getAllAsync(`
            SELECT idFeature, featureGroup, featureName, iconComponent, enabled, roles
            FROM quick_access
            WHERE enabled = 1
        `);

        return result.map((row: any) => ({
            idFeature: row.idFeature,
            basicInfo: {
                featureGroup: row.featureGroup,
                featureName: row.featureName,
                iconComponent: row.iconComponent,
                enabled: row.enabled === 1,
                roles: JSON.parse(row.roles)
            }
        }));
    } catch (error) {
        console.error('Error getting quick access features:', error);
        return [];
    }
}

export async function isFeatureInQuickAccess(db: SQLiteDatabase, idFeature: string): Promise<boolean> {
    try {
        const result = await db.getFirstAsync(
            `SELECT idFeature FROM quick_access WHERE idFeature = ?`,
            [idFeature]
        );
        return result !== null;
    } catch (error) {
        console.error('Error checking feature in quick access:', error);
        return false;
    }
}

export async function updateQuickAccessFeature(db: SQLiteDatabase, idFeature: string, updates: Partial<Feature>) {
    try {
        const setClause = [];
        const values = [];

        if (updates.basicInfo?.featureGroup) {
            setClause.push('featureGroup = ?');
            values.push(updates.basicInfo.featureGroup);
        }
        if (updates.basicInfo?.featureName) {
            setClause.push('featureName = ?');
            values.push(updates.basicInfo.featureName);
        }
        if (updates.basicInfo?.iconComponent) {
            setClause.push('iconComponent = ?');
            values.push(updates.basicInfo.iconComponent);
        }
        if (updates.basicInfo?.enabled !== undefined) {
            setClause.push('enabled = ?');
            values.push(updates.basicInfo.enabled ? 1 : 0);
        }
        if (updates.basicInfo?.roles) {
            setClause.push('roles = ?');
            values.push(JSON.stringify(updates.basicInfo.roles));
        }

        if (setClause.length > 0) {
            values.push(idFeature);
            await db.runAsync(
                `UPDATE quick_access SET ${setClause.join(', ')} WHERE idFeature = ?`,
                values
            );
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating quick access feature:', error);
        return false;
    }
}

export async function clearQuickAccess(db: SQLiteDatabase) {
    try {
        await db.runAsync(`DELETE FROM quick_access`);
        return true;
    } catch (error) {
        console.error('Error clearing quick access:', error);
        return false;
    }
}