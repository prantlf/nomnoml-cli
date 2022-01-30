const { createCanvas } = require('canvas');
const { readFileSync, createWriteStream, createReadStream } = require('fs');
const { draw } = require('nomnoml');
const { isAbsolute, join, resolve, normalize, dirname } = require('path');
const { PassThrough } = require('stream');

const mimeTypes = {
  png: 'image/png',
  svg: 'image/svg+xml'
};

// Expands file import directives recursively. A single file can be imported
// only once. It will be replaced by an empty string, if imported once more.
function preprocessInputText(inputText, currentDirectory) {
  const processDirectory = process.cwd();
  const importedFilePaths = [];

  // If the file name is an absolute path, returns it normailzed. If it is
  // a relative path starting with "./" or "../", appends it to the path
  // of the parent file, which the specified file is being expanded to.
  // Otherwise the relative path is  appended to the current directory.
  function completeFilePath(fileName, currentDirectory) {
    let directory;
    if (!isAbsolute(fileName)) {
      fileName = fileName.replace(/\\/g, '/');
      if (fileName.indexOf('./') === 0 ||
          fileName.indexOf('../') === 0) {
        directory = currentDirectory;
      } else {
        directory = processDirectory;
      }
      fileName = join(directory, fileName);
    }
    return resolve(normalize(fileName));
  }

  function expandFileImports(inputText, currentDirectory) {
    return inputText.replace(/#import: *(.*)/g, (all, fileName) => {
      fileName = completeFilePath(fileName, currentDirectory);
      if (importedFilePaths.indexOf(fileName) >= 0) {
        return '';
      }
      importedFilePaths.push(fileName);
      return expandFileImports(
          readFileSync(fileName, { encoding: 'utf8' }),
          dirname(fileName));
    });
  }

  return expandFileImports(inputText, currentDirectory || processDirectory);
}

module.exports = function (options) {
  return new Promise((resolve, reject) => {
    let inputText = '';
    let inputStream, input;

    function processInputText() {
      let {
        width = 640,
        height = 480,
        format = 'png',
        inputFile,
        output,
        resultType
      } = options;
      format = format.toLowerCase();

      const canvas = createCanvas(width, height, format === 'svg' ? 'svg' : undefined);
      draw(canvas, preprocessInputText(
          inputText, inputFile && dirname(inputFile)));

      const buffer = canvas.toBuffer(mimeTypes[format]);
      if (output) {
        let outputStream;
        if (typeof output === 'string') {
          outputStream = createWriteStream(output);
        } else {
          outputStream = new PassThrough();
          outputStream.pipe(output);
        }
        outputStream
          .on('finish', () => resolve())
          .on('error', error => reject(error))
          .end(buffer);
      } else {
        if (resultType === 'stream') {
          const bufferStream = new PassThrough();
          bufferStream.end(buffer);
          resolve(bufferStream);
        }
        else {
          resolve(buffer);
        }
      }
    }

    if (!options) {
      throw new Error('Missing arguments');
    }
    if (typeof options === 'string') {
      options = { input: options };
    } else if (typeof options !== 'object') {
      throw new Error('Invalid arguments');
    }
    input = options.input;
    if (input) {
      if (typeof input === 'string') {
        inputText = input;
        return processInputText();
      }
      inputStream = input;
    } else if (options.inputFile) {
      inputStream = createReadStream(options.inputFile);
    } else {
      throw new Error('Missing input');
    }

    inputStream
      .on('data', chunk => inputText += chunk)
      .on('end', () => processInputText())
      .on('error', error => reject(error));
  });
};
