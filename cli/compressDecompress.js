import fs from 'fs'
import zlib from 'zlib'
import { exists } from './utils/getFileDirectory.js'

//TODO: validation for inputs

const compressedData = zlib.createBrotliCompress()
const decompressedData = zlib.createBrotliDecompress()

export async function compressDecompress(input) {
  const src = input[1]
  const dest = input[2]
  const getFileExtansion = src.split('.')[0]

  if (!(await exists(src)) || !(await exists(dest))) {
    console.log('\x1b[31m%s\x1b[0m', 'No such file or directory')
  } else if (input[0] === 'compress') {
    compress()
  } else if (input[0] === 'decompress') {
    decompress()
  }

  function compress() {
    const readStream = fs.createReadStream(src, { encoding: 'utf8' })
    const writeStream = fs.createWriteStream(`${dest}/${getFileExtansion}.br`)
    const stream = readStream.pipe(compressedData).pipe(writeStream)
    stream.on('finish', () => {
      console.log('Compressing is done')
    })
  }

  async function decompress() {
    const readStream = fs.createReadStream(src)
    const writeStream = fs.createWriteStream(`${dest}/decompressed.txt`)
    const stream = readStream.pipe(decompressedData).pipe(writeStream)
    stream.on('finish', () => {
      console.log('Decompressing is done')
    })
  }
}
