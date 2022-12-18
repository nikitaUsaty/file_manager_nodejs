import fs from 'fs'
import path from 'path'
import { writeFile, rename } from 'fs/promises'
import { exists } from './utils/getFileDirectory.js'
import { currentDirectory } from './nav.js'

export async function basicOperations(input) {
  const src = checkPath(input[1])
  const dest = input[2]
  switch (input[0]) {
    case 'cat':
      await readFile(src)
      break
    case 'add':
      await create(src)
      break
    case 'rn':
      await renameFile(src, dest)
      break
    case 'cp':
      await copy(src, dest)
      break
    case 'mv':
      await move(src, dest)
      break
    case 'rm':
      remove(src)
      break
    default:
      console.error(`${input.join(' ')} is not a valid command!\n`)
      break
  }
}

async function checkPath(filePath) {
  if (path.isAbsolute(filePath) && (await exists(filePath))) {
    return filePath
  } else if (!path.isAbsolute(filePath) && (await exists(`${currentDirectory}/${filePath}`))) {
    return `${currentDirectory}/${filePath}`
  } else {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    return
  }
}

async function readFile(path) {
  if (await exists(path)) {
    const readable = fs.createReadStream(path)
    readable.on('readable', () => {
      let chunk
      while (null !== (chunk = readable.read())) {
        process.stdout.write(chunk + '\n')
      }
    })
  }
}
async function create(path) {
  try {
    await writeFile(path, '')
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    console.log(err)
  }
}

const renameFile = async (src, dest) => {
  try {
    await rename(src, dest, () => {
      console.info('\nFile Renamed!\n')
    })
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    console.log(error)
  }
}

const copy = async (src, dest) => {
  if (!(await exists(src)) || !(await exists(dest))) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
  } else {
    const readable = fs.createReadStream(src, { encoding: 'utf8' })
    const writable = fs.createWriteStream(`${dest}/${src}`)
    readable.pipe(writable)
  }
}

const move = async (src, dest) => {
  try {
    await copy(src, dest)
    setTimeout(async () => {
      await remove(src)
    }, 0)
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    console.log(error)
  }
}

const remove = async (path) => {
  try {
    fs.unlink(path, (err) => {})
  } catch (error) {
    console.log(error)
  }
}
