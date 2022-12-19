import { stat } from 'fs/promises'
import path from 'path'
import * as url from 'url'

export const getFileDir = (metaUrl) => {
  return {
    __filename: url.fileURLToPath(metaUrl),

    __dirname: url.fileURLToPath(new URL('.', metaUrl)),
  }
}

export const exists = async (path) => !!(await stat(path).catch(() => false))

export async function checkPath(dest) {
  if (path.isAbsolute(dest) && (await exists(dest))) {
    return true
  } else if (!path.isAbsolute(dest) && (await exists(`${currentDirectory}/${dest}`))) {
    return true
  } else {
    console.log('\x1b[31m%s\x1b[0m', 'Operation failed\n')

    return
  }
}
