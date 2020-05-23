
var editorTypeHighlightColor = "yellow";

var showGrid = true;
var gridCellSize = 10;
var gridColor = "#ffffff20";
var gridOffset = vec2(0, 0);

var levelStartingPlayerPosSize = 6;
var levelStartingPlayerPosColor = "#ffffff88";

var boxPos = vec2(0, 0);
var boxSize = vec2(0, 0);
var boxColor = "#2200ff33";
var boxLineColor = "#0000ffff";
var boxActive = false;

var wallHandleSize = 14;
var wallHandleColor = "#00dd00ff";
var wallActiveSectorHandleColor = "#ff000044";

var areaHandleSize = 14;
var areaHandleColor = "#00aaaaff";
var areaMidlineColor = "#00aaaa44";

var itemHandleSize = 10;
var itemHandleColor = "#00ddaaff";

var decorHandleSize = 10;
var decorHandleColor = "#ddddaaff";

var enemyHandleSize = 14;
var enemyHandleColor = "#ff5500ff";

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

function editorDrawLevelStartingPlayerPosition(renderer)
{
    drawLine(renderer,
        levelStartingPlayerPos.subtract(vec2(levelStartingPlayerPosSize, 0)),
        levelStartingPlayerPos.add(vec2(levelStartingPlayerPosSize, 0)),
        levelStartingPlayerPosColor);
    drawLine(renderer,
        levelStartingPlayerPos.subtract(vec2(0, levelStartingPlayerPosSize)),
        levelStartingPlayerPos.add(vec2(0, levelStartingPlayerPosSize)),
        levelStartingPlayerPosColor);
}

function editorDrawWallHandles(renderer, walls)
{
    for(let i = 0; i < walls.length; i++)
    {
        if(walls[i] == activeSector)
        {
            drawRect(renderer, walls[i].p1.subtract(vec2(wallHandleSize, wallHandleSize)),
                vec2(wallHandleSize*2, wallHandleSize*2), true, wallActiveSectorHandleColor, 0);
            drawRect(renderer, walls[i].p2.subtract(vec2(wallHandleSize, wallHandleSize)),
                vec2(wallHandleSize*2, wallHandleSize*2), true, wallActiveSectorHandleColor, 0);
        }

        drawRect(renderer, walls[i].p1.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
            vec2(wallHandleSize, wallHandleSize), selectedWallIndex == i && selectedWallEnd == wall[i].p1,
            currentWallType == walls[i].type ? editorTypeHighlightColor : wallHandleColor, 0);
        drawRect(renderer, walls[i].p2.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
            vec2(wallHandleSize, wallHandleSize), selectedWallIndex == i && selectedWallEnd == wall[i].p2,
            currentWallType == walls[i].type ? editorTypeHighlightColor : wallHandleColor, 0);
    }
}

function editorDrawAreaHandles(renderer, areas)
{
    for(let i = 0; i < areas.length; i++)
    {
        drawRect(renderer, areas[i].pos.subtract(vec2(areaHandleSize/2, areaHandleSize/2)),
            vec2(areaHandleSize, areaHandleSize),
            selectedAreaIndex == i && selectedAreaPosOrSize == areas[i].pos,
            currentAreaType == areas[i].type ? editorTypeHighlightColor : areaHandleColor, 0);
        drawCircle(renderer, areas[i].pos.add(vec2(areas[i].size.x, areas[i].size.y))
            .subtract(vec2(areaHandleSize/4, areaHandleSize/4)), areaHandleSize/3,
            selectedAreaIndex == i && selectedAreaPosOrSize == areas[i].size,
            currentAreaType == areas[i].type ? editorTypeHighlightColor : areaHandleColor);
    }
}

function editorDrawDecorHandles(renderer, decorEnts)
{
    for(let i = 0; i < decorEnts.length; i++)
    {
        drawRect(renderer, decorEnts[i].p.subtract(vec2(decorHandleSize/2, decorHandleSize/2)),
            vec2(decorHandleSize, decorHandleSize), selectedDecorIndex == i, currentEntityType == decorEnts[i].id ? editorTypeHighlightColor : decorHandleColor, 0);
    }
}

function editorDrawItemHandles(renderer, itemEnts)
{
    for(let i = 0; i < itemEnts.length; i++)
    {
        drawRect(renderer, itemEnts[i].p.subtract(vec2(itemHandleSize/2, itemHandleSize/2)),
            vec2(itemHandleSize, itemHandleSize), selectedItemIndex == i, currentEntityType == itemEnts[i].id ? editorTypeHighlightColor : itemHandleColor, 0);
    }
}

function editorDrawEnemyHandles(renderer, enemyEnts)
{
    for(let i = 0; i < enemyEnts.length; i++)
    {
        drawRect(renderer, enemyEnts[i].p.subtract(vec2(enemyHandleSize/2, enemyHandleSize/2)),
            vec2(enemyHandleSize, enemyHandleSize), selectedEnemyIndex == i, currentEntityType == enemyEnts[i].id ? editorTypeHighlightColor : enemyHandleColor, 0);
    }
}

function editorDrawSectorHandles(renderer, sector, walls)
{
    if(typeof sector != "undefined")
    {
        for(let i = 0; i < walls.length; i++)
        {
            var isWallIncludedInSector = false;

            //WIP!!!
            //check all sector walls and sectors to see if the wall is included in sector

            drawRect(renderer, lerpVec2(walls[i].p1, walls[i].p2, 0.5).subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
                vec2(wallHandleSize, wallHandleSize), isWallIncludedInSector,
                currentWallType == walls[i].type ? editorTypeHighlightColor : wallHandleColor, 0);
        }
        
        drawRect(renderer, sector.p1.subtract(vec2(wallHandleSize/4, wallHandleSize/4)),
            vec2(wallHandleSize/2, wallHandleSize/2), false, "red", 0);
        drawRect(renderer, sector.p2.subtract(vec2(wallHandleSize/4, wallHandleSize/4)),
            vec2(wallHandleSize/2, wallHandleSize/2), false, "red", 0);
    }
}

function editorDrawBox(renderer)
{
    if(boxActive)
    {
        drawRect(renderer, boxPos, boxSize, true, boxColor);
        drawLine(renderer, boxPos, boxPos.add(boxSize), boxLineColor);
    }
}

function addOffsetToList(list, offset)
{
    for(let i = 0; i < list.length; i++)
        list[i].addOffset(offset);
}

function addOffsetToLists(lists, offset)
{
    for(let i = 0; i < lists.length; i++)
        addOffsetToList(lists[i], offset);
}