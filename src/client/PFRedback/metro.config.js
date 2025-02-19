// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path'); 

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'bin' to assetExts for tfjs-react-native-para-patch
config.resolver.assetExts.push('bin');

// Ensure Metro can resolve node_modules from the 'client/PFRedback' level
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];


module.exports = config;
