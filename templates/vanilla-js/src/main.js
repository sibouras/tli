const btn = document.querySelector('#counter')
let counter = 0

function setCounter(count) {
  counter = count
  btn.innerHTML = `count is ${counter}`
}

btn.addEventListener('click', () => {
  setCounter(counter + 1)
})
