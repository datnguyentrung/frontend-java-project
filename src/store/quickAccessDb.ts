import { SQLiteDatabase } from 'expo-sqlite';
import { Feature } from './types';

export async function migrateQuickAccessDb(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS quick_access (
            idFeature INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            featureGroup TEXT NOT NULL,
            roles TEXT NOT NULL,
            active BOOLEAN NOT NULL,
            icon TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export async function insertQuickAccessFeature(db: SQLiteDatabase, feature: Feature) {
    try {
        await db.runAsync(
            `INSERT INTO quick_access (idFeature, title, featureGroup, roles, active, icon)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [feature.idFeature, feature.title, feature.featureGroup, JSON.stringify(feature.roles), feature.active ? 1 : 0, feature.icon]
        );
        return true;
    } catch (error) {
        console.error('Error inserting quick access feature:', error);
        return false;
    }
}

export async function deleteQuickAccessFeature(db: SQLiteDatabase, idFeature: number) {
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
            SELECT idFeature, title, featureGroup as featureGroup, roles, active, icon 
            FROM quick_access 
            WHERE active = 1 
            ORDER BY created_at ASC
        `);

        return result.map((row: any) => ({
            idFeature: row.idFeature,
            title: row.title,
            featureGroup: row.featureGroup,
            roles: JSON.parse(row.roles),
            active: row.active === 1,
            icon: row.icon
        }));
    } catch (error) {
        console.error('Error getting quick access features:', error);
        return [];
    }
}

export async function isFeatureInQuickAccess(db: SQLiteDatabase, idFeature: number): Promise<boolean> {
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

export async function updateQuickAccessFeature(db: SQLiteDatabase, idFeature: number, updates: Partial<Feature>) {
    try {
        const setClause = [];
        const values = [];

        if (updates.title) {
            setClause.push('title = ?');
            values.push(updates.title);
        }
        if (updates.featureGroup) {
            setClause.push('featureGroup = ?');
            values.push(updates.featureGroup);
        }
        if (updates.roles) {
            setClause.push('roles = ?');
            values.push(JSON.stringify(updates.roles));
        }
        if (updates.active !== undefined) {
            setClause.push('active = ?');
            values.push(updates.active ? 1 : 0);
        }
        if (updates.icon) {
            setClause.push('icon = ?');
            values.push(updates.icon);
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