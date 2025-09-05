const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
    // [Web-only]: Enables CSS support in Metro.
    isCSSEnabled: true,
});

// Enable hermes for better performance
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
