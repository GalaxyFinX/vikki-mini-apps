import {createRequire} from 'node:module';
import path from 'node:path';
import * as Repack from '@callstack/repack';

const dirname = Repack.getDirname(import.meta.url);
const {resolve} = createRequire(import.meta.url);

/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 *
 * The API documentation for the functions and plugins used in this file is available at:
 * https://re-pack.dev
 */

/**
 * Webpack configuration.
 * You can also export a static object or a function returning a Promise.
 *
 * @param env Environment options passed from either Webpack CLI or React Native Community CLI
 *            when running with `react-native start/bundle`.
 */
export default env => {
  const {
    mode = 'development',
    context = dirname,
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = resolve('react-native'),
  } = env;

  if (!platform) {
    throw new Error('Missing platform');
  }

  return {
    mode,
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false,
    context,
    entry,
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),

      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      // alias: {
      //   'react-native': reactNativePath,
      // },
    },
    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({platform, devServer}),
    },
    /** Configures optimization of the built bundle. */
    optimization: {
      /** Enables minification based on values passed from React Native Community CLI or from fallback. */
      minimize,
      /** Configure minimizer to process the bundle. */
      chunkIds: 'named',
    },
    module: {
      rules: [
        // Repack.REACT_NATIVE_LOADING_RULES,
        // Repack.NODE_MODULES_LOADING_RULES,
        // Repack.FLOW_TYPED_MODULES_LOADING_RULES,
        /** Here you can adjust loader that will process your files. */
        {
          test: /\.[cm]?[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+react-native/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+expo/,
            /node_modules(.*[/\\])+pretty-format/,
            /node_modules(.*[/\\])+metro/,
            /node_modules(.*[/\\])+abort-controller/,
            /node_modules(.*[/\\])+@callstack[/\\]repack/,
            /node_modules(.*[/\\])+@google-cloud/,
            /node_modules(.*[/\\])+@gorhom/,
            /node_modules(.*[/\\])+@sentry/,
            /node_modules(.*[/\\])+@native-html/,
            /node_modules(.*[/\\])+react-freeze/,
            /node_modules(.*[/\\])+rn-android-keyboard-adjust/,
            /node_modules(.*[/\\])+reactotron-redux/,
            /node_modules(.*[/\\])+reactotron-react-native/,
            /node_modules(.*[/\\])+reactotron-core-contract/,
            /node_modules(.*[/\\])+reactotron-core-client/,
            /node_modules(.*[/\\])+semver/,
            /node_modules(.*[/\\])+yup/,
            /node_modules(.*[/\\])+@galaxyfinx\/vietnam-qrpay-info/,
            /node_modules(.*[/\\])+react-native-safe-area-context/,
            /node_modules(.*[/\\])+xstate/,
            /node_modules(.*[/\\])+axios/,
            /node_modules(.*[/\\])+drange/,
          ],
          use: 'babel-loader',
          type: 'javascript/dynamic',
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                native: true,
                // You might want to uncomment the following line.
                // More info: https://react-svgr.com/docs/options/#dimensions
                dimensions: false,
              },
            },
          ],
        },
        /** Here you can adjust loader that will process your files. */
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              /** Add React Refresh transform only when HMR is enabled. */
              plugins:
                devServer && devServer.hmr
                  ? ['module:react-refresh/babel']
                  : undefined,
            },
          },
        },
        /** Run React Native codegen, required for utilizing new architecture */
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter(ext => ext !== 'svg'),
          ),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
      ],
    },
    plugins: [
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      new Repack.plugins.ModuleFederationPlugin({
        name: 'MiniApp',
        exposes: {
          './MiniApp': './src/navigation/RootNavigation',
          './MiniScreen': './src/screens/WelcomeScreen.tsx',
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '18.3.1',
          },
          'react-native': {
            singleton: true,
            eager: true,
            requiredVersion: '0.76.3',
          },
          '@react-navigation/native': {
            singleton: true,
            eager: true,
            requiredVersion: '6.1.3',
          },
          '@react-navigation/stack': {
            singleton: true,
            eager: true,
            requiredVersion: '^6.3.12',
          },
          'react-native-safe-area-context': {
            singleton: true,
            eager: true,
            requiredVersion: '4.5.0',
          },
          'react-native-screens': {
            singleton: true,
            eager: true,
            requiredVersion: '3.20.0',
          },
        },
      }),
    ],
  };
};