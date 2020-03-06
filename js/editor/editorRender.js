
var showGrid = true;
var gridCellSize = 20;
var gridColor = "#ffffff20";
var gridOffset = vec2(0, 0);

var wallHandleSize = 14;
var wallHandleColor = "#00dd00ff";

var areaHandleSize = 14;
var areaHandleColor = "#00aaaaff";
var areaMidlineColor = "#00aaaa40";

function editorDrawGrid(renderer)
{
    if(showGrid)
    {
        for(let x = gridOffset.x; x < window.innerWidth; x += gridCellSize)
            drawLine(renderer, vec2(x, 0), vec2(x, window.innerHeight), gridColor);
        for(let y = gridOffset.y; y < window.innerHeight; y += gridCellSize)
            drawLine(renderer, vec2(0, y), vec2(window.innerWidth, y), gridColor);
    }
}

function editorDrawWallHandles(renderer, walls)
{
    for(let i = 0; i < walls.length; i++)
    {
        drawRect(renderer, walls[i].p1.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
            vec2(wallHandleSize, wallHandleSize),
            selectedWallIndex == i && selectedWallEnd == wall[i].p1,
            wallHandleColor, 0);
        drawRect(renderer, walls[i].p2.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
            vec2(wallHandleSize, wallHandleSize),
            selectedWallIndex == i && selectedWallEnd == wall[i].p2,
            wallHandleColor, 0);
    }
}

function editorDrawAreaHandles(renderer, areas)
{
    for(let i = 0; i < areas.length; i++)
    {
        drawRect(renderer, areas[i].pos.subtract(vec2(areaHandleSize/2, areaHandleSize/2)),
            vec2(areaHandleSize, areaHandleSize),
            selectedAreaIndex == i && selectedAreaPosOrSize == areas[i].pos,
            areaHandleColor, 0);
        drawLine(renderer, areas[i].pos, areas[i].pos.add(vec2(areas[i].size.x, areas[i].size.y))
            .subtract(vec2(areaHandleSize/4, areaHandleSize/4)), areaMidlineColor);
        drawCircle(renderer, areas[i].pos.add(vec2(areas[i].size.x, areas[i].size.y))
            .subtract(vec2(areaHandleSize/4, areaHandleSize/4)), areaHandleSize/3,
            selectedAreaIndex == i && selectedAreaPosOrSize == areas[i].size,
            areaHandleColor);
    }
}