import { useState, useCallback } from 'react'
import { evaluate } from 'mathjs'

export function useCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')

  const append = useCallback((value: string) => {
    setExpression((prev) => prev + value)
  }, [])

  const clear = useCallback(() => {
    setExpression('')
    setResult('')
  }, [])

  const backspace = useCallback(() => {
    setExpression((prev) => prev.slice(0, -1))
  }, [])

  const evaluateExpression = useCallback(() => {
    try {
      const expr = expression.replace(/ln\(/g, 'log(')
      const evalResult = evaluate(expr)
      const value = String(evalResult)
      setResult(value)
      return value
    } catch {
      setResult('Error')
      return 'Error'
    }
  }, [expression])

  return {
    expression,
    result,
    append,
    clear,
    backspace,
    evaluateExpression,
    setExpression,
  }
}
