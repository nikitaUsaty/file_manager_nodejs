import fs from 'fs'
import { createHash } from 'crypto'

export const calculateHash = async (input) => {
  const path = input[1]
  try {
    fs.readFile(path, 'utf8', (err, data) => {
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
