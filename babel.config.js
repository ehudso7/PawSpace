module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
<<<<<<< HEAD
          root: ['./'],
=======
          root: ['./src'],
>>>>>>> origin/main
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/services': './src/services',
            '@/hooks': './src/hooks',
            '@/types': './src/types',
            '@/constants': './src/constants',
            '@/utils': './src/utils',
          },
<<<<<<< HEAD
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],
    ],
  };
};
=======
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
>>>>>>> origin/main
