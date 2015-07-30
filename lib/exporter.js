var Canvas = require('canvas'),
    fs = require('fs'),
    nomnoml = require('nomnoml'),
    Q = require('q'),
    stream = require('stream');

module.exports = function (options) {
  return Q.Promise(function (resolve, reject) {
    var inputText = '',
        inputStream;

    if (!options) {
      options = {};
    }
    if (typeof options === 'string') {
      options = {input: options};
    }

    if (options.input) {
      if (typeof input === 'string') {
        inputStream = new stream.Readable();
        inputStream.push(options.input);
      } else {
        inputStream = options.input;
      }
    } else if (options.inputFile) {
      inputStream = fs.createReadStream(options.inputFile);
    } else {
      throw new Error('Missing input');
    }

    inputStream.setEncoding('utf8');
    inputStream
      .on('data', function (chunk) {
        inputText += chunk;
      })
      .on('end', function () {
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
            .on('end', function (error) {
              resolve();
            })
            .on('error', function (error) {
              reject(error);
            });
        } else {
          resolve(canvas.toBuffer());
        }
      })
      .on('error', function (error) {
        reject(error);
      });
  });
};