import React, { useCallback, useEffect, useReducer, useState } from 'react'
import './App.css';
import { getNextTile, Tile } from './utils/getNextTile';

const initialState:GameState = { gameBoard:[], score:0, key:'', isGameOver:false, isWin:false}

function App() {
  
  const [gameState, setGameState] = useReducer(manageGame, initialState);
  //방향키 입력 이벤트를 바인딩
  useEffect(()=>{
    window.addEventListener('keydown', keyboardListener as any);
    //cleanup
    return ()=>{
      window.removeEventListener('keydown', keyboardListener as any);
    }
  },[gameState])


  // 방향키 이벤트를 감지하는 로직
  const keyboardListener = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    //방향키 외의 키는 무시
    const allowedKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    e.preventDefault();
    if (!allowedKeys.includes(e.key)) return;
    if(!gameState.isGameOver || !gameState.isWin){
      setGameState({type: 'MOVE_TILE', key:e.key});
    }
    if(gameState.isGameOver || gameState.isWin){
      window.removeEventListener('keydown', keyboardListener as any);

    }

  }, [gameState]);

  const gameStart = () => {
    setGameState({type: 'START', key:''})
  }

  return (
    <>
    <main>
      <header>
        <div>Play 2048</div>
        <button onClick={gameStart}>{gameState.isGameOver ? 'Game Restart' : 'Game Start'}</button>
        <div>Score : {gameState.score}</div>
      </header>
      <section className="game-board">
        {gameState.gameBoard.map((_,y)=> 
          <div key={y} className="row-tile">
            {_.map((__,x)=>
              <div className={`tile tile-${__}`} key={x}>
                  {__ !== 0 ? __ : ''}
              </div>
            )}
          </div>)
        }
        {
          gameState.isGameOver &&(
          <div>
            {gameState.isWin ? 'You win !' : 'Game Over !' }
          </div>)
        }
        <div></div>
      </section>
    </main>

    </>
  )
}

export default App

function getBoard(){
  let board:number[][] = []
  for (let y = 0; y < 4; y++) {
    board[y]= new Array(4);
    for (let x = 0; x < 4; x++) {
      board[y][x] = 0;
    }
  }
  return board;
}
export function manageGame(state:GameState, action:{type:string, key:string}):GameState{
  let board:number[][] = [];
  let score:number = 0;
  let isGameOver:boolean = false;
  let isWin:boolean = false;
  switch(action.type){
    case 'START':
      board = getBoard();
      score = 0;
      //다음랜덤숫자 보드에 추가
      let newTile = getNextTile(board)!;
      board[newTile.y][newTile.x] =  newTile.value;
      isGameOver = false;
      break;
    case 'MOVE_TILE':
      board = new Array(...state.gameBoard.map(y=>[...y]));
      switch(action.key){
        //x가 고정
        case 'ArrowUp':
          for(let x=0; x<4; x++){
            for(let y=0; y<4; y++){
              let currentValue = board[y][x];
              let count = y;
              while(count>0){
                if(currentValue == board[count-1][x]){
                  board[count-1][x] *= 2;
                  board[count][x] = 0;
                  score += board[count-1][x];
                  count--;
                }else if(board[count-1][x] == 0){
                  board[count-1][x] = currentValue;
                  board[count][x] = 0;
                  count--;
                }else{
                  break;
                }
              }
            }
          }
          break;
        case 'ArrowDown':
          for(let x=0; x<4; x++){
            for(let y=3; y>=0; y--){
              let currentValue = board[y][x];
              let count = y;
              while(count<3){
                if(currentValue == board[count+1][x]){
                  board[count+1][x] *= 2;
                  board[count][x] = 0;
                  score += board[count+1][x];
                  count++;
                }else if(board[count+1][x] == 0){
                  board[count+1][x] = currentValue;
                  board[count][x] = 0;
                  count++;
                }else{
                  break;
                }
              }
            }
          }
          break;
        //y가 고정
        case 'ArrowLeft':
          for(let y=0; y<4; y++){
            for(let x=0; x<4; x++){
              let currentValue = board[y][x];
              let count = x;
              while(count>0){
                if(currentValue == board[y][count-1]){
                  board[y][count-1] *= 2;
                  board[y][count] = 0;
                  score += board[y][count-1];
                  count--;
                }else if(board[y][count-1] == 0){
                  board[y][count-1] = currentValue;
                  board[y][count] = 0;
                  count--;
                }else{
                  break;
                }
              }
            }
          }
          break;
        case 'ArrowRight':
          for(let y=0; y<4; y++){
            for(let x=3; x>=0; x--){
              let currentValue = board[y][x];
              let count = x;
              while(count<3){
                if(currentValue == board[y][count+1]){
                  board[y][count+1] *= 2;
                  board[y][count] = 0;
                  score += board[y][count+1];
                  count++;
                }else if(board[y][count+1] == 0){
                  board[y][count+1] = currentValue;
                  board[y][count] = 0;
                  count++;
                }else{
                  break;
                }
              }
            }
          }
          break;
      }


      //다음랜덤숫자 보드에 추가
      const tile = getNextTile(board);
      if(tile){
        board[tile.y][tile.x] =  tile.value;
      }

      //이번 턴에 획득한 점수 누적
      score = state.score + score;

      //GameOver체크 
      isGameOver = checkGameOver(board);
      if(isWinGame(board)){
        isGameOver = true;
        isWin = true;
      }
      break;
  }

  return {gameBoard: board, score: score, key: action.key, isGameOver:isGameOver, isWin:isWin}
}
function checkGameOver(board:number[][]){
  let isGameOver:boolean = true;
  board.forEach((_,y)=>{
    _.forEach((value,x)=>{
      if(value== 0) {
        isGameOver = false;
      };
      const up    = (y-1 > -1 && y-1 < board.length) ? board[y-1][x] : null;
      const down  = (y+1 > -1 && y+1 < board.length) ? board[y+1][x] : null;
      const left  = (x-1 > -1 && x-1 < board.length) ? board[y][x-1] : null;
      const right = (x+1 > -1 && x+1 < board.length) ? board[y][x+1] : null;
      if([up,down, left, right].some(e=> e == value || e == 0)){
        isGameOver = false;
      }
    })
  })
  return isGameOver;
}
function isWinGame(board:number[][]){
  return board.some(_=> _.some(v=> v== 2048))
}
interface GameState {
  gameBoard:number[][]
  score:number
  key:string
  isGameOver:boolean
  isWin:boolean
}