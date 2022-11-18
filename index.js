import fuzzy from 'fuzzy'
import inquirer from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const choices = readdirSync(`${__dirname}/templates`)
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

inquirer.prompt(questions).then((answers) => {
  const projectChoice = answers['project-choice']
  const projectName = answers['project-name']
  const templatePath = join(__dirname, 'templates', projectChoice)
  const newProjectPath = join(currDir, projectName)

  try {
    mkdirSync(newProjectPath)
    createDirectoryContents(templatePath, newProjectPath)
  } catch (err) {
    console.log(err.message)
  }
})

function createDirectoryContents(src, dest) {
  const filesToCreate = readdirSync(src)

  for (const fileOrDir of filesToCreate) {
    const origPath = join(src, fileOrDir)
    const newPath = join(dest, fileOrDir)
    const stats = statSync(origPath)

    if (stats.isFile()) {
      const contents = readFileSync(origPath, 'utf8')
      writeFileSync(newPath, contents)
    } else if (stats.isDirectory()) {
      try {
        mkdirSync(newPath)
        // recusrive call
        createDirectoryContents(origPath, newPath)
      } catch (err) {
        console.log(err.message)
      }
    }
  }
}
