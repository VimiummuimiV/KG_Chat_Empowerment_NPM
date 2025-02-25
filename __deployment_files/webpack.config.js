const InertEntryPlugin = require('inert-entry-webpack-plugin');
const path = require('path');
const fs = require('fs');

// Recursively get all files in a directory, excluding build folder
const getFiles = (dir, buildFolder, originalDir = null) => {
    const results = {};
    const baseDir = originalDir || dir;
    const excluded = new Set([buildFolder]);

    const processEntry = (filePath) => {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            return getFiles(filePath, buildFolder, baseDir);
        }

        const relativePath = path.relative(baseDir, filePath);
        const parsedPath = path.parse(relativePath);
        const outputBase = path.join(dir, buildFolder, parsedPath.dir);

        return {
            [path.join(outputBase, parsedPath.name)]: `./${filePath}`
        };
    };

    fs.readdirSync(dir).forEach(file => {
        if (!excluded.has(file)) {
            const fullPath = path.join(dir, file);
            Object.assign(results, processEntry(fullPath));
        }
    });

    return results;
};

/**
 * Webpack configuration factory
 * @param {Object} env - Environment variables
 * @param {string} env.NODE_ENV - Environment mode ('dev' or 'prod')
 * @param {string} env.ENTRY_FILE - Entry file(s) in format 'modules/popup.less' or full path
 * @param {string} env.DIR_PATH - Base directory for build (e.g., 'web/stat/css')
 * @param {string} env.PATH_SEPARATOR - Path separator for parsing entry files (e.g., '/css/')
 * @param {string} env.BUILD_TYPE - Output type ('js' or 'css')
 * @param {string} env.BUILD_FOLDER - Output directory name (default: 'prod')
 * @returns {import('webpack').Configuration}
 */
module.exports = env => {
    const {
        ENTRY_FILE,
        DIR_PATH = '',
        PATH_SEPARATOR,
        BUILD_TYPE = '',
        NODE_ENV = 'prod',
        BUILD_FOLDER = 'prod'
    } = env;

    // Normalize directory path
    const dirPath = path.normalize(DIR_PATH).replace(/^(\.\/)|(\/+)/g, '');
    let files = {};

    // Process entry files
    if (ENTRY_FILE) {
        const entryFiles = Array.isArray(ENTRY_FILE) ? ENTRY_FILE : [ENTRY_FILE];

        files = entryFiles.reduce((acc, filePath) => {
            let [baseDir, ...fileParts] = PATH_SEPARATOR
                ? filePath.split(path.normalize(PATH_SEPARATOR))
                : [dirPath, filePath];

            const parsed = path.parse(fileParts.join(path.sep));
            const outputName = path.join(baseDir, BUILD_FOLDER, parsed.dir, parsed.name);

            return {
                ...acc,
                [outputName]: `./${path.join(baseDir, parsed.dir, parsed.base)}`
            };
        }, {});
    } else {
        files = getFiles(dirPath, BUILD_FOLDER);
    }

    // Common configuration
    const config = {
        entry: files,
        output: {
            path: path.resolve(__dirname, BUILD_TYPE === 'js' ? '../' : `../${dirPath}/${BUILD_FOLDER}`),
            filename: BUILD_TYPE === 'js' ? '[name].min.js' : 'unused_filename.min.js'
        },
        mode: NODE_ENV === 'dev' ? 'development' : 'production',
        devtool: NODE_ENV === 'dev' ? 'eval-source-map' : false,
        module: {
            rules: [
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].min.css',
                                outputPath: url => path.join('../../css', BUILD_FOLDER, url)
                            }
                        },
                        'extract-loader',
                        {
                            loader: 'css-loader',
                            options: { url: false }
                        },
                        {
                            loader: 'less-loader',
                            options: { sourceMap: true }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['@babel/plugin-transform-runtime'],
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        }
    };

    // Add plugins for non-JS builds
    if (BUILD_TYPE !== 'js') {
        config.plugins = [new InertEntryPlugin()];
    }

    return config;
};