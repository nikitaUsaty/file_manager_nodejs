#!/usr/bin/env node
import os from 'os'
import path from 'path'
import readline from 'readline'

import { parseArgs } from './parseArgs.js'
import { getFileDir } from './utils/getFileDirectory.js'
import { showOSInfo } from './os.js'
import { calculateHash } from './hash.js'
import { basicOperations } from './basic.js'
import { compressDecompress } from './compressDecompress.js'
import { navigation, currentDirectory } from './nav.js'

const rl = readline.createInterface(process.stdin, process.stdout)
const args = process.argv.slice(2)
const initArgs = args.join().split('=')
const username = initArgs[1]
const welcomeMsg = `Welcome to the File Manager, ${username}! \n`
const goodbyeMsg = `Thank you for using File Manager, ${username}, goodbye!`
const { __dirname, __filename } = getFileDir(import.meta.url)

rl.write(welcomeMsg)

rl.write(__dirname)

rl.on('line', (input) => {
  const parsedInput = parseArgs(input)
  if (input === '.exit') {
    exitProcess()
  }

  switch (parsedInput[0]) {
    case 'os':
      rl.write(showOSInfo(parsedInput[1]))
      break
    case 'hash':
      rl.write(calculateHash(parsedInput[1]))
      break
    case 'basic':
      basicOperations(parsedInput[1])
      break
    case 'compress':
      compressDecompress(parsedInput[1])
      break
    case 'navigation':
      navigation(parsedInput[1])
      break
    default:
      break
  }
  console.log(`\nYou're currently in ${currentDirectory}\n`)
})

rl.on('SIGINT', function () {
  exitProcess()
})

function exitProcess() {
  rl.write(goodbyeMsg)
  process.exit()
}
