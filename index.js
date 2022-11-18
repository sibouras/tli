import fuzzy from 'fuzzy'
import inquirer from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import { readdirSync } from 'node:fs'
import { dirname } from 'node:path'
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
  console.log(answers)
})
