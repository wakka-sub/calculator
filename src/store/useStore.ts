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
  scientific: boolean
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
  toggleScientific: () => void
  undo: () => void
  redo: () => void
}

export const useStore = create<State & Actions>((set, get) => ({
  tokens: [],
  result: '',
  history: [],
  theme: 'dark',
  scientific: false,
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
    const expr = get().tokens.join('')
      .replace(/ln\(/g, 'log(')
      .replace(/ in /g, ' to ')
    try {
      const value = String(evaluate(expr))
      set((state) => ({
        result: value,
        history: [...state.history, { expression: expr, result: value }],
        undoStack: [...state.undoStack, state.tokens],
        redoStack: [],
      }))
    } catch {
      set({ result: 'Error' })
    }
  },
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  toggleScientific: () => set((s) => ({ scientific: !s.scientific })),
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
