import os from 'os'
import fs from 'fs'
import path from 'path'
import { exists } from './utils/getFileDirectory.js'

export async function navigation(input) {
  switch (input[0]) {
    case 'up':
      goUp()
      break
    case 'cd':
      cd(input[1])
      break
    case 'ls':
      ls()
      break
    default:
      console.error(`${input.join(' ')} is not a valid command!`)
      break
  }
}

export let currentDirectory = os.homedir()

function goUp() {
  currentDirectory = path.join(currentDirectory, '..')
}

async function cd(dest) {
  if (await checkPath(dest)) {
    currentDirectory = path.resolve(currentDirectory, dest)
  }
}

async function checkPath(dest) {
  if (path.isAbsolute(dest) && (await exists(dest))) {
    return true
  } else if (!path.isAbsolute(dest) && (await exists(`${currentDirectory}/${dest}`))) {
    return true
  } else {
    console.log('\x1b[31m%s\x1b[0m', 'No such file or directory')
    return
  }
}

function ls() {
  fs.readdir(currentDirectory, { withFileTypes: true }, (err, files) => {
    let arr = []
    files.map((el) => {
      if (el.isFile()) {
        arr.push({ file: el.name, type: 'file' })
      } else if (el.isDirectory()) {
        arr.push({ file: el.name, type: 'directory' })
      } else {
        arr.push({ file: el.name, type: 'unknown' })
      }
    })
    arr = arr.sort((a, b) => a.type.localeCompare(b.type))
    console.table(arr)
  })
}
