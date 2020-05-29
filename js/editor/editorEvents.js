var editorAddCheck = false;
var editorTemp = undefined;

var editorSelectionCurrentDelay = 0;
var editorSelectionDelay = 15;
var currentEntityType = 0;
var boxSelectionEvent = function(offset) {};
var editorTypeIncKey = "m";
var editorTypeDecKey = "n";

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

//ITEMS
var itemHandleTr = null;
var itemHandleTouchIndex = -1;

var selectedItem = null;
var selectedItemIndex = -1;
var lastSelectedItemIndex = -1;

//ENEMIES
var enemyHandleTr = null;
var enemyHandleTouchIndex = -1;

var selectedEnemy = null;
var selectedEnemyIndex = -1;
var lastSelectedEnemyIndex = -1;

function switchTabAccordingToType(dir)
{
    if(cpEditTabs[0].selector.selected || cpEditTabs[5].selector.selected)
    {
        if(dir > 0 && currentWallType >= wallImages.length)
        {
            cpEditTabs[0].selector.selected = cpEditTabs[5].selector.selected = false;
            cpEditTabs[2].selector.selected = true;
            currentEditTabIndex = 2;
            currentWallType = wallImages.length - 1;
            currentEntityType = decorStartType - 1;
        }
        else if(dir < 0 && currentWallType <= 0)
        {
            cpEditTabs[0].selector.selected = cpEditTabs[5].selector.selected = false;
            cpEditTabs[4].selector.selected = true;
            currentEditTabIndex = 4;
            currentEntityType = enemyStartType + enemyTotalTypes - 1 + 1;
        }
    }
    else if(cpEditTabs[2].selector.selected)
    {
        if(dir > 0 && currentEntityType >= decorStartType + decorTotalTypes)
        {
            cpEditTabs[2].selector.selected = false;
            cpEditTabs[3].selector.selected = true;
            currentEditTabIndex = 3;
            currentEntityType = itemStartType - 1;
        }
        else if(dir < 0 && currentEntityType < decorStartType)
        {
            cpEditTabs[2].selector.selected = false;
            cpEditTabs[0].selector.selected = true;
            currentEditTabIndex = 0;
            currentWallType = wallImages.length - 1;
        }
    }
    else if(cpEditTabs[3].selector.selected)
    {
        if(dir > 0 && currentEntityType >= itemStartType + itemTotalTypes)
        {
            cpEditTabs[3].selector.selected = false;
            cpEditTabs[4].selector.selected = true;
            currentEditTabIndex = 4;
            currentEntityType = enemyStartType - 1;
        }
        else if(dir < 0 && currentEntityType < itemStartType)
        {
            cpEditTabs[3].selector.selected = false;
            cpEditTabs[2].selector.selected = true;
            currentEditTabIndex = 2;
            currentEntityType = decorStartType + decorTotalTypes - 1 + 1;
        }
    }
    else if(cpEditTabs[4].selector.selected)
    {
        if(dir > 0 && currentEntityType >= enemyStartType + enemyTotalTypes)
        {
            cpEditTabs[4].selector.selected = false;
            cpEditTabs[0].selector.selected = true;
            currentEditTabIndex = 0;
            currentEntityType = decorStartType;
            currentWallType = 0;
        }
        else if(dir < 0 && currentEntityType < enemyStartType)
        {
            cpEditTabs[4].selector.selected = false;
            cpEditTabs[3].selector.selected = true;
            currentEditTabIndex = 3;
            currentEntityType = itemStartType + itemTotalTypes - 1 + 1;
        }
    }
}

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

            if(editorMode == -1 || editorMode == 2)
            {
                tempArea = new Area(boxPos, boxSize, 0);
                if(cpEditTabs[0].selector.selected)
                {
                    for(let i = 0; i < wall.length; i++)
                    {
                        if(tempArea.isPointInside(wall[i].p1)
                        || tempArea.isPointInside(wall[i].p2))
                        {
                            if(editorMode == -1)
                            {
                                deleteWallFromAllSectors(wall[i]);
                                wall.splice(i, 1);
                                i--;
                            }
                            else if(editorMode == 2)
                            {
                                wall[i].type = currentWallType;
                            }
                        }
                    }
                }
                else if(cpEditTabs[1].selector.selected)
                {
                    for(let i = 0; i < area.length; i++)
                    {
                        if(tempArea.isPointInside(area[i].pos))
                        {
                            if(editorMode == -1)
                            {
                                area.splice(i, 1);
                                i--;
                            }
                            else if(editorMode == 2)
                            {
                                area[i].type = currentAreaType;
                            }
                        }
                    }
                }
                else if(cpEditTabs[2].selector.selected)
                {
                    for(let i = 0; i < decor.ents.length; i++)
                    {
                        if(tempArea.isPointInside(decor.ents[i].p))
                        {
                            if(editorMode == -1)
                            {
                                removeEntity(decor.ents[i]);
                                decor.ents.splice(i, 1);
                                i--;
                            }
                            else if(editorMode == 2)
                            {
                                decor.ents[i].id = currentEntityType;
                                decor.ents[i].setIDProperties();
                            }
                        }
                    }
                }
                else if(cpEditTabs[3].selector.selected)
                {
                    for(let i = 0; i < items.ents.length; i++)
                    {
                        if(tempArea.isPointInside(items.ents[i].p))
                        {
                            if(editorMode == -1)
                            {
                                removeEntity(items.ents[i]);
                                items.ents.splice(i, 1);
                                i--;
                            }
                            else if(editorMode == 2)
                            {
                                items.ents[i].id = currentEntityType;
                                items.ents[i].setIDProperties();
                            }
                        }
                    }
                }
                else if(cpEditTabs[4].selector.selected)
                {
                    for(let i = 0; i < enemies.ents.length; i++)
                    {
                        if(tempArea.isPointInside(enemies.ents[i].p))
                        {
                            if(editorMode == -1)
                            {
                                removeEntity(enemies.ents[i]);
                                enemies.ents.splice(i, 1);
                                i--;
                            }
                            else if(editorMode == 2)
                            {
                                enemies.ents[i].id = currentEntityType;
                                enemies.ents[i].setIDProperties();
                            }
                        }
                    }
                }
                else if(cpEditTabs[5].selector.selected)
                {
                    for(let i = 0; i < wall.length; i++)
                    {
                        if(tempArea.isPointInside(lerpVec2(wall[i].p1, wall[i].p2, 0.5)))
                        {
                            if(editorMode == -1 || editorMode == 1)
                            {
                                if(isWallInActiveSector(wall[i]))
                                    deleteWallFromActiveSector(wall[i]);
                                else
                                    addWallToSector(wall[i]);
                            }
                            else if(editorMode == 2)
                            {
                                wall[i].type = currentWallType;
                            }
                        }
                    }
                }
            }

            boxPos = vec2(0, 0);
            boxSize = vec2(0, 0);

            //Reset box selection event function after using it once
            //boxSelectionEvent = function(offset) {};
        }
        boxActive = false;
    }
}

