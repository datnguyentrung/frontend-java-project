module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'], // nếu không dùng Expo thì thay bằng 'module:metro-react-native-babel-preset'
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./src'],
                    alias: {
                        '@': './src',
                        '@components': './src/components',
                        '@services': './src/services',
                        '@utils': './src/utils',
                        '@assets': './src/assets',
                        '@screens': './src/screens',
                        '@styles': './src/styles',
                        '@navigation': './src/navigation',
                        '@store': './src/store',
                        '@providers': './src/providers',
                        '@types': './src/types'
                    },
                },
            ],
            'react-native-reanimated/plugin', // <-- thay đổi để sử dụng reanimated plugin
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env',
                    path: '.env',   // 👈 chỉ rõ file .env nằm ở root (cùng cấp babel.config.js và package.json)
                },
            ],
        ],
    };
};
