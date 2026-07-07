import React, { useCallback, useEffect, useState } from 'react'
import './App.css';
import { getNextTile, Tile } from './utils/getNextTile';



function App() {
  
  const [gameBoard, setGameBoard] = useState([] as number[][]);

  //방향키 입력 이벤트를 바인딩
  useEffect(()=>{
    window.addEventListener('keydown', keyboardListener as any);
    //cleanup
    return ()=>{
      window.removeEventListener('keydown', keyboardListener as any);
    }
  },[gameBoard])


  // 방향키 이벤트를 감지하는 로직
  const keyboardListener = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    //방향키 외의 키는 무시
    const allowedKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    e.preventDefault();
    if (!allowedKeys.includes(e.key)) return;

    //1. 게임보드의 타일 이동 및 합치기
    let newBoard = moveAndMerge(e.key);
    //2. 게임이 끝났는지 확인
    checkGameOver();
    //4. 다음 타일 생성 및 보드에 추가
    addNextTile(newBoard);

  }, [gameBoard]);

  const gameStart = () => {
    // if(!!gameBoard && gameBoard.size > 0) return;
    let board = getBoard();
    addNextTile(board)
  }

  //TODO : 방향키에 따라 게임보드의 타일을 이동시키고 합치는 로직
  const moveAndMerge = (direction:string) => {

    const newBoard:number[][] = new Array(...gameBoard);


    //이동규칙
    /*
    **방법정리 
    1.전체타일을 반복하며 이동+합병처리
    2.값을기준으로 일괄처리

    현재타일에 값이 있으면 (!==0) 다음타일로 값을이동한다 (반복)
    값이동시, 다음타일에 값이 있으면 합병후 이동종료
    이동종료후엔 합병된위치의 다음인덱스부터 시작한다
    */

    switch(direction){
      //x가 고정
      case 'ArrowUp':
        for(let x=0; x<4; x++){
          for(let y=0; y<4; y++){
            let currentValue = newBoard[y][x];
            let count = y;
            while(count>0){
              if(currentValue == newBoard[count-1][x]){
                newBoard[count-1][x] *= 2;
                newBoard[count][x] = 0;
                count--;
              }else if(newBoard[count-1][x] == 0){
                newBoard[count-1][x] = currentValue;
                newBoard[count][x] = 0;
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
            let currentValue = newBoard[y][x];
            let count = y;
            while(count<3){
              if(currentValue == newBoard[count+1][x]){
                newBoard[count+1][x] *= 2;
                newBoard[count][x] = 0;
                count++;
              }else if(newBoard[count+1][x] == 0){
                newBoard[count+1][x] = currentValue;
                newBoard[count][x] = 0;
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
            let currentValue = newBoard[y][x];
            let count = x;
            while(count>0){
              if(currentValue == newBoard[y][count-1]){
                newBoard[y][count-1] *= 2;
                newBoard[y][count] = 0;
                count--;
              }else if(newBoard[y][count-1] == 0){
                newBoard[y][count-1] = currentValue;
                newBoard[y][count] = 0;
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
            let currentValue = newBoard[y][x];
            let count = x;
            while(count<3){
              if(currentValue == newBoard[y][count+1]){
                newBoard[y][count+1] *= 2;
                newBoard[y][count] = 0;
                count++;
              }else if(newBoard[y][count+1] == 0){
                newBoard[y][count+1] = currentValue;
                newBoard[y][count] = 0;
                count++;
              }else{
                break;
              }
            }
          }
        }
        break;
    }

              
              
    return newBoard;

  }     


  //TODO : 다음타일 생성및 보드에 추가
  const addNextTile = (board:number[][]) => {
    //3. 다음 타일 생성
    const newBoard = board.map(row=> [...row]);
    const tile = getNextTile(newBoard);

    //4. 게임보드에 타일 추가
    newBoard[tile.y][tile.x] =  tile.value;
    setGameBoard(newBoard);
  }

  //TODO : 게임이 끝났는지 확인하는 로직
  const checkGameOver = ():boolean => {
    return false;
  }

  return (
    <>
    <main>
      <header>
        <div>Play 2048</div>
        <button onClick={gameStart}>Game Start</button>
      </header>
      <section className="game-board">
        {gameBoard.map((_,y)=> 
          <div key={y} className="row-tile">
            {_.map((__,x)=>
              <div className={`tile tile-${__}`} key={x}>
                  {__ !== 0 ? __ : ''}
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