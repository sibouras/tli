#!/usr/bin/env node

import fuzzy from 'fuzzy'
import inquirer from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const choices = await readdir(`${__dirname}/templates`)
const currDir = process.cwd()

inquirer.registerPrompt('autocomplete', inquirerPrompt)

const questions = [
  {
    type: 'autocomplete',
    name: 'project-choice',
    message: 'What project template would you like to generate?',
    source: (_answers, input = '') =>
      fuzzy.filter(input, choices).map((el) => el.original),
  },
  {
    type: 'input',
    name: 'project-name',
    message: 'Project name:',
    validate: (input) => {
      if (/^([A-Za-z-_\d])+$/.test(input)) return true
      else
        return 'Project name may only include letters, numbers, underscores and hashes.'
    },
  },
]

const answers = await inquirer.prompt(questions)
const projectChoice = answers['project-choice']
const projectName = answers['project-name']
const templatePath = join(__dirname, 'templates', projectChoice)
const newProjectPath = join(currDir, projectName)

try {
  await mkdir(newProjectPath)
  createDirectoryContents(templatePath, newProjectPath)
} catch (err) {
  console.log(err.message)
}

async function createDirectoryContents(src, dest) {
  const filesToCreate = await readdir(src)

  for (const fileOrDir of filesToCreate) {
    const origPath = join(src, fileOrDir)
    const newPath = join(dest, fileOrDir)
    const stats = await stat(origPath)

    if (stats.isFile()) {
      const contents = await readFile(origPath, 'utf8')
      await writeFile(newPath, contents)
    } else if (stats.isDirectory()) {
      try {
        await mkdir(newPath)
        // recusrive call
        createDirectoryContents(origPath, newPath)
      } catch (err) {
        console.log(err.message)
      }
    }
  }
}