function wallHandleEvents(walls, offset)
{
    var oldType = currentWallType;
    currentWallType += (wheelScroll != 0 ? (wheelScroll > 0 ? 1 : -1) : 0);

    if(keysDown.indexOf(editorTypeIncKey) != -1) {
        if(!isKeyPressed(editorTypeIncKey)) currentWallType++; }
    else
        removeKeyPressed(editorTypeIncKey);
    
    if(keysDown.indexOf(editorTypeDecKey) != -1) {
        if(!isKeyPressed(editorTypeDecKey)) currentWallType--; }
    else
        removeKeyPressed(editorTypeDecKey);

    if(oldType != currentWallType)
        switchTabAccordingToType(currentWallType - oldType);

    //if(currentWallType >= wallImages.length) currentWallType = 0;
    //else if(currentWallType <= -1) currentWallType = wallImages.length - 1;

    if(editorMode == -1)
    {
        if(lastSelectedWallIndex >= 0 && lastSelectedWallIndex < wall.length)
        {
            deleteWallFromAllSectors(wall[lastSelectedWallIndex]);
            wall.splice(lastSelectedWallIndex, 1);
        }
        lastSelectedWallIndex = -1;
    }

    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(editorMode == 0 || editorMode == -1 || editorMode == 2)
        {
            editorAddCheck = true;

            if(selectedWall == null)
            {
                for(let i = 0; i < walls.length; i++)
                {
                    wallHandleTr = tr(walls[i].p1.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
                        vec2(wallHandleSize, wallHandleSize));
                    wallHandleTouchIndex = touched(wallHandleTr, 1.0);

                    if(wallHandleTouchIndex > -1)
                    {
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
                if(editorMode == 0)
                {
                    if(selectedWall.p1 == selectedWallEnd)
                        selectedWall.p1 = walls[selectedWallIndex].p1 = selectedWallEnd = touchPos[0];
                    else if(selectedWall.p2 == selectedWallEnd)
                        selectedWall.p2 = walls[selectedWallIndex].p2 = selectedWallEnd = touchPos[0];
                }
                else if(editorMode == 2)
                {
                    selectedWall.type = currentWallType;
                    wallHandleTouchIndex = -1;
                    selectedWall = null;
                    lastSelectedWallIndex = -1;
                    selectedWallIndex = -1;
                    selectedWallEnd = null;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }
                else if(editorMode == -1)
                {
                    wallHandleTouchIndex = -1;
                    selectedWall = null;
                    lastSelectedWallIndex = selectedWallIndex;
                    selectedWallIndex = -1;
                    selectedWallEnd = null;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }

                if(editorSelectionCurrentDelay <= 0)
                {
                    wallHandleTr = tr(selectedWallEnd.subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
                        vec2(wallHandleSize, wallHandleSize));

                    if(touched(wallHandleTr, 1.0) > -1)
                    {
                        selectedWallEnd = selectedWallEnd.add(offset);

                        snapWallToGrid(walls[selectedWallIndex], offset);
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
        else if(editorMode == 1)
        {
            if(isTouched)
            {
                if(!editorAddCheck)
                {
                    editorTemp = new Wall();
                    editorTemp.p1.x = touchPos[0].x;
                    editorTemp.p1.y = touchPos[0].y;
                    editorTemp.type = currentWallType;
                    editorAddCheck = true;
                }
                else if(typeof editorTemp != "undefined"
                && typeof editorTemp.p2 != "undefined")
                {
                    editorTemp.p2.x = touchPos[0].x;
                    editorTemp.p2.y = touchPos[0].y;
                }
            }
            else
            {
                if(typeof editorTemp != "undefined"
                && typeof editorTemp.p2 != "undefined")
                {
                    editorTemp.angle = editorTemp.p1.angle(editorTemp.p2);
                    if(wall.length <= 0
                    || typeof activeSector == "undefined")
                    {
                        editorTemp.type = 0;
                        wall.push(editorTemp);
                        activeSector = wall[0];
                        snapWallToGrid(walls[0], offset);
                        snapWallToGrid(walls[0], offset);
                    }
                    else
                    {
                        wall.push(editorTemp);
                        addWallToSector(wall[wall.length - 1]);
                        snapWallToGrid(walls[wall.length - 1], offset);
                        snapWallToGrid(walls[wall.length - 1], offset);
                    }
                    editorTemp = undefined;
                }
                editorAddCheck = false;
            }
        }
    }
}

function areaHandleEvents(areas, offset)
{
    //AREA TYPE IS CHANGED VIA AREA TYPE SLIDER (not mouse wheel or keys)
    /*
    currentAreaType += (wheelScroll != 0 ? (wheelScroll > 0 ? 1 : -1) : 0);

    if(keysDown.indexOf(editorTypeIncKey) != -1) {
        if(!isKeyPressed(editorTypeIncKey)) currentAreaType++; }
    else
        removeKeyPressed(editorTypeIncKey);
    
    if(keysDown.indexOf(editorTypeDecKey) != -1) {
        if(!isKeyPressed(editorTypeDecKey)) currentAreaType--; }
    else
        removeKeyPressed(editorTypeDecKey);
    */

    //switchTabAccordingToType(); //not for areas

    //FIXME: 2 to be replaced with total area types
    //if(currentAreaType >= 2) currentAreaType = 0;
    //else if(currentAreaType <= -1) currentAreaType = 2 - 1;

    if(editorMode == -1)
    {
        if(lastSelectedAreaIndex >= 0 && lastSelectedAreaIndex < area.length)
            area.splice(lastSelectedAreaIndex, 1);
        lastSelectedAreaIndex = -1;
    }

    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(editorMode == 0 || editorMode == -1 || editorMode == 2)
        {
            editorAddCheck = true;

            if(selectedArea == null)
            {
                for(let i = 0; i < areas.length; i++)
                {
                    areaHandleTr = tr(areas[i].pos.subtract(vec2(areaHandleSize/2, areaHandleSize/2)),
                        vec2(areaHandleSize, areaHandleSize));
                    areaHandleTouchIndex = touched(areaHandleTr, 1.0);

                    if(areaHandleTouchIndex > -1)
                    {
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
                if(editorMode == 0)
                {
                    if(selectedArea.pos == selectedAreaPosOrSize)
                    {
                        selectedArea.pos = areas[selectedAreaIndex].pos = selectedAreaPosOrSize = touchPos[0];
                    }
                    else if(selectedArea.size == selectedAreaPosOrSize)
                    {
                        selectedArea.size = selectedAreaPosOrSize = areas[selectedAreaIndex].calcSize(touchPos[0]);
                    }
                }
                else if(editorMode == 2)
                {
                    selectedArea.type = currentAreaType;
                    areaHandleTouchIndex = -1;
                    selectedArea = null;
                    lastSelectedAreaIndex = -1;
                    selectedAreaIndex = -1;
                    selectedAreaPosOrSize = null;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }
                else if(editorMode == -1)
                {
                    areaHandleTouchIndex = -1;
                    selectedArea = null;
                    lastSelectedAreaIndex = selectedAreaIndex;
                    selectedAreaIndex = -1;
                    selectedAreaPosOrSize = null;
                    editorSelectionCurrentDelay = editorSelectionDelay;
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
        else if(editorMode == 1)
        {
            if(isTouched)
            {
                if(!editorAddCheck)
                {
                    editorTemp = new Area(touchPos[0], vec2(), currentAreaType);
                    editorAddCheck = true;
                }
                else if(typeof editorTemp != "undefined"
                && typeof editorTemp.size != "undefined")
                {
                    editorTemp.size.x = -editorTemp.pos.x + touchPos[0].x;
                    editorTemp.size.y = -editorTemp.pos.y + touchPos[0].y;
                }
            }
            else
            {
                if(typeof editorTemp != "undefined"
                && typeof editorTemp.size != "undefined")
                {
                    area.push(editorTemp);
                    editorTemp = undefined;
                }
                editorAddCheck = false;
            }
        }
    }
}

function decorHandleEvents(decorEnts, offset)
{
    var oldType = currentEntityType;
    currentEntityType += (wheelScroll != 0 ? (wheelScroll > 0 ? 1 : -1) : 0);

    if(keysDown.indexOf(editorTypeIncKey) != -1) {
        if(!isKeyPressed(editorTypeIncKey)) currentEntityType++; }
    else
        removeKeyPressed(editorTypeIncKey);
    
    if(keysDown.indexOf(editorTypeDecKey) != -1) {
        if(!isKeyPressed(editorTypeDecKey)) currentEntityType--; }
    else
        removeKeyPressed(editorTypeDecKey);

    if(oldType != currentEntityType)
        switchTabAccordingToType(currentEntityType - oldType);

    //if(currentEntityType >= decorStartType + decorTotalTypes) currentEntityType = decorStartType;
    //else if(currentEntityType < decorStartType) currentEntityType = decorStartType + decorTotalTypes - 1;

    if(editorMode == -1)
    {
        if(lastSelectedDecorIndex >= 0 && lastSelectedDecorIndex < decor.ents.length)
        {
            removeEntity(decor.ents[lastSelectedDecorIndex]);
            decor.ents.splice(lastSelectedDecorIndex, 1);
        }
        lastSelectedDecorIndex = -1;
    }

    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(editorMode == 0 || editorMode == -1 || editorMode == 2)
        {
            editorAddCheck = true;

            if(selectedDecor == null)
            {
                for(let i = 0; i < decorEnts.length; i++)
                {
                    decorHandleTr = tr(decorEnts[i].p.subtract(vec2(decorHandleSize/2, decorHandleSize/2)),
                        vec2(decorHandleSize, decorHandleSize));
                    decorHandleTouchIndex = touched(decorHandleTr, 1.0);

                    if(decorHandleTouchIndex > -1)
                    {
                        selectedDecor = decorEnts[i];
                        selectedDecorIndex = i;
                        editorSelectionCurrentDelay = editorSelectionDelay;
                        return;
                    }
                }
            }
            else
            {
                if(editorMode == 0)
                {
                    selectedDecor.p = decorEnts[selectedDecorIndex].p = touchPos[0];
                }
                else if(editorMode == 2)
                {
                    selectedDecor.id = currentEntityType;
                    selectedDecor.setIDProperties();
                    decorHandleTouchIndex = -1;
                    selectedDecor = null;
                    lastSelectedDecorIndex = -1;
                    selectedDecorIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }
                else if(editorMode == -1)
                {
                    decorHandleTouchIndex = -1;
                    selectedDecor = null;
                    lastSelectedDecorIndex = selectedDecorIndex;
                    selectedDecorIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }

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
        else if(editorMode == 1)
        {
            if(isTouched)
            {
                if(!editorAddCheck)
                {
                    decor.add(touchPos[0].x, touchPos[0].y, currentEntityType);
                    editorAddCheck = true;
                }
            }
            else
            {
                editorAddCheck = false;
            }
        }
    }
}

function itemHandleEvents(itemEnts, offset)
{
    var oldType = currentEntityType;
    currentEntityType += (wheelScroll != 0 ? (wheelScroll > 0 ? 1 : -1) : 0);

    if(keysDown.indexOf(editorTypeIncKey) != -1) {
        if(!isKeyPressed(editorTypeIncKey)) currentEntityType++; }
    else
        removeKeyPressed(editorTypeIncKey);
    
    if(keysDown.indexOf(editorTypeDecKey) != -1) {
        if(!isKeyPressed(editorTypeDecKey)) currentEntityType--; }
    else
        removeKeyPressed(editorTypeDecKey);

    if(oldType != currentEntityType)
        switchTabAccordingToType(currentEntityType - oldType);

    //if(currentEntityType >= itemStartType + itemTotalTypes) currentEntityType = itemStartType;
    //else if(currentEntityType < itemStartType) currentEntityType = itemStartType + itemTotalTypes - 1;

    if(editorMode == -1)
    {
        if(lastSelectedItemIndex >= 0 && lastSelectedItemIndex < items.ents.length)
        {
            removeEntity(items.ents[lastSelectedItemIndex]);
            items.ents.splice(lastSelectedItemIndex, 1);
        }
        lastSelectedItemIndex = -1;
    }

    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(editorMode == 0 || editorMode == -1 || editorMode == 2)
        {
            editorAddCheck = true;

            if(selectedItem == null)
            {
                for(let i = 0; i < itemEnts.length; i++)
                {
                    itemHandleTr = tr(itemEnts[i].p.subtract(vec2(itemHandleSize/2, itemHandleSize/2)),
                        vec2(itemHandleSize, itemHandleSize));
                    itemHandleTouchIndex = touched(itemHandleTr, 1.0);

                    if(itemHandleTouchIndex > -1)
                    {
                        selectedItem = itemEnts[i];
                        selectedItemIndex = i;
                        editorSelectionCurrentDelay = editorSelectionDelay;
                        return;
                    }
                }
            }
            else
            {
                if(editorMode == 0)
                {
                    selectedItem.p = itemEnts[selectedItemIndex].p = touchPos[0];
                }
                else if(editorMode == 2)
                {
                    selectedItem.id = currentEntityType;
                    selectedItem.setIDProperties();
                    itemHandleTouchIndex = -1;
                    selectedItem = null;
                    lastSelectedItemIndex = -1;
                    selectedItemIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }
                else if(editorMode == -1)
                {
                    itemHandleTouchIndex = -1;
                    selectedItem = null;
                    lastSelectedItemIndex = selectedItemIndex;
                    selectedItemIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }

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
        else if(editorMode == 1)
        {
            if(isTouched)
            {
                if(!editorAddCheck)
                {
                    items.add(touchPos[0].x, touchPos[0].y, currentEntityType);
                    editorAddCheck = true;
                }
            }
            else
            {
                editorAddCheck = false;
            }
        }
    }
}

function enemyHandleEvents(enemyEnts, offset)
{
    var oldType = currentEntityType;
    currentEntityType += (wheelScroll != 0 ? (wheelScroll > 0 ? 1 : -1) : 0);

    if(keysDown.indexOf(editorTypeIncKey) != -1) {
        if(!isKeyPressed(editorTypeIncKey)) currentEntityType++; }
    else
        removeKeyPressed(editorTypeIncKey);
    
    if(keysDown.indexOf(editorTypeDecKey) != -1) {
        if(!isKeyPressed(editorTypeDecKey)) currentEntityType--; }
    else
        removeKeyPressed(editorTypeDecKey);

    if(oldType != currentEntityType)
        switchTabAccordingToType(currentEntityType - oldType);

    //if(currentEntityType >= enemyStartType + enemyTotalTypes) currentEntityType = enemyStartType;
    //else if(currentEntityType < enemyStartType) currentEntityType = enemyStartType + enemyTotalTypes - 1;

    if(editorMode == -1)
    {
        if(lastSelectedEnemyIndex >= 0 && lastSelectedEnemyIndex < enemies.ents.length)
        {
            removeEntity(enemies.ents[lastSelectedEnemyIndex]);
            enemies.ents.splice(lastSelectedEnemyIndex, 1);
        }
        lastSelectedEnemyIndex = -1;
    }

    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(editorMode == 0 || editorMode == -1 || editorMode == 2)
        {
            editorAddCheck = true;

            if(selectedEnemy == null)
            {
                for(let i = 0; i < enemyEnts.length; i++)
                {
                    enemyHandleTr = tr(enemyEnts[i].p.subtract(vec2(enemyHandleSize/2, enemyHandleSize/2)),
                        vec2(enemyHandleSize, enemyHandleSize));
                    enemyHandleTouchIndex = touched(enemyHandleTr, 1.0);

                    if(enemyHandleTouchIndex > -1)
                    {
                        selectedEnemy = enemyEnts[i];
                        selectedEnemyIndex = i;
                        editorSelectionCurrentDelay = editorSelectionDelay;
                        return;
                    }
                }
            }
            else
            {
                if(editorMode == 0)
                {
                    selectedEnemy.p = enemyEnts[selectedEnemyIndex].p = touchPos[0];
                }
                else if(editorMode == 2)
                {
                    selectedEnemy.id = currentEntityType;
                    selectedEnemy.setIDProperties();
                    enemyHandleTouchIndex = -1;
                    selectedEnemy = null;
                    lastSelectedEnemyIndex = -1;
                    selectedEnemyIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }
                else if(editorMode == -1)
                {
                    enemyHandleTouchIndex = -1;
                    selectedEnemy = null;
                    lastSelectedEnemyIndex = selectedEnemyIndex;
                    selectedEnemyIndex = -1;
                    editorSelectionCurrentDelay = editorSelectionDelay;
                }

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
        else if(editorMode == 1)
        {
            if(isTouched)
            {
                if(!editorAddCheck)
                {
                    enemies.add(touchPos[0].x, touchPos[0].y, currentEntityType);
                    editorAddCheck = true;
                }
            }
            else
            {
                editorAddCheck = false;
            }
        }
    }
}

function sectorHandleEvents(activeSector, walls, offset)
{
    var oldType = currentWallType;
    currentWallType += (wheelScroll != 0 ? (wheelScroll > 0 ? 1 : -1) : 0);

    if(keysDown.indexOf(editorTypeIncKey) != -1) {
        if(!isKeyPressed(editorTypeIncKey)) currentWallType++; }
    else
        removeKeyPressed(editorTypeIncKey);
    
    if(keysDown.indexOf(editorTypeDecKey) != -1) {
        if(!isKeyPressed(editorTypeDecKey)) currentWallType--; }
    else
        removeKeyPressed(editorTypeDecKey);

    if(oldType != currentWallType)
        switchTabAccordingToType(currentWallType - oldType);

    //if(currentWallType >= wallImages.length) currentWallType = 0;
    //else if(currentWallType <= -1) currentWallType = wallImages.length - 1;

    if(editorSelectionCurrentDelay > 0)
    {
        editorSelectionCurrentDelay--;
    }
    else
    {
        if(editorMode != 0)
        {
            editorAddCheck = true;

            if(selectedWall == null)
            {
                for(let i = 0; i < walls.length; i++)
                {
                    wallHandleTr = tr(lerpVec2(walls[i].p1, walls[i].p2, 0.5)
                        .subtract(vec2(wallHandleSize/2, wallHandleSize/2)),
                        vec2(wallHandleSize, wallHandleSize));
                    wallHandleTouchIndex = touched(wallHandleTr, 1.0);

                    if(wallHandleTouchIndex > -1)
                    {
                        editorSelectionCurrentDelay = editorSelectionDelay;
                        if(editorMode == -1 || editorMode == 1)
                        {
                            if(isWallInActiveSector(walls[i]))
                                deleteWallFromActiveSector(walls[i]);
                            else
                                addWallToSector(walls[i]);
                        }
                        else if(editorMode == 2)
                        {
                            walls[i].type = currentWallType;
                        }
                        return;
                    }
                }
            }
        }
    }
}