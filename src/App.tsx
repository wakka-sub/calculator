import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCalculator } from './hooks/useCalculator'

const buttons = [
  '7','8','9','/','(',
  '4','5','6','*',')',
  '1','2','3','-','^',
  '0','.','=','+','√',
  'sin','cos','tan','asin','acos',
  'atan','log','ln','C','⌫'
]

function App() {
  const {
    expression,
    result,
    append,
    clear,
    backspace,
    evaluateExpression,
  } = useCalculator()

  const [theme, setTheme] = useState<'dark'|'light'>('dark')

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light' : ''
  }, [theme])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key === 'Enter') return evaluateExpression()
      if (key === 'Backspace') return backspace()
      if (key === 'Escape') return clear()
      append(key)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [append, evaluateExpression, backspace, clear])

  const handleClick = (val: string) => {
    switch (val) {
      case '=':
        evaluateExpression()
        break
      case 'C':
        clear()
        break
      case '⌫':
        backspace()
        break
      case '√':
        append('sqrt(')
        break
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
      case 'log':
      case 'ln':
        append(val + '(')
        break
      default:
        append(val)
    }
  }

  useEffect(() => {
    if (result === 'Error') {
      toast.error('Invalid Expression')
    }
  }, [result])

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <div className="display">
        <div>{expression}</div>
        <div>= {result}</div>
      </div>
      <div className="keypad">
        {buttons.map(b => (
          <button key={b} onClick={() => handleClick(b)}>{b}</button>
        ))}
      </div>
      <ToastContainer position="top-center" />
    </div>
  )
}

export default App
