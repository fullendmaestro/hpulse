import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginWebExtension } from 'rsbuild-plugin-web-extension'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'

import manifest from './manifest'

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr(),
    pluginNodePolyfill({
      globals: {
        process: true,
        Buffer: true,
      },
      protocolImports: true,
    }),
    pluginWebExtension({
      manifest,
    }),
  ],
  tools: {
    rspack: {
      resolve: {
        fallback: {
          child_process: false,
          fs: false,
          os: false,
          crypto: false,
          path: require.resolve('path-browserify'),
          stream: require.resolve('stream-browserify'),
          util: require.resolve('util'),
          process: require.resolve('process/browser'),
        },
      },
    },
  },
})
