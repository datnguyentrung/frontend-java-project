import { SQLiteDatabase } from 'expo-sqlite';
import { Feature } from './types';

export async function migrateQuickAccessDb(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS quick_access (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_feature INTEGER NOT NULL UNIQUE,
            title TEXT NOT NULL,
            group_name TEXT NOT NULL,
            role TEXT NOT NULL,
            is_active BOOLEAN NOT NULL,
            icon TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export async function insertQuickAccessFeature(db: SQLiteDatabase, feature: Feature) {
    try {
        await db.runAsync(
            `INSERT INTO quick_access (id_feature, title, group_name, role, is_active, icon)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [feature.id_feature, feature.title, feature.group, JSON.stringify(feature.role), feature.is_active ? 1 : 0, feature.icon]
        );
        return true;
    } catch (error) {
        console.error('Error inserting quick access feature:', error);
        return false;
    }
}

export async function deleteQuickAccessFeature(db: SQLiteDatabase, id_feature: number) {
    try {
        await db.runAsync(
            `DELETE FROM quick_access WHERE id_feature = ?`,
            [id_feature]
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
            SELECT id_feature, title, group_name as group, role, is_active, icon 
            FROM quick_access 
            WHERE is_active = 1 
            ORDER BY created_at ASC
        `);

        return result.map((row: any) => ({
            id_feature: row.id_feature,
            title: row.title,
            group: row.group,
            role: JSON.parse(row.role),
            is_active: row.is_active === 1,
            icon: row.icon
        }));
    } catch (error) {
        console.error('Error getting quick access features:', error);
        return [];
    }
}

export async function isFeatureInQuickAccess(db: SQLiteDatabase, id_feature: number): Promise<boolean> {
    try {
        const result = await db.getFirstAsync(
            `SELECT id FROM quick_access WHERE id_feature = ?`,
            [id_feature]
        );
        return result !== null;
    } catch (error) {
        console.error('Error checking feature in quick access:', error);
        return false;
    }
}

export async function updateQuickAccessFeature(db: SQLiteDatabase, id_feature: number, updates: Partial<Feature>) {
    try {
        const setClause = [];
        const values = [];

        if (updates.title) {
            setClause.push('title = ?');
            values.push(updates.title);
        }
        if (updates.group) {
            setClause.push('group_name = ?');
            values.push(updates.group);
        }
        if (updates.role) {
            setClause.push('role = ?');
            values.push(JSON.stringify(updates.role));
        }
        if (updates.is_active !== undefined) {
            setClause.push('is_active = ?');
            values.push(updates.is_active ? 1 : 0);
        }
        if (updates.icon) {
            setClause.push('icon = ?');
            values.push(updates.icon);
        }

        if (setClause.length > 0) {
            values.push(id_feature);
            await db.runAsync(
                `UPDATE quick_access SET ${setClause.join(', ')} WHERE id_feature = ?`,
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