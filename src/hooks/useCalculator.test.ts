import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

describe('useCalculator', () => {
  const run = (expr: string) => {
    const { result } = renderHook(() => useCalculator())
    let value: string | undefined
    act(() => {
      result.current.setExpression(expr)
    })
    act(() => {
      value = result.current.evaluateExpression()
    })
    return value!
  }

  it('adds numbers', () => {
    expect(run('1+2')).toBe('3')
  })

  it('handles subtraction', () => {
    expect(run('5-2')).toBe('3')
  })

  it('multiplies', () => {
    expect(run('3*4')).toBe('12')
  })

  it('divides', () => {
    expect(run('8/2')).toBe('4')
  })

  it('parentheses', () => {
    expect(run('(2+3)*2')).toBe('10')
  })

  it('exponent', () => {
    expect(run('2^3')).toBe('8')
  })

  it('sqrt', () => {
    expect(run('sqrt(9)')).toBe('3')
  })

  it('sin', () => {
    expect(Number(run('sin(pi / 2)'))).toBeCloseTo(1)
  })

  it('log', () => {
    expect(run('log(100,10)')).toBe('2')
  })

  it('ln', () => {
    expect(Number(run('ln(e)'))).toBeCloseTo(1)
  })
})
