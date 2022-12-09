import { stat } from 'fs/promises'
import * as url from 'url'

export const getFileDir = (metaUrl) => {
  return {
    filename: url.fileURLToPath(metaUrl),
    dirname: url.fileURLToPath(new URL('.', metaUrl)),
  }
}

export const exists = async (path) => !!(await stat(path).catch(() => false))
