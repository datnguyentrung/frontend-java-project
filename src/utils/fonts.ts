import { Platform } from 'react-native';

/**
 * Font configuration for professional typography
 * Contains platform-specific font families that are available by default
 */
export const fonts = {
    // Header fonts - Bold and professional
    header: {
        ios: 'Avenir-Heavy',
        android: 'sans-serif-medium',
        fontWeight: Platform.OS === 'ios' ? 'normal' : 'bold' as any,
    },

    // Display fonts - For titles and important text
    display: {
        ios: 'Avenir-Black',
        android: 'sans-serif-condensed',
        fontWeight: Platform.OS === 'ios' ? 'normal' : 'bold' as any,
    },

    // Body fonts - For regular content
    body: {
        ios: 'Avenir-Medium',
        android: 'sans-serif',
        fontWeight: Platform.OS === 'ios' ? 'normal' : 'normal' as any,
    },

    // Monospace fonts - For code or technical content
    mono: {
        ios: 'Menlo-Regular',
        android: 'monospace',
        fontWeight: 'normal' as any,
    }
};

/**
 * Get font family based on current platform
 */
export const getFontFamily = (type: keyof typeof fonts) => {
    return Platform.OS === 'ios' ? fonts[type].ios : fonts[type].android;
};

/**
 * Get font weight based on current platform and font type
 */
export const getFontWeight = (type: keyof typeof fonts) => {
    return fonts[type].fontWeight;
};

/**
 * Professional font styles ready to use
 */
export const fontStyles = {
    h1: {
        fontFamily: getFontFamily('display'),
        fontWeight: getFontWeight('display'),
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0.5,
    },
    h2: {
        fontFamily: getFontFamily('header'),
        fontWeight: getFontWeight('header'),
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0.3,
    },
    h3: {
        fontFamily: getFontFamily('header'),
        fontWeight: getFontWeight('header'),
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.2,
    },
    body: {
        fontFamily: getFontFamily('body'),
        fontWeight: getFontWeight('body'),
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
    },
    caption: {
        fontFamily: getFontFamily('body'),
        fontWeight: getFontWeight('body'),
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
    }
};
