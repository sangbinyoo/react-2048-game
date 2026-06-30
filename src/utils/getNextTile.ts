export interface Tile{
    x:number;
    y:number;
    value:number;
}

export function getNextTile():Tile{
    const randomX = Math.round(Math.random()*10) % 4;
    const randomY = Math.round(Math.random()*10) % 4;
    const nextValue = Math.round(Math.random()*10) % 2 ? 4:2;

    return {x:randomX, y:randomY, value:nextValue}
}