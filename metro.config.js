const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration - DEBUG-LIKE RELEASE
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    port: 8081,
  },
  resolver: {
    alias: {
      crypto: 'react-native-crypto-js',
    },
    // Ensure assets are properly resolved
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'],
  },
  transformer: {
    // DISABLE ALL MINIFICATION - Keep exactly like debug
    minifierPath: require.resolve('metro-minify-terser'),
    minifierConfig: {
      keep_fnames: true,
      keep_classnames: true,
      mangle: false,  // NO mangling
      compress: false,  // NO compression
      output: {
        comments: true,  // Keep comments
        beautify: true,  // Keep readable
      },
    },
    // Safe transform options - exactly like debug
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,  // NO inlining
      },
    }),
  },
  serializer: {
    // Keep all modules - no filtering
    processModuleFilter: () => true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
