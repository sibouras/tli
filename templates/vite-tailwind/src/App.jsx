import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen bg-gray-900 text-gray-200'>
      <header className='flex h-full flex-col items-center justify-center'>
        <h1 className='mb-3 text-3xl font-bold'>
          Hello Vite + React + tailwind!
        </h1>
        <button
          className='bg-red-300 px-2 text-black'
          onClick={() => setCount((count) => count + 1)}
        >
          count is: {count}
        </button>
      </header>
    </div>
  )
}
