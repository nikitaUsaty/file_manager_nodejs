import fs from 'fs'
import { writeFile, rename } from 'fs/promises'
import { exists } from './utils/getFileDirectory.js'

export async function basicOperations(input) {
  switch (input[0]) {
    case 'cat':
      await readFile(input[1])
      break
    case 'add':
      await create(input[1])
      break
    case 'rn':
      await renameFile(input[1], input[2])
      break
    case 'cp':
      await copyFile(input[1], input[2])
      break
    case 'mv':
      await moveFile(input[1], input[2])
      break
    case 'rm':
      removeFile(input[1])
      break
    default:
      console.error(`${input.join(' ')} is not a valid command!`)
      break
  }
}

async function readFile(path) {
  const readable = fs.createReadStream(path)

  readable.on('readable', () => {
    let chunk

    while (null !== (chunk = readable.read())) {
      process.stdout.write(chunk + '\n')
    }
  })
}

async function create(path) {
  try {
    await writeFile(path, '')
  } catch (err) {
    console.log(err)
  }
}

const renameFile = async (src, dest) => {
  try {
    await rename(src, dest, () => {
      console.info('\nFile Renamed!\n')
    })
  } catch (error) {
    console.log(error)
  }
}

const copyFile = async (src, dest) => {
  if (!(await exists(src)) || !(await exists(dest))) {
    throw new Error('Incorrect path')
  } else {
    const readable = fs.createReadStream(src, { encoding: 'utf8' })
    const writable = fs.createWriteStream(`${dest}/${src}`)
    readable.pipe(writable)
  }
}

const moveFile = async (src, dest) => {
  try {
    await copy(src, dest)
    setTimeout(async () => {
      await remove(src)
    }, 0)
  } catch (error) {
    console.log(error)
  }
}

const removeFile = async (path) => {
  try {
    fs.unlink(path, (err) => {})
  } catch (error) {
    console.log(error)
  }
}
