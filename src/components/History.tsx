import { useStore } from '../store/useStore'

export function History() {
  const history = useStore((s) => s.history)
  return (
    <div className="history">
      {history.map((h, i) => (
        <div key={i}>
          <div>{h.expression}</div>
          <div>= {h.result}</div>
        </div>
      ))}
    </div>
  )
}
