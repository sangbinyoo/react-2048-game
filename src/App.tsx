import { useState } from 'react'
import './App.css';
import { getNextTile } from './utils/getNextTile';
function App() {
  const [gameBoard, setGameBoard] = useState(getBoard())
  const [tile, setTile] = useState(getNextTile());
  const getNext = ()=>{
    setTile(getNextTile())
    console.log(tile)
  }
  return (
    <>
    <main>
      <header>
        <div>Play 2048</div>
        <button onClick={getNext}>click</button>
      </header>
      <section className="game-board">
        {gameBoard.map((row,r)=> 
          <div className="row-tile">
            {row.map((col,c)=>
            <div className="col-tile">
              {`${r}${c}`}
            </div>
            )}
          </div>)
        }
      </section>
    </main>

    </>
  )
}

export default App

function getBoard():number[][]{
  const zeroArr:number[] = [0,0,0,0];
  return zeroArr.map(p=> [...zeroArr])
}