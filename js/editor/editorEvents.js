
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

//GENERAL
var editorSelectionCurrentDelay = 0;
var editorSelectionDelay = 20;

function wallHandleEvents(walls, offset)
{
    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        for(let i = 0; i < walls.length; i++)
        {
            if(selectedWall == null)
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

        if(selectedWall != null)
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
        for(let i = 0; i < areas.length; i++)
        {
            if(selectedArea == null)
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

        if(selectedArea != null)
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