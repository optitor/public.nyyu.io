module.exports = {
    // Other configurations...
    cache: {
      type: 'filesystem', // Use filesystem caching
      buildDependencies: {
        // This makes all dependencies of this file - build dependencies
        config: [__filename], // Specify the configuration file path
      },
      cacheDirectory: path.resolve(__dirname, '.temp_cache'), // Custom cache directory
      // Adjust the cache strategy
      version: '1.0', // Change this value to invalidate the cache
      store: 'pack', // Use the pack storage strategy (default)
      compression: 'gzip', // Enable compression for cached files
      // Consider more granular control or different caching strategies here
    },
    // Further configurations...
  };
  