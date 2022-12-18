import os from 'os'

export function showOSInfo(input) {
  switch (input[1]) {
    case '--EOL':
      getEOL()
      break
    case '--cpus':
      getCPU()
      break
    case '--homedir':
      getHomeDir()
      break
    case '--username':
      getUsername()
      break
    case '--architecture':
      getArchitecture()
      break
    default:
      console.error(`${input[2]} is not a valid command!`)
      break
  }
}

function getEOL() {
  return console.log(JSON.stringify(os.EOL))
}

function getCPU() {
  console.log(`\nOverall amount of CPUs: ${os.cpus().length}`)
  return console.table(os.cpus())
}

function getHomeDir() {
  return console.log(os.homedir())
}

function getUsername() {
  return console.log(os.userInfo().username)
}

function getArchitecture() {
  return console.log(os.arch())
}
