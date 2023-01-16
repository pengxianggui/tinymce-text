module.exports = {
    publicPath: "/",
    outputDir: 'dist',
    lintOnSave: false,
    assetsDir: 'static',    // 静态资源存放目录,相对于outputDir
    indexPath: 'index.html', // 生成的index.html的输出路径(相对于outputDir), 也可以是绝对路径

    runtimeCompiler: true, // 运行时编译, 支持运行时动态template, dialog.js等部分内容需要此项目支持
    // crossorigin: "",  // 设置生成的html中 link和script标签的 crossorigin属性, 仅影响由html-webpack-plugin在构建时注入的标签,直接写在模板中的标签不受影响
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        sockHost: 'localhost',
        proxy: {
            ['/file']: {
                target: 'http://dev-api-dbmeta.asoco.com.cn',
                pathRewrite: {['/file']: '/file'},
                changeOrigin: true
            }
        }
    }
};
