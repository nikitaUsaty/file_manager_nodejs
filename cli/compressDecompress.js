import fs from 'fs'
import zlib from 'zlib'
import { exists } from './getFileDirectory.js'
import path from 'path'
import { currentDirectory } from './nav.js'

export async function compressDecompress(input) {
  const src = path.resolve(currentDirectory, input[1])
  const dest = path.resolve(currentDirectory, input[2])

  const splitted = src.split(path.sep)
  const fileName = splitted[splitted.length - 1].split('.')

  if (!(await exists(src)) || !(await exists(dest))) {
    console.log('\x1b[31m%s\x1b[0m', 'No such file or directory')
  } else if (input[0] === 'compress') {
    compress()
  } else if (input[0] === 'decompress') {
    decompress()
  }

  function compress() {
    const readable = fs.createReadStream(src)
    const writableGz = fs.createWriteStream(`${dest}/${fileName[0]}.${fileName[1]}.br`)
    const gZip = zlib.createBrotliCompress()

    readable
      .pipe(gZip)
      .pipe(writableGz)
      .on('finish', function () {
        console.log('Done compressing 😈')
      })
  }

  function decompress() {
    const readable = fs.createReadStream(src)
    const writableGz = fs.createWriteStream(`${dest}/${fileName[0]}.${fileName[1]}`)
    const gUnZip = zlib.createBrotliDecompress()

    readable
      .pipe(gUnZip)
      .pipe(writableGz)
      .on('finish', function () {
        console.log('Done decompressing 👻')
      })
  }
}
