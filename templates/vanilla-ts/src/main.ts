// import './style.css'
export {}

const btn = document.querySelector<HTMLButtonElement>('#counter')!
let counter = 0

function setCounter(count: number) {
  counter = count
  btn.innerHTML = `count is ${counter}`
}

btn.addEventListener('click', () => {
  setCounter(counter + 1)
})
