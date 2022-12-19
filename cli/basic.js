import fs from 'fs'
import path from 'path'
import { writeFile, rename } from 'fs/promises'
import { checkPath } from './getFileDirectory.js'
import { currentDirectory } from './nav.js'

export async function basicOperations(input) {
  const src = input[1]
  const dest = input[2]

  switch (input[0]) {
    case 'cat':
      await readFile(src)
      break

    case 'add':
      await create(input[1])
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

async function readFile(filePath) {
  filePath = path.resolve(currentDirectory, filePath)

  if (await checkPath(filePath)) {
    const readable = fs.createReadStream(filePath)

    readable.on('readable', () => {
      let chunk
      while (null !== (chunk = readable.read())) {
        process.stdout.write(chunk + '\n')
      }
    })
  }
}

async function create(filePath) {
  filePath = path.resolve(currentDirectory, filePath)

  try {
    await writeFile(filePath, '')
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    console.log(err)
  }
}

const renameFile = async (src, dest) => {
  if (!path.isAbsolute(src)) {
    src = `${currentDirectory}/${src}`
    dest = `${currentDirectory}/${dest}`
  }

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
  if (!dest) {
    dest = currentDirectory
  }

  const splitted = src.split(path.sep)
  const fileName = splitted[splitted.length - 1]
  src = path.resolve(currentDirectory, src)
  dest = path.resolve(currentDirectory, dest)

  if (!(await checkPath(src)) || !(await checkPath(dest))) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
  } else {
    const readable = fs.createReadStream(src, { encoding: 'utf8' })
    const writable = fs.createWriteStream(`${dest}/${fileName}`)
    readable.pipe(writable)
  }
}

const move = async (src, dest) => {
  if (!src || !dest) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    return
  }

  src = path.resolve(currentDirectory, src)
  dest = path.resolve(currentDirectory, dest)

  try {
    await copy(src, dest)
    setTimeout(async () => {
      await remove(src)
    }, 500)
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    console.log(error)
  }
}
const remove = async (filePath) => {
  try {
    if (path.isAbsolute(filePath)) {
      fs.unlink(filePath, (err) => {})
    } else {
      fs.unlink(`${currentDirectory}/${filePath}`, (err) => {})
    }
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')
    console.log(error)
  }
}
