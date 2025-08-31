/**
 * Index file for providers - Tập trung export tất cả providers
 * 
 * Cách sử dụng:
 * import { DatabaseProvider, useDatabase } from '../providers';
 * 
 * Thay vì phải import:
 * import { DatabaseProvider } from '../providers/DatabaseProvider';
 * import { useDatabase } from '../providers/DatabaseProvider';
 */

// Database Provider exports
export { DatabaseProvider, useDatabase, useDatabaseConnection } from './DatabaseProvider';

// Khi có thêm providers khác, export ở đây:
// export { AuthProvider, useAuth } from './AuthProvider';
// export { ThemeProvider, useTheme } from './ThemeProvider';
