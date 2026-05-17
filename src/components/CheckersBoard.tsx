import { useState } from 'react'

interface Piece {
  id: number
  row: number
  col: number
  color: 'red' | 'black'
  isKing: boolean
}

function initBoard(): Piece[] {
  const pieces: Piece[] = []
  let id = 0
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        pieces.push({ id: id++, row, col, color: 'black', isKing: false })
      }
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        pieces.push({ id: id++, row, col, color: 'red', isKing: false })
      }
    }
  }
  return pieces
}

export default function CheckersBoard({ size = 280 }: { size?: number }) {
  const [pieces] = useState<Piece[]>(initBoard)
  const [selected, setSelected] = useState<number | null>(null)

  const cellSize = size / 8

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-white/20"
      style={{ width: size, height: size }}
    >
      {/* Board cells */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className={`absolute ${(row + col) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'}`}
            style={{
              left: col * cellSize,
              top: row * cellSize,
              width: cellSize,
              height: cellSize,
            }}
          />
        ))
      )}

      {/* Pieces */}
      {pieces.map(piece => (
        <div
          key={piece.id}
          className={`absolute flex items-center justify-center cursor-pointer transition-transform ${
            selected === piece.id ? 'scale-110 z-10' : 'z-0'
          }`}
          style={{
            left: piece.col * cellSize,
            top: piece.row * cellSize,
            width: cellSize,
            height: cellSize,
          }}
          onClick={() => setSelected(selected === piece.id ? null : piece.id)}
        >
          <div
            className={`checker-piece flex items-center justify-center ${
              piece.color === 'red'
                ? 'bg-gradient-to-br from-red-400 to-red-700'
                : 'bg-gradient-to-br from-slate-600 to-slate-900'
            } ${selected === piece.id ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}`}
            style={{ width: cellSize * 0.78, height: cellSize * 0.78 }}
          >
            {piece.isKing && <span className="text-yellow-300 text-xs">♛</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
