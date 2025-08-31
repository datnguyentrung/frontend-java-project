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
                    },
                },
            ],
            'react-native-worklets/plugin', // <-- thêm dòng này để thay cho reanimated/plugin
        ],
    };
};
