import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCalculator } from './hooks/useCalculator'
import { History } from './components/History'
import { Graph } from './components/Graph'
import { evaluate } from 'mathjs'

const buttons = [
  'Rad', 'Deg', 'x!', '(', ')', '%', 'AC',
  'Inv', 'sin', 'ln', '7', '8', '9', '÷',
  'π', 'cos', 'log', '4', '5', '6', '×',
  'e', 'tan', '√', '1', '2', '3', '-',
  'Ans', 'EXP', 'x^y', '0', '.', '=', '+',
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
    setAngleMode,
    toggleInverse,
    angleMode,
    inverse,
    theme,
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
      case '=': {
        const expr = expression
        evaluateExpression()
        if (expr.includes('x')) {
          try {
            const compiled = evaluate('f(x)=' + expr) as any
            setGraphFn(() => (x: number) => compiled(x))
          } catch {}
        }
        return
      }
      case 'AC':
        clear()
        break
      case '⌫':
        backspace()
        break
      case 'Rad':
        setAngleMode('rad')
        break
      case 'Deg':
        setAngleMode('deg')
        break
      case 'Inv':
        toggleInverse()
        break
      case '√':
        append('sqrt(')
        break
      case 'sin':
        append((inverse ? 'asin' : 'sin') + '(')
        break
      case 'cos':
        append((inverse ? 'acos' : 'cos') + '(')
        break
      case 'tan':
        append((inverse ? 'atan' : 'tan') + '(')
        break
      case 'ln':
        append(inverse ? 'exp(' : 'ln(')
        break
      case 'log':
        append(inverse ? '10^(' : 'log(')
        break
      case 'π':
        append('pi')
        break
      case 'e':
        append('e')
        break
      case 'x!':
        append('!')
        break
      case 'x^y':
        append('^')
        break
      case 'EXP':
        append('E')
        break
      case 'Ans':
        append('Ans')
        break
      case '÷':
        append('/')
        break
      case '×':
        append('*')
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

  const btns = buttons

  const isOperator = (val: string) =>
    !/^[0-9.]$/.test(val) && val !== '(' && val !== ')'

  const getClass = (val: string) => {
    let cls = ''
    if (isOperator(val)) cls += 'op '
    if (/^[a-zπe]/i.test(val)) cls += 'func '
    if (
      (val === 'Rad' && angleMode === 'rad') ||
      (val === 'Deg' && angleMode === 'deg') ||
      (val === 'Inv' && inverse)
    )
      cls += 'active'
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
      <div className="display">
        <div>{expression || '0'}</div>
        <div className="result">{result}</div>
      </div>
      <div className="keypad">
        {btns.map((b) => (
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
