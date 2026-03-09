module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './app/components',
            '@screens': './app/screens',
            '@hooks': './app/hooks',
            '@utils': './app/utils',
            '@context': './app/context',
            '@navigation': './app/navigation',
            '@types': './app/types',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
}; 