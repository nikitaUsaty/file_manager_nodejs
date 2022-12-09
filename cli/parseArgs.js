const commandsList = {
  navigation: ['up', 'cd', 'ls'],
  os: ['os'],
  hash: ['hash'],
  compress: ['compress', 'decompress'],
  basic: ['cat', 'add', 'rn', 'cp', 'mv', 'rm'],
}

export function parseArgs(args) {
  const splitedArgs = args.split(' ')
  const parsed = Object.entries(commandsList).filter((el) => el[1].includes(splitedArgs[0]))
  const commandName = parsed.flat()[0]
  return [commandName, splitedArgs]
}
