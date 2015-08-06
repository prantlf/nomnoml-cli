var Canvas = require('canvas'),
    fs = require('fs'),
    nomnoml = require('nomnoml'),
    Q = require('q');

module.exports = function (options) {
  return Q.Promise(function (resolve, reject) {
    var inputText = '',
        inputStream;

    function processInputText() {
      var width = options.width || 640,
          height = options.height || 480,
          canvas = new Canvas(width, height),
          pngStream, outputStream;

      nomnoml.draw(canvas, inputText);

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

        pngStream
          .pipe(outputStream)
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

    inputStream
      .on('data', function (chunk) {
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