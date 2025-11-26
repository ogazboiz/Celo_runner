import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer, webpack }) => {
    // Use IgnorePlugin to exclude test files and other unnecessary files
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/test/,
        contextRegExp: /thread-stream/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/bench\.js$/,
        contextRegExp: /thread-stream/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/README\.md$/,
        contextRegExp: /thread-stream/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/LICENSE$/,
        contextRegExp: /thread-stream/,
      })
    );

    // Ignore warnings for these files
    config.ignoreWarnings = [
      { module: /node_modules\/thread-stream/ },
      { file: /node_modules\/thread-stream\/test/ },
      { file: /node_modules\/thread-stream\/bench\.js/ },
      { file: /node_modules\/thread-stream\/README\.md/ },
      { file: /node_modules\/thread-stream\/LICENSE/ },
    ];

    return config;
  },
};

export default nextConfig;
