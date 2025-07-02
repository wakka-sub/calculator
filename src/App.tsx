import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCalculator } from './hooks/useCalculator'
import { History } from './components/History'
import { Graph } from './components/Graph'
import { evaluate } from 'mathjs'

const basicButtons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
  '(', ')', '^', '√',
  'C', '⌫',
]

const scientificButtons = [
  'sin', 'cos', 'tan', 'log',
  'asin', 'acos', 'atan', 'ln',
  '(', ')', '^', '√',
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
  'C', '⌫',
]

function App() {
  const {
    expression,
    result,
    append,
    clear,
    backspace,
    evaluateExpression,
    toggleTheme,
    theme,
    scientific,
    toggleScientific
  } = useCalculator()
  const [showHistory, setShowHistory] = useState(false)
  const [graphFn, setGraphFn] = useState<((x:number)=>number)|null>(null)

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
        if(expression.includes('x')) {
          try {
            const compiled = evaluate('f(x)=' + expression.replace('=', '')) as any
            setGraphFn(() => (x:number)=>compiled(x))
          } catch {}
        }
        return
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

  const buttons = scientific ? scientificButtons : basicButtons

  const isOperator = (val: string) =>
    !/^[0-9.]$/.test(val) && val !== '(' && val !== ')'

  const getClass = (val: string) => {
    let cls = ''
    if (isOperator(val)) cls += 'op '
    if (/^[a-z]/i.test(val)) cls += 'func'
    return cls.trim()
  }

  return (
    <div className="calculator">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <button className="theme-toggle" onClick={() => setShowHistory(!showHistory)}>
        📜
      </button>
      <button className="theme-toggle" onClick={toggleScientific}>
        {scientific ? '123' : 'ƒ'}
      </button>
      <div className="display">
        <div>{expression || '0'}</div>
        <div className="result">{result}</div>
      </div>
      <div className={`keypad ${scientific ? 'scientific' : ''}`}>
        {buttons.map((b) => (
          <button key={b} className={getClass(b)} onClick={() => handleClick(b)}>
            {b}
          </button>
        ))}
      </div>
      {showHistory && <History />}
      {graphFn && <Graph fn={graphFn} onClose={() => setGraphFn(null)} />}
      <ToastContainer position="top-center" />
    </div>
  )
}

export default App
