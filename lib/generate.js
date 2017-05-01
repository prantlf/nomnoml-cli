var Canvas = require('canvas'),
    fs = require('fs'),
    nomnoml = require('nomnoml'),
    path = require('path'),
    Q = require('q'),
    stream = require('stream');

// Expands file import directives recursively. A single file can be imported
// only once. It will be replaced by an empty string, if imported once more.
function preprocessInputText(inputText, currentDirectory) {
  var processDirectory = process.cwd(),
      importedFilePaths = [];

  // If the file name is an absolute path, returns it normailzed. If it is
  // a relative path starting with "./" or "../", appends it to the path
  // of the parent file, which the specified file is being expanded to.
  // Otherwise the relative path is  appended to the current directory.
  function completeFilePath(fileName, currentDirectory) {
    var directory;
    if (!path.isAbsolute(fileName)) {
      fileName = fileName.replace(/\\/g, '/');
      if (fileName.indexOf('./') === 0 ||
          fileName.indexOf('../') === 0) {
        directory = currentDirectory;
      } else {
        directory = processDirectory;
      }
      fileName = path.join(directory, fileName);
    }
    return path.resolve(path.normalize(fileName));
  }

  function expandFileImports(inputText, currentDirectory) {
    return inputText.replace(/#import: *(.*)/g, function (all, fileName) {
      fileName = completeFilePath(fileName, currentDirectory);
      if (importedFilePaths.indexOf(fileName) >= 0) {
        return '';
      }
      importedFilePaths.push(fileName);
      return expandFileImports(
          fs.readFileSync(fileName, {encoding: 'utf8'}),
          path.dirname(fileName));
    });
  }

  return expandFileImports(inputText, currentDirectory || processDirectory);
}

module.exports = function (options) {
  return Q.Promise(function (resolve, reject) {
    var inputText = '',
        inputStream;

    function processInputText() {
      var width = options.width || 640,
          height = options.height || 480,
          format = options.format ? options.format.toLowerCase() : 'png',
          inputFile = options.inputFile,
          canvas = new Canvas(width, height, format),
          pngStream, outputStream;

      nomnoml.draw(canvas, preprocessInputText(
          inputText, inputFile && path.dirname(inputFile)));

      if (format === 'png') {
        if (options.output) {
          pngStream = canvas.pngStream();
          pngStream.on('error', function (error) {
            reject(error);
          });

          if (typeof options.output === 'string') {
            outputStream = fs.createWriteStream(options.output);
          } else {
            outputStream = options.output;
          }
          outputStream.on('error', function (error) {
            reject(error);
          });

          pngStream.pipe(outputStream)
                   .on('finish', function () {
                     resolve();
                   })
                   .on('error', function (error) {
                     reject(error);
                   });
        } else {
          resolve(options.resultType === 'stream' ?
            canvas.pngStream() : canvas.toBuffer());
        }
      } else if (format === 'svg') {
        var buffer = canvas.toBuffer();
        if (options.output) {
          if (typeof options.output === 'string') {
            outputStream = fs.createWriteStream(options.output);
          } else {
            outputStream = new stream.PassThrough();
            outputStream.pipe(options.output);
          }
          outputStream.on('finish', function () {
                        resolve();
                      })
                      .on('error', function (error) {
                        reject(error);
                      })
                      .end(buffer);
        } else {
          if (options.resultType === 'stream') {
            var bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);
            resolve(bufferStream);
          }
          else {
            resolve(buffer);
          }
        }
      }
    }

    if (!options) {
      throw new Error('Missing arguments');
    }
    if (typeof options === 'string') {
      options = {input: options};
    } else if (typeof options !== 'object') {
      throw new Error('Invalid arguments');
    }
    if (options.input) {
      if (typeof options.input === 'string') {
        inputText = options.input;
        return processInputText();
      }
      inputStream = options.input;
    } else if (options.inputFile) {
      inputStream = fs.createReadStream(options.inputFile);
    } else {
      throw new Error('Missing input');
    }

    inputStream.on('data', function (chunk) {
                 inputText += chunk;
               })
               .on('end', function () {
                 processInputText();
               })
               .on('error', function (error) {
                 reject(error);
               });
  });
};