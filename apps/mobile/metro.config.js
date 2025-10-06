const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for ES modules
config.resolver.sourceExts.push('mjs');

// Configure transformer for better ES module support
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Configure resolver for better module resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;

