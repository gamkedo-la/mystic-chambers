
var boxSelectionEvent = function(offset) {};

//WALLS
var wallHandleTr = null;
var wallHandleTouchIndex = -1;

var selectedWall = null;
var selectedWallIndex = -1;
var lastSelectedWallIndex = -1;
var selectedWallEnd = null;

var currentWallType = 0;

//AREAS
var areaHandleTr = null;
var areaHandleTouchIndex = -1;

var selectedArea = null;
var selectedAreaIndex = -1;
var lastSelectedAreaIndex = -1;
var selectedAreaPosOrSize = null;

var currentAreaType = 0;

//DECOR
var decorHandleTr = null;
var decorHandleTouchIndex = -1;

var selectedDecor = null;
var selectedDecorIndex = -1;
var lastSelectedDecorIndex = -1;

var currentDecorType = 0;

//ITEMS
var itemHandleTr = null;
var itemHandleTouchIndex = -1;

var selectedItem = null;
var selectedItemIndex = -1;
var lastSelectedItemIndex = -1;

var currentItemType = 0;

//ENEMIES
var enemyHandleTr = null;
var enemyHandleTouchIndex = -1;

var selectedEnemy = null;
var selectedEnemyIndex = -1;
var lastSelectedEnemyIndex = -1;

var currentEnemyType = 0;

//GENERAL
var editorSelectionCurrentDelay = 0;
var editorSelectionDelay = 20;

function boxHandleEvent(offset)
{
    if(isTouched)
    {
        if(!boxActive)
        {
            boxPos = vec2(touchPos[0].x, touchPos[0].y);
            boxActive = true;
        }
        else
        {
            boxSize = vec2(touchPos[0].x - boxPos.x, touchPos[0].y - boxPos.y);
        }
    }
    else if(boxActive)
    {
        if(boxPos.x != 0 && boxPos.y != 0
            && Math.abs(boxSize.x) > 2 && Math.abs(boxSize.y) > 2)
        {
            boxSelectionEvent(offset);

            boxPos = vec2(0, 0);
            boxSize = vec2(0, 0);
            boxSelectionEvent = function(offset) {};
        }
        boxActive = false;
    }
}

