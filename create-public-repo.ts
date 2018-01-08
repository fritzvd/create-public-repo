#!/usr/bin/env node

import * as yargs from 'yargs'
import { spawn } from 'child_process'
import * as MESSAGES from './messages'

const argv = yargs
  .alias('o', 'origin')
  .alias('d', 'destination')
  .alias('e', 'exclude')
  .demandOption(['o', 'd', 'e'])
  .argv

const folderOrigin = argv.origin.split('/')[argv.origin.split('/').length - 1]
console.log(MESSAGES.copyingTo(argv.destination))
const rsync = spawn(
  'rsync', 
    [
      '--progress',
      '-a',
      `--exclude-from=${argv.exclude}`,
      `${argv.origin}`,
      './temp-copy-repo'
  ]
)
rsync.on('error', (err) => {
  console.log(err)
})
rsync.stdout.on('data', (data) => {
  console.log(data.toString())
})

rsync.stderr.on('data', (data) => {
  console.log(`rsync stderr: ${data}`)
})

let mv
rsync.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`)
  }
  console.log('moving files to right folder name')
  mv = spawn('mv', [`./temp-copy-repo/${folderOrigin}`, `${argv.destination}`])

  mv.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  mv.stderr.on('data', (data) => {
    console.log(`mv stderr: ${data}`)
  })

  mv.on('close', (code) => {
    console.log('removing temporary files')
    const rm = spawn('rm', ['-rf', './temp-copy-repo'])
    rm.stdout.on('data', (data) => {
      console.log(data.toString())
    })
  
    rm.stderr.on('data', (data) => {
      console.log(`rm stderr: ${data}`)
    })
  })
})