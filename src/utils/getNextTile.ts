export interface Tile{
    x:number;
    y:number;
    value:number;
}

export function getNextTile(board: number[][]):Tile|null{
    const emptyPositions: Tile[] = [];
    board.forEach((yrow, y)=>{
        yrow.forEach((value,x)=>{
            if(value == 0){
                emptyPositions.push({x:x,y:y, value:value});
            }
        }
    )})
    if(emptyPositions.length == 0){
        return null;
    }
    const randomIndex = Math.round(Math.random()*10) % emptyPositions.length;
    const nextValue = Math.round(Math.random()*10) % 2 ? 4:2;

    return {x:emptyPositions[randomIndex].x, y:emptyPositions[randomIndex].y, value:nextValue}
}