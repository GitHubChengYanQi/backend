const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())

function resolve (dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash () {
  try {
    return GitRevision.version()
  } catch (e) {
  }
  return 'unknown'
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '/dll/vue.min.js',
    '/dll/vue-router.min.js',
    '/dll/vuex.min.js',
    '/dll/axios.min.js'
  ],
  dll: ['/dll/antDesignVue.dll.js', '/dll/echarts.dll.js', '/dll/vueCropper.dll.js', '/dll/corejs.dll.js', '/dll/vueContainerQuery.dll.js']
}

// vue.config.js
const vueConfig = {
  configureWebpack: config => {
    // webpack plugins
    config.plugins.concat([
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ])
    config.plugins.push(
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    )
    if (isProd) {
      const CompressionWebpackPlugin = require('compression-webpack-plugin')
      config.plugins.push(new CompressionWebpackPlugin({
        test: /\.(js|css)$/,
        threshold: 10240,
        minRatio: 0.8
      }))
      config.externals = assetsCDN.externals
      const dll = ['antDesignVue', 'vueCropper', 'echarts', 'corejs', 'vueContainerQuery']
      dll.map(item => {
        const path = `./public/dll/${item}-manifest.json`
        config.plugins.push(new webpack.DllReferencePlugin({
          manifest: require(path)
        }))
      })
      if (process.env.npm_config_report) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        config.plugins.push(new BundleAnalyzerPlugin())
      }
    }
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    disableHostCheck: true,
    port: 8000,
    // host: 'localhost',
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'https://apijavascrm.yifeijiankang.com/', // 测试
        // target: 'https://devjavascrm.yifeijiankang.com/', // 开发
        // target: 'https://testscrmapi.yifeijiankang.com/',
        // target: 'http://192.168.31.253:6007/',
        // target: 'http://172.16.0.207:6007/',
        // target: 'http://192.168.31.43:6007/',
        // target: 'http://192.168.50.109:6007/', // 娄
        // target: 'http://192.168.31.18:6007/',
        // target: 'http://192.168.31.43:6007/',
        // target: 'http://192.168.31.15:6007/',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 需要rewrite的,
        }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

module.exports = vueConfig