function wallHandleEvents(walls, offset)
{
    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(selectedWall == null)
        {
            for(let i = 0; i < walls.length; i++)
            {
                wallHandleTr = tr(walls[i].p1.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
                    vec2(wallHandleSize, wallHandleSize));
                wallHandleTouchIndex = touched(wallHandleTr, 1.0);

                if(wallHandleTouchIndex > -1)
                {
                    walls[i].p1 = wall[i].p1.add(offset);

                    selectedWall = walls[i];
                    selectedWallIndex = i;
                    selectedWallEnd = walls[i].p1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }

                wallHandleTr = tr(walls[i].p2.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
                    vec2(wallHandleSize, wallHandleSize));
                wallHandleTouchIndex = touched(wallHandleTr, 1.0);

                if(wallHandleTouchIndex > -1)
                {
                    walls[i].p2 = wall[i].p1.add(offset);

                    selectedWall = walls[i];
                    selectedWallIndex = i;
                    selectedWallEnd = walls[i].p2;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
        else
        {
            if(selectedWall.p1 == selectedWallEnd)
                selectedWall.p1 = walls[selectedWallIndex].p1 = selectedWallEnd = touchPos[0];
            else if(selectedWall.p2 == selectedWallEnd)
                selectedWall.p2 = walls[selectedWallIndex].p2 = selectedWallEnd = touchPos[0];

            if(editorSelectionCurrentDelay <= 0)
            {
                wallHandleTr = tr(selectedWallEnd.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
                    vec2(wallHandleSize, wallHandleSize));

                if(touched(wallHandleTr, 1.0) > -1)
                {
                    selectedWallEnd = selectedWallEnd.add(offset);

                    snapWallToGrid(walls[selectedWallIndex], offset);

                    wallHandleTouchIndex = -1;
                    selectedWall = null;
                    lastSelectedWallIndex = selectedWallIndex;
                    selectedWallIndex = -1;
                    selectedWallEnd = null;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
    }
}

function areaHandleEvents(areas, offset)
{
    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(selectedArea == null)
        {
            for(let i = 0; i < areas.length; i++)
            {
                areaHandleTr = tr(areas[i].pos.subtract(vec2(areaHandleSize/2, areaHandleSize/2)),
                    vec2(areaHandleSize, areaHandleSize));
                areaHandleTouchIndex = touched(areaHandleTr, 1.0);

                if(areaHandleTouchIndex > -1)
                {
                    areas[i].pos = areas[i].pos.add(offset);

                    selectedArea = areas[i];
                    selectedAreaIndex = i;
                    selectedAreaPosOrSize = areas[i].pos;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }

                areaHandleTr = tr(areas[i].pos.add(area[i].size).
                    subtract(vec2(areaHandleSize/2, areaHandleSize/2)),
                    vec2(areaHandleSize, areaHandleSize));
                areaHandleTouchIndex = touched(areaHandleTr, 1.0);

                if(areaHandleTouchIndex > -1)
                {
                    selectedArea = areas[i];
                    selectedAreaIndex = i;
                    selectedAreaPosOrSize = areas[i].size;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
        else
        {
            if(selectedArea.pos == selectedAreaPosOrSize)
            {
                selectedArea.pos = areas[selectedAreaIndex].pos = selectedAreaPosOrSize = touchPos[0];
            }
            else if(selectedArea.size == selectedAreaPosOrSize)
            {
                selectedArea.size = selectedAreaPosOrSize = areas[selectedAreaIndex].calcSize(touchPos[0]);
            }

            if(editorSelectionCurrentDelay <= 0)
            {
                areaHandleTr = tr(
                    selectedAreaPosOrSize == selectedArea.pos ?
                    selectedAreaPosOrSize.subtract(vec2(areaHandleSize/2, areaHandleSize/2)) :
                    selectedAreaPosOrSize.add(selectedArea.pos).subtract(vec2(areaHandleSize/2, areaHandleSize/2)),
                    vec2(areaHandleSize, areaHandleSize) );

                if(touched(areaHandleTr, 1.0) > -1)
                {
                    selectedAreaPosOrSize = selectedAreaPosOrSize.add(offset);

                    snapAreaToGrid(areas[selectedAreaIndex], offset);

                    areaHandleTouchIndex = -1;
                    selectedArea = null;
                    lastSelectedAreaIndex = selectedAreaIndex;
                    selectedAreaIndex = -1;
                    selectedAreaPosOrSize = null;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
    }
}

function decorHandleEvents(decorEnts, offset)
{
    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(selectedDecor == null)
        {
            for(let i = 0; i < decorEnts.length; i++)
            {
                decorHandleTr = tr(decorEnts[i].p.subtract(vec2(decorHandleSize/2, decorHandleSize/2)),
                    vec2(decorHandleSize, decorHandleSize));
                decorHandleTouchIndex = touched(decorHandleTr, 1.0);

                if(decorHandleTouchIndex > -1)
                {
                    decorEnts[i].p = decorEnts[i].p.add(offset);

                    selectedDecor = decorEnts[i];
                    selectedDecorIndex = i;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
        else
        {
            selectedDecor.p = decorEnts[selectedDecorIndex].p = touchPos[0];

            if(editorSelectionCurrentDelay <= 0)
            {
                decorHandleTr = tr(selectedDecor.p.subtract(vec2(decorHandleSize/2, decorHandleSize/2)),
                    vec2(decorHandleSize, decorHandleSize));

                if(touched(decorHandleTr, 1.0) > -1)
                {
                    removeEntityInAllSectors(selectedDecor);
                    entitiesInSectorSet = [];
                    setEntitiesInSectors();

                    decorHandleTouchIndex = -1;
                    selectedDecor = null;
                    lastSelectedDecorIndex = selectedDecorIndex;
                    selectedDecorIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
    }
}

function itemHandleEvents(itemEnts, offset)
{
    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(selectedItem == null)
        {
            for(let i = 0; i < itemEnts.length; i++)
            {
                itemHandleTr = tr(itemEnts[i].p.subtract(vec2(itemHandleSize/2, itemHandleSize/2)),
                    vec2(itemHandleSize, itemHandleSize));
                itemHandleTouchIndex = touched(itemHandleTr, 1.0);

                if(itemHandleTouchIndex > -1)
                {
                    itemEnts[i].p = itemEnts[i].p.add(offset);

                    selectedItem = itemEnts[i];
                    selectedItemIndex = i;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
        else
        {
            selectedItem.p = itemEnts[selectedItemIndex].p = touchPos[0];

            if(editorSelectionCurrentDelay <= 0)
            {
                itemHandleTr = tr(selectedItem.p.subtract(vec2(itemHandleSize/2, itemHandleSize/2)),
                    vec2(itemHandleSize, itemHandleSize));

                if(touched(itemHandleTr, 1.0) > -1)
                {
                    removeEntityInAllSectors(selectedItem);
                    entitiesInSectorSet = [];
                    setEntitiesInSectors();

                    itemHandleTouchIndex = -1;
                    selectedItem = null;
                    lastSelectedItemIndex = selectedItemIndex;
                    selectedItemIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
    }
}

function enemyHandleEvents(enemyEnts, offset)
{
    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(selectedEnemy == null)
        {
            for(let i = 0; i < enemyEnts.length; i++)
            {
                enemyHandleTr = tr(enemyEnts[i].p.subtract(vec2(enemyHandleSize/2, enemyHandleSize/2)),
                    vec2(enemyHandleSize, enemyHandleSize));
                enemyHandleTouchIndex = touched(enemyHandleTr, 1.0);

                if(enemyHandleTouchIndex > -1)
                {
                    enemyEnts[i].p = enemyEnts[i].p.add(offset);

                    selectedEnemy = enemyEnts[i];
                    selectedEnemyIndex = i;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
        else
        {
            selectedEnemy.p = enemyEnts[selectedEnemyIndex].p = touchPos[0];

            if(editorSelectionCurrentDelay <= 0)
            {
                enemyHandleTr = tr(selectedEnemy.p.subtract(vec2(enemyHandleSize/2, enemyHandleSize/2)),
                    vec2(enemyHandleSize, enemyHandleSize));

                if(touched(enemyHandleTr, 1.0) > -1)
                {
                    removeEntityInAllSectors(selectedEnemy);
                    entitiesInSectorSet = [];
                    setEntitiesInSectors();

                    enemyHandleTouchIndex = -1;
                    selectedEnemy = null;
                    lastSelectedEnemyIndex = selectedEnemyIndex;
                    selectedEnemyIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                    return;
                }
            }
        }
    }
}