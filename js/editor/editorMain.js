
var currentLevel = 1;
var totalLevels = 10;
const levelPrefix = "levels/lv";
const levelPostfix = ".txt";

var generateWallsAmount = 50;

function getLevelName() { return levelPrefix + currentLevel.toString() + levelPostfix; }

function loadLevel(walls, areas)
{
    var lvStr = readFile(getLevelName());
    generateWallsFromString(walls, lvStr.split(".")[0]);
    generateAreasFromString(areas, lvStr.split(".")[1]);
}

function editorInit(walls, areas)
{
    loadLevel(walls, areas);
}

function editorEvents(deltaTime, offset, walls, areas)
{
    if(cpEditPanel.enabled)
    {
        if(cpEditTabs[0].selector.selected) wallHandleEvents(walls, offset);
        if(cpEditTabs[1].selector.selected) areaHandleEvents(areas, offset);
    }
}

function editorUpdate(deltaTime)
{

}

function editorDraw(renderer, walls, areas)
{
    if(cpEditPanel.enabled)
    {
        editorDrawGrid(renderer);
        if(cpEditTabs[0].selector.selected) editorDrawWallHandles(renderer, walls);
        if(cpEditTabs[1].selector.selected) editorDrawAreaHandles(renderer, areas);
    }
}

function snapWallToGrid(wall, offset)
{
    wall.addOffset(vec2(offset.x, offset.y).add(vec2(100000, 100000)));
    wall.p1 = vec2(
        wall.p1.x - (wall.p1.x % gridCellSize),
        wall.p1.y - (wall.p1.y % gridCellSize));
    wall.p2 = vec2(
        wall.p2.x - (wall.p2.x % gridCellSize),
        wall.p2.y - (wall.p2.y % gridCellSize));
    wall.addOffset(vec2(-offset.x, -offset.y).add(vec2(-100000, -100000)));
}

function snapWallsToGrid(walls, offset)
{
    for(let i = 0; i < walls.length; i++)
        snapWallToGrid(walls[i], offset);
}

function snapAreaToGrid(area, offset)
{
    area.addOffset(vec2(offset.x, offset.y).add(vec2(100000, 100000)));
    area.pos = vec2(
        area.pos.x - (area.pos.x % gridCellSize),
        area.pos.y - (area.pos.y % gridCellSize));
    area.size = vec2(
        area.size.x - (area.size.x % gridCellSize),
        area.size.y - (area.size.y % gridCellSize));
    area.addOffset(vec2(-offset.x, -offset.y).add(vec2(-100000, -100000)));
}

function snapAreasToGrid(areas, offset)
{
    for(let i = 0; i < areas.length; i++)
        snapAreaToGrid(areas[i], offset);
}