import fs from 'fs'
import zlib from 'zlib'
import { exists } from './utils/getFileDirectory.js'

const compressedData = zlib.createBrotliCompress()
const decompressedData = zlib.createBrotliDecompress()

export async function compressDecompress(input) {
  const src = input[1]
  const dest = input[2]

  if (!(await exists(src)) || !(await exists(dest))) {
    throw new Error('Incorrect path')
  } else if (input[0] === 'compress') {
    compress(src, dest)
  } else if (input[0] === 'decompress') {
    decompress(src, dest)
  }

  function compress(dest) {
    const getFileExtansion = src.split('.')
    const readStream = fs.createReadStream(src, { encoding: 'utf8' })
    const writeStream = fs.createWriteStream(`${dest}/${getFileExtansion[0]}.gz`)
    const stream = readStream.pipe(compressedData).pipe(writeStream)
    stream.on('finish', () => {
      console.log('Done compressing 😎')
    })
  }

  function decompress(dest) {
    const getFileExtansion = src.split('.')
    const readStream = fs.createReadStream(src, { encoding: 'utf8' })
    const writeStream = fs.createWriteStream(`${dest}/${getFileExtansion[0]}.txt`)
    const stream = readStream.pipe(decompressedData).pipe(writeStream)

    stream.on('finish', () => {
      console.log('Done decompressing 😎')
    })
  }
}
