import { create } from 'zustand'
import { evaluate } from 'mathjs'

export type Token = string

interface HistoryItem {
  expression: string
  result: string
}

interface State {
  tokens: Token[]
  result: string
  history: HistoryItem[]
  theme: 'light' | 'dark'
  angleMode: 'rad' | 'deg'
  inverse: boolean
  lastAns: string
  undoStack: Token[][]
  redoStack: Token[][]
}

interface Actions {
  setTokens: (tokens: Token[]) => void
  append: (token: Token) => void
  clear: () => void
  backspace: () => void
  evaluateExpr: () => void
  toggleTheme: () => void
  setAngleMode: (m: 'rad' | 'deg') => void
  toggleInverse: () => void
  undo: () => void
  redo: () => void
}

export const useStore = create<State & Actions>((set, get) => ({
  tokens: [],
  result: '',
  history: [],
  theme: 'dark',
  angleMode: 'rad',
  inverse: false,
  lastAns: '0',
  undoStack: [],
  setTokens: (tokens) => set({ tokens }),
  redoStack: [],
  append: (token) =>
    set((state) => ({
      tokens: [...state.tokens, token],
      undoStack: [...state.undoStack, state.tokens],
      redoStack: [],
    })),
  clear: () =>
    set((state) => ({
      tokens: [],
      result: '',
      undoStack: [...state.undoStack, state.tokens],
      redoStack: [],
    })),
  backspace: () =>
    set((state) => ({
      tokens: state.tokens.slice(0, -1),
      undoStack: [...state.undoStack, state.tokens],
      redoStack: [],
    })),
  evaluateExpr: () => {
    const { tokens, angleMode, lastAns } = get()
    const open = tokens.filter((t) => t === '(').length
    const close = tokens.filter((t) => t === ')').length
    const patchedTokens = close < open ? [...tokens, ...Array(open - close).fill(')')] : tokens
    let expr = patchedTokens
      .join('')
      .replace(/Ans/g, lastAns)
      .replace(/ln\(/g, 'log(')
      .replace(/%/g, '/100')
    const scope = angleMode === 'deg'
      ? {
          sin: (x: number) => Math.sin((x * Math.PI) / 180),
          cos: (x: number) => Math.cos((x * Math.PI) / 180),
          tan: (x: number) => Math.tan((x * Math.PI) / 180),
          asin: (x: number) => (Math.asin(x) * 180) / Math.PI,
          acos: (x: number) => (Math.acos(x) * 180) / Math.PI,
          atan: (x: number) => (Math.atan(x) * 180) / Math.PI,
        }
      : {}
    try {
      const value = String(evaluate(expr, scope))
      set((state) => ({
        result: value,
        lastAns: value,
        history: [...state.history, { expression: expr, result: value }],
        tokens: [value],
        undoStack: [...state.undoStack, state.tokens],
        redoStack: [],
      }))
    } catch {
      set({ result: 'Error' })
    }
  },
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setAngleMode: (m) => set({ angleMode: m }),
  toggleInverse: () => set((s) => ({ inverse: !s.inverse })),
  undo: () =>
    set((state) => {
      const prev = state.undoStack.pop()
      if (!prev) return state
      return {
        tokens: prev,
        redoStack: [...state.redoStack, state.tokens],
        undoStack: state.undoStack,
      }
    }),
  redo: () =>
    set((state) => {
      const next = state.redoStack.pop()
      if (!next) return state
      return {
        tokens: next,
        undoStack: [...state.undoStack, state.tokens],
        redoStack: state.redoStack,
      }
    }),
}))
