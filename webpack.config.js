const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons'],
      },
    },
    argv
  );

  // Add crypto and stream polyfills for webpack 5
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
  };

  // Ignore missing asset files during build
  config.module.rules.push({
    test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          emitFile: false, // Don't emit files if they don't exist
        },
      },
    ],
  });

  return config;
};
