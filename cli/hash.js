import fs from 'fs'
import path from 'path'
import { currentDirectory } from './nav.js'
import { createHash } from 'crypto'

export const calculateHash = async (input) => {
  const filePath = path.resolve(currentDirectory, input[1])

  try {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err)

        return
      }

      console.log(createHash('sha256').update(data).digest('hex'))
    })
  } catch (error) {
    console.log(error)
  }
}
