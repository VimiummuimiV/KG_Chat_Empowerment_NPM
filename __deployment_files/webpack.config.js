const InertEntryPlugin = require('inert-entry-webpack-plugin'); // этот плагинчик позволяет указывать в качестве точки входа также и не js-файлы
const path = require('path');
const fs = require('fs');

var getFiles = function(dir, buildFolder, originalDir = false) {
    var results = {},
        list = fs.readdirSync(dir),
        excluded = [
            buildFolder
        ];

    var splitDir = originalDir ? originalDir : dir;

    function extend(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }

    list.forEach(function(file) {
        if (excluded.indexOf(file) === -1) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = extend(results, getFiles(file, buildFolder, originalDir ? originalDir : dir));
            } else {
                /* Is a file */
                let split = file.split('.');
                let base = split[0].split(splitDir);

                let baseNew = splitDir+'/'+buildFolder+base[1];

                results[baseNew] = './'+file;
            }
        }
    });
    return results;
};

/**
 *
 * @param env
 * env.NODE_ENV: среда, в которой выполняется сборка (dev - режим отладки, prod - режим запущенного сайта с минимизацией)
 * env.ENTRY_FILE: файл, передаваемый на точку входа (или несколько файлов) в формате вида `modules/popup.less` (если не передан параметр PATH_SEPARATOR), либо в формате от корня проекта `web/stat/css/modules/popup.less` (если передан параметр PATH_SEPARATOR)
 * env.DIR_PATH: рабочая директория, в которой производится сборка (собирает также поддиректории) в формате вида `web/stat/css` (данный параметр требуется, если не передан параметр PATH_SEPARATOR)
 * env.PATH_SEPARATOR: разделитель пути, используемый для получения рабочей директории и имени входного файла (если он передан, то параметр DIR_PATH перезаписывается) в формате вида `/css/`, или `css/`, или `css`
 * env.BUILD_TYPE: тип сборки (js или css)
 * env.BUILD_FOLDER: имя папки, которая будет создаваться для собранных файлов
 *
 * @returns {{output: {path: *, filename: string}, devtool: (string|boolean), entry: *, plugins: [*, *], module: {rules: *[]}}}
 */
module.exports = env => {
    let entryFiles = env.ENTRY_FILE ? env.ENTRY_FILE : '',
        dirPath = env.DIR_PATH ? env.DIR_PATH : '',
        pathSeparator = env.PATH_SEPARATOR ? env.PATH_SEPARATOR : '',
        buildType = env.BUILD_TYPE ? env.BUILD_TYPE : '',
        dirSplit = dirPath.split('/'),
        buildFolder = env.BUILD_FOLDER ? env.BUILD_FOLDER : 'prod';
    
    console.log(dirPath);
    console.log(buildFolder);

    if (dirSplit[0] == '')
        dirSplit.shift();
    if (dirSplit[dirSplit.length-1] == '')
        dirSplit.pop();

    dirPath = dirSplit.join('/');

    let files = {};

    if (entryFiles) {
        if (typeof entryFiles == 'string')
            entryFiles = [entryFiles];

        entryFiles.forEach(function(el){
            if (pathSeparator) {
                let splitPathSeparator = pathSeparator.split('/');
                if (splitPathSeparator[0] == '')
                    splitPathSeparator.shift();
                if (splitPathSeparator[splitPathSeparator.length-1] != '')
                    splitPathSeparator.push('');

                pathSeparator = splitPathSeparator.join('/');

                let splitByTwo = el.split(pathSeparator);

                dirPath = splitByTwo.shift()+pathSeparator.slice(0,-1);
                el = splitByTwo.join(pathSeparator);
            }

            let fileSplit = el.split('.');
            if (fileSplit.length > 1)
                fileSplit.pop();
            let fileBase = fileSplit.join('.');
            files[dirPath+'/'+buildFolder+'/'+fileBase] = './'+dirPath+'/'+el;
        });
    } else {
        files = getFiles(dirPath, buildFolder);
    }

    // console.log(files);

    let filename = buildType == 'js' ? './[name].min.js' : './_build_7739fa0655a595bc5c989d8492943640.min.js';
    let outputPath = path.resolve(__dirname, buildType == 'js' ? '../' : '../'+dirPath+'/'+buildFolder+'/');

    let obj =  {
        entry: files,
        output: {
            filename: filename,
            path: outputPath
        },
        module: {
            rules: [
                {
                    test: /\.(less)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: "[path][name].min.css",
                                outputPath: (url, resourcePath, context) => {
                                    let splitter = dirPath+'/',
                                        outURL = url.split(splitter)[1];

                                    return `../../css/${buildFolder}/${outURL}`;
                                }
                            }
                        },
                        {
                            loader: 'extract-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
                        {
                            loader: 'less-loader' ,
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                "@babel/plugin-transform-runtime"
                            ],
                            presets: [
                                "@babel/preset-env"
                            ]
                        }
                    }
                }
            ]
        },
        devtool: env.NODE_ENV === 'dev' ? 'eval-source-map' : false
    };

    if (buildType != 'js') {
        obj.plugins = [
            new InertEntryPlugin()
        ];
    }

    return obj;
};