import { useStore } from '../store/useStore'

export function useCalculator() {
  const {
    tokens,
    result,
    append,
    clear,
    backspace,
    evaluateExpr,
    undo,
    redo,
    toggleTheme,
    toggleScientific,
    scientific,
    theme,
    history,
    setTokens,
  } = useStore()

  const expression = tokens.join('')

  return {
    expression,
    result,
    append,
    clear,
    backspace,
    evaluateExpression: evaluateExpr,
    undo,
    redo,
    toggleTheme,
    toggleScientific,
    scientific,
    theme,
    history,
    setTokens,
  }
}
