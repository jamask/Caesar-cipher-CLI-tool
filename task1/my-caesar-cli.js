const { pipeline } = require('stream');
const fs = require('fs');
const through2 = require('through2');
var argv = require('minimist')(process.argv.slice(2));

// a shift
const shift = argv['s'] || argv['shift'];
if (!shift) {
  process.stderr.write('Shift option is required (use -s flag)\n');
  process.exit(1);
}

// an action encode/decode
const action = argv['a'] || argv['action'];
if (!action) {
  process.stderr.write('Action option is required (use -a flag)\n');
  process.exit(1);
}

// an input file
const inputFile = argv['i'] || argv['input'];

// an output file
const outputFile = argv['o'] || argv['output'];

const caesarCipher = through2((data, enc, cb) => {
  let str = data.toString();
  let decipher = '';

  if (action === 'encode') {
    for(let i = 0; i < str.length; i++){
      // Get letter code
      const code = str.charCodeAt(i);
      
      // Uppercase letters
      if ((code >= 65) && (code <= 90)) {
        decipher += String.fromCharCode((code + +shift - 65) % 26 + 65);
      } // Lowercase letters
      else if ((code >= 97) && (code <= 122)) {
        decipher += String.fromCharCode((code + +shift - 97) % 26 + 97);
      }
    }
  } else {
    for(let i = 0; i < str.length; i++){
      // Get letter code
      const code = str.charCodeAt(i);
      
      // Uppercase letters
      if ((code >= 65) && (code <= 90)) {
        decipher += String.fromCharCode((code - +shift - 65) % 26 + 65);
      } // Lowercase letters
      else if ((code >= 97) && (code <= 122)) {
        decipher += String.fromCharCode((code - +shift - 97) % 26 + 97);
      }
    }
  }

  cb(null, Buffer.from(decipher));
});

if (inputFile) {
  fs.access(inputFile, fs.F_OK, (err) => {
    if (err) {
      process.stderr.write('can\'t access input file\n', err);
      return;
    }

    if (outputFile) {
      fs.access(outputFile, fs.F_OK, (err) => {
        if (err) {
          process.stderr.write('can\'t access output file\n', err);
          return;
        }

        pipeline(
          fs.createReadStream(inputFile),
          caesarCipher,
          fs.createWriteStream(outputFile, { flags: 'a' }),
          (err) => {
            if (err) {
              process.stderr.write('Failed.\n', err);
            } else {
              console.log('Succeeded.\n');
            }
          }
        );
      })

    } else {

      pipeline(
        fs.createReadStream(inputFile),
        caesarCipher,
        process.stdout,
        (err) => {
          if (err) {
            process.stderr.write('Failed.\n', err);
          }
        }
      );
    }
  })
} else {
  if (outputFile) {
    fs.access(outputFile, fs.F_OK, (err) => {
      if (err) {
        process.stderr.write('can\'t access output file\n', err);
        return;
      }

      pipeline(
        process.stdin,
        caesarCipher,
        fs.createWriteStream(outputFile, { flags: 'a' }),
        (err) => {
          if (err) {
            process.stderr.write('Failed.\n', err);
          }
        }
      );
    })
  } else {
    pipeline(
      process.stdin,
      caesarCipher,
      process.stdout,
      (err) => {
        if (err) {
          process.stderr.write('Failed.\n', err);
        }
      }
    );
  }
}
