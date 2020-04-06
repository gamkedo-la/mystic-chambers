
var showControlPanel = true;
var currentEditTabIndex = -1;

const GAMEPLAYUI = 1;
var minFPS = 99999;
var maxFPS = 0;

var gameplayUI = [];

var toolTipTitle, tooltipLabel;

var toggleONColor = "#88ff88";
var toggleOFFColor = "#ff4444";

function setupGameplayUI()
{
    wallEditorObjects = [];
    wallSnapBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Snap"),
        undefined,"Toggle grid snap\non or off, for alignment.");
    wallEditorObjects.push(wallSnapBtn);
    wallDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"),
        new Button(tr(), "#992222"),"Delete all entities\nof the current type.");
    wallEditorObjects.push(wallDelAllBtn);

    areasEditorObjects = [];
    areaPaddingSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 20), new Label(tr(), "Padding", undefined, undefined, -1),
        40, areaPadding, sliderKnobSize);
    areasEditorObjects.push(areaPaddingSlider);
    areaTypeSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 2), new Label(tr(), "Type", undefined, undefined, -1),
        4, 0, sliderKnobSize);
    areasEditorObjects.push(areaTypeSlider);
    areaSnapBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Snap"));
    areasEditorObjects.push(areaSnapBtn);
    areaDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"),
        new Button(tr(), "#992222"));
    areasEditorObjects.push(areaDelAllBtn);

    decorEditorObjects = [];

    decorDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"),
        new Button(tr(), "#992222"));
    decorEditorObjects.push(decorDelAllBtn);

    itemsEditorObjects = [];
    itemsDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"),
        new Button(tr(), "#992222"));
    itemsEditorObjects.push(itemsDelAllBtn);

    enemiesEditorObjects = [];
    enemiesDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"),
        new Button(tr(), "#992222"));
    enemiesEditorObjects.push(enemiesDelAllBtn);

    cpEditTabs = [];
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), wallEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "WALLS"),undefined,
        "Click to switch into\nWALL EDITING MODE"), true, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), areasEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "AREAS"),undefined,
        "Click to switch into\nAREA EDITING MODE"), false, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), decorEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "DECOR."),undefined,
        "Click to switch into\nDECORATION EDITING MODE"), false, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), itemsEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "ITEMS"),undefined,
        "Click to switch into\nITEM EDITING MODE"), false, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), enemiesEditorObjects,
        [cpEditTabs[0], cpEditTabs[1], cpEditTabs[2], cpEditTabs[3]],
        new TextButton(tr(), new Label(tr(), "ENEMIES"),undefined,
        "Click to switch into\nENEMY EDITING MODE"), false, "#024050", "#000000"));

    cpEditObjects = [];
    toggleGridBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Grid " + (showGrid ? "ON" : "OFF"), undefined, showGrid ? toggleONColor : toggleOFFColor),
        undefined,"Click to toggle\neditor grid.");
    cpEditObjects.push(toggleGridBtn);
    gridSizeSlider = new Slider(tr(vec2(), sliderSize), vec2(10, 100), new Label(tr(),
        "Grid Size", undefined, undefined, -1), 9, gridCellSize, sliderKnobSize);
    cpEditObjects.push(gridSizeSlider);
    editorModeBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Mode: MOVE", undefined, "cyan"),
        undefined,"Click to change editor mode:\nMOVE, DELETE or ADD.");
    cpEditObjects.push(editorModeBtn);
    fixBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Fix All", undefined),
        undefined,"Click to remove outside entities\nand set entities in appropriate sectors.");
    cpEditObjects.push(fixBtn);

    cpEditObjects.push(new FlexGroup(tr(vec2(), tabSize),
        new SubState(tr(), [cpEditTabs[0], cpEditTabs[1]]), false, vec2(5, 0), vec2(2, 1), true));
    cpEditObjects.push(new FlexGroup(tr(vec2(), tabSize),
        new SubState(tr(), [cpEditTabs[2], cpEditTabs[3]]), false, vec2(5, 0), vec2(2, 1), true));
    cpEditObjects.push(new FlexGroup(tr(vec2(), tabSize),
        new SubState(tr(), [cpEditTabs[4]]), false, vec2(5, 0), vec2(2, 1), true));

    cpEditObjects = pushArr(cpEditObjects, wallEditorObjects);
    cpEditObjects = pushArr(cpEditObjects, areasEditorObjects);
    cpEditObjects = pushArr(cpEditObjects, decorEditorObjects);
    cpEditObjects = pushArr(cpEditObjects, itemsEditorObjects);
    cpEditObjects = pushArr(cpEditObjects, enemiesEditorObjects);
    
    cpEditGrid = new FlexGroup(
        tr(vec2(10, 5), panelSize),
        new SubState(tr(), cpEditObjects),
        false, vec2(5, 5), vec2(1, 12));
    
    cpEditPanel = new Panel(
        tr(vec2(5, 60), panelSize), new SubState(tr(), [cpEditGrid]
        ), vec2(0, 60), vec2(0, 60));

    rayRenderObjects = [];

    rayFOVSlider = new Slider(tr(vec2(), sliderSize), vec2(10, 90),
        new Label(tr(), "FOV"), 16, rayRenderFOV, sliderKnobSize);
    rayRenderObjects.push(rayFOVSlider);
    rayAngleDiffSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 2),
        new Label(tr(), "Diff."), -1, rayAngleDiff, sliderKnobSize);
    rayRenderObjects.push(rayAngleDiffSlider);
    rayRegenerateBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Regenerate"));
    rayRenderObjects.push(rayRegenerateBtn);
    rayMaxDepthSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 1000),
        new Label(tr(), "Max D."), 1000, maxDepth, sliderKnobSize);
    rayRenderObjects.push(rayMaxDepthSlider);
    rayResetBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "RESET"),
        new Button(tr(), "#992222"));
    rayRenderObjects.push(rayResetBtn);

    roofFloorRenderObjects = [];

    roofFloorPerspectiveSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 2000), new Label(tr(),
    "Pers.", undefined, undefined, -1), 2000, document.body.style.perspective, sliderKnobSize);
    roofFloorRenderObjects.push(roofFloorPerspectiveSlider);
    floorHeightSlider = new Slider(tr(vec2(), sliderSize), vec2(1000, 6000), new Label(tr(),
    "Fl. H.", undefined, undefined, -1), 5000, floorHeight, sliderKnobSize);
    roofFloorRenderObjects.push(floorHeightSlider);

    roofFloorToggleTextureBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Texture " + (roofFloorRenderTexture ? "ON" : "OFF"), undefined, roofFloorRenderTexture ? toggleONColor : toggleOFFColor),
        undefined,"Click to toggle\nroof/floor textures.");
    roofFloorRenderObjects.push(roofFloorToggleTextureBtn);
    roofFloorPointSizeSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 50),
        new Label(tr(), "Point Size"), 50, roofFloorPointSize, sliderKnobSize);
    roofFloorRenderObjects.push(roofFloorPointSizeSlider);
    roofFloorFOVSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 180),
        new Label(tr(), "FOV"), 360, FOV, sliderKnobSize);
    roofFloorRenderObjects.push(roofFloorFOVSlider);
    roofFloorFarDistSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 100),
        new Label(tr(), "Far Dist."), 1000, farDist, sliderKnobSize);
    roofFloorRenderObjects.push(roofFloorFarDistSlider);
    roofFloorNearDistSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 1),
        new Label(tr(), "Near Dist."), 1000, nearDist, sliderKnobSize);
    roofFloorRenderObjects.push(roofFloorNearDistSlider);
    roofFloorToggleRenderBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Render " + (renderRoofFloor ? "ON" : "OFF"), undefined, renderRoofFloor ? toggleONColor : toggleOFFColor),
        undefined,"Click to toggle\nroof/floor rendering.");
    roofFloorRenderObjects.push(roofFloorToggleRenderBtn);

    wallRenderObjects = [];
    wallHeightSlider = new Slider(tr(vec2(), sliderSize), vec2(4, 64),
        new Label(tr(), "Height"), 60, wallHeightFactor, sliderKnobSize);
    wallRenderObjects.push(wallHeightSlider);
    wallToggleTextureBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Texture " + (wallRenderTexture ? "ON" : "OFF"), undefined, wallRenderTexture ? toggleONColor : toggleOFFColor),
        undefined,"Click to toggle\nwall textures.");
    wallRenderObjects.push(wallToggleTextureBtn);
    wallInclipSlider = new Slider(tr(vec2(), sliderSize), vec2(10, 1000),
        new Label(tr(), "Inclip"), 99, textureSize, sliderKnobSize);
    wallRenderObjects.push(wallInclipSlider);
    wallStretchSlider = new Slider(tr(vec2(), sliderSize), vec2(100, 50000),
        new Label(tr(), "Stretch"), 4990, wallStretchFactor, sliderKnobSize);
    wallRenderObjects.push(wallStretchSlider);
    wallToggleDarkenBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Darken " + (wallDarkening ? "ON" : "OFF"), undefined, wallDarkening ? toggleONColor : toggleOFFColor),
        undefined,"Click to toggle\nwall darkening effect.");
    wallRenderObjects.push(wallToggleDarkenBtn);
    wallBrightThresholdSlider = new Slider(tr(vec2(), sliderSize), vec2(0.0, 1.0),
        new Label(tr(), "Bright Thres."), 20.0, wallBrightnessThreshold, sliderKnobSize);
    wallRenderObjects.push(wallBrightThresholdSlider);
    wallDarkThresholdSlider = new Slider(tr(vec2(), sliderSize), vec2(0.0, 1.0),
        new Label(tr(), "Dark Thres."), 20.0, wallDarknessThreshold, sliderKnobSize);
    wallRenderObjects.push(wallDarkThresholdSlider);

    entRenderObjects = [];
    entPosSegmentSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 500),
        new Label(tr(), "Pos. Seg."), 100, entPosSegment, sliderKnobSize);
    entRenderObjects.push(entPosSegmentSlider);
    entScaleFactorSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 500),
        new Label(tr(), "Scale F."), 100, entScaleFactor, sliderKnobSize);
    entRenderObjects.push(entScaleFactorSlider);
    entAngleOffsetSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 360),
        new Label(tr(), "Ang. Off."), 72, entAngleOffset, sliderKnobSize);
    entRenderObjects.push(entAngleOffsetSlider);
    entXOffsetSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 10000),
        new Label(tr(), "X Off."), 10000, entXOffset, sliderKnobSize);
    entRenderObjects.push(entXOffsetSlider);

    cpRenderTabs = [];
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), rayRenderObjects, undefined,
        new TextButton(tr(), new Label(tr(), "RAYS"),undefined,"Debug stats toggle:\nShow RAYCASTING stats."),
        true, "#024050", "#000000"));
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), roofFloorRenderObjects, undefined,
        new TextButton(tr(), new Label(tr(), "RF./FL."),undefined,"Debug stats toggle:\nShow camera and rendering stats"),
        false, "#024050", "#000000"));
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), wallRenderObjects, undefined,
        new TextButton(tr(), new Label(tr(), "WALLS"),undefined,"Debug stats toggle:\nShow WALL stats."),
        false, "#024050", "#000000"));
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), entRenderObjects,
        [cpRenderTabs[0], cpRenderTabs[1], cpRenderTabs[2]],
        new TextButton(tr(), new Label(tr(), "ENT."),undefined,"Debug stats toggle:\nShow ENTITY stats."),
        false, "#024050", "#000000"));

    cpRenderObjects = [];
    fpsDisplayLabel = new Label(tr(), "FPS: 0/0/0");
    cpRenderObjects.push(fpsDisplayLabel);
    fpsResetBtn = new TextButton(tr(), new Label(tr(), "Reset FPS"),undefined,"Click here to reset the\nframerate stats so far.");
    cpRenderObjects.push(fpsResetBtn);

    cpRenderObjects.push(new FlexGroup(tr(vec2(), tabSize),
        new SubState(tr(), [cpRenderTabs[0], cpRenderTabs[1]]), false, vec2(5, 0), vec2(2, 1), true));
    cpRenderObjects.push(new FlexGroup(tr(vec2(), tabSize),
        new SubState(tr(), [cpRenderTabs[2], cpRenderTabs[3]]), false, vec2(5, 0), vec2(2, 1), true));

    cpRenderObjects = pushArr(cpRenderObjects, rayRenderObjects);
    cpRenderObjects = pushArr(cpRenderObjects, roofFloorRenderObjects);
    cpRenderObjects = pushArr(cpRenderObjects, wallRenderObjects);
    cpRenderObjects = pushArr(cpRenderObjects, entRenderObjects);

    cpRenderPanel = new Panel(
        tr(vec2(5, 60), panelSize), new SubState(tr(), [
            new FlexGroup(
                tr(vec2(10, 5), panelSize),
                new SubState(tr(), cpRenderObjects),
                false, vec2(5, 5), vec2(1, 12))
        ]
        ), vec2(0, 60), vec2(0, 60));

    resetPosBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Reset Pl. Pos."),undefined,"Click here to reset the\nplayer position to defaults.");
    reloadLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Reload Level"),undefined,"Click here to discard changes\nand reload the lavel as last saved.");
    saveLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Save Level"),undefined,"Click here to download the\nlevel data to save locally.");
    debugPlayBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Debug Play"),undefined,"Click to play in editor\nwithout pointer lock.");
    debugEntBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Debug Ent.", undefined, debugEntities ? "green" : "red"),undefined,"Click to enable entities in\nmap mode and debug play mode.");
    
    prevLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "< Prev. Lv."),undefined,"Discard any recent changes\nand load the previous level.");
    lvLabel = new Label(tr(vec2(), btnSize), getLevelName());
    nextLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Next Lv. >"),undefined,"Discard any recent changes\nand load the next level.");
    hideUIBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Hide UI"),undefined,"Toggle the level editor\nGUI on or off.");
    
    cpStartObjects = [];
    cpStartObjects.push(new Tab(tr(vec2(), tabSize), [cpEditPanel], undefined, new TextButton(tr(), new Label(tr(), "Edit"),undefined,"Click to toggle the \nLEVEL EDITING menu.")));
    cpStartObjects.push(new Tab(tr(vec2(), tabSize), [cpRenderPanel], [cpStartObjects[0]], new TextButton(tr(), new Label(tr(), "Render"),undefined,"Click to toggle the \nrendering STATS display."), true));
    cpStartObjects.push(new FlexGroup(tr(vec2(), btnSize.add(btnSize)), new SubState(tr(), [
        resetPosBtn, reloadLvBtn, saveLvBtn, debugPlayBtn, debugEntBtn, prevLvBtn, lvLabel, nextLvBtn, hideUIBtn ]), false, vec2(5, 5), vec2(5, 2), false));

    var tooltipLabelSize = vec2(scrSizeFactor * 0.6, scrSizeFactor * 0.05);
    var toolTipBackground = new TextButton(tr(vec2(),vec2(scrSizeFactor * 0.6, scrSizeFactor * 0.08)), undefined, undefined, "Welcome to the Mystic Chambers Level Editor!\nPress " + PLAY_BUTTON + " to Toggle between Play and Editor");
    toolTipTitle = new Label(tr(vec2(), tooltipLabelSize), "Welcome to the Mystic Chambers Level Editor!");
    toolTipLabel = new Label(tr(vec2(0, scrSizeFactor * 0.032), tooltipLabelSize), "Press F11 to Toggle between Play and Editor");

    controlPanel = new SubState(tr(vec2(), vec2(window.innerWidth, window.innerHeight)),
        [
        new FlexGroup(
            tr(vec2(5, 5), vec2(window.innerWidth, 100)), 
            new SubState(tr(), cpStartObjects),
            false, vec2(10, 0), vec2(10, 1), false),
        new SubState(tr(vec2AV(0.01, 0.01, vec2(scrSizeFactor * 0.6, scrSizeFactor * 0.08), ANCHOR_TOPRIGHT)), [toolTipBackground,toolTipTitle,toolTipLabel]),
        cpEditPanel,
        cpRenderPanel
        ]);

    gameplayUI.push(controlPanel);

    healthLabel = new Label(tr(vec2(), vec2(200, 60)), playerHealth.toString(), (scrSizeFactor * 0.08).toString() + "px Lucida, sans-serif");
   
    gameplayUI.push(
        new FlexGroup(
            tr(vec2(scrSizeFactor * -0.05, screen.height - 120), vec2(200, 80)),
            new SubState(tr(), [
                healthLabel,
                new Label(tr(vec2(), vec2(200, 20)), "HP", (scrSizeFactor * 0.04).toString() + "px Lucida, sans-serif")
            ]),
            true, vec2(0, 0), vec2(1, 2), false
        )
    );

    ammoLabel = new Label(tr(vec2(), vec2(200, 60)), "0/0", (scrSizeFactor * 0.08).toString() + "px Lucida, sans-serif");
    gameplayUI.push(
        new FlexGroup(
            tr(vec2(scrSizeFactor * 0.15, screen.height - 120), vec2(200, 80)),
            new SubState(tr(), [
                ammoLabel, new Label(tr(vec2(), vec2(200, 20)), "Ammo", (scrSizeFactor * 0.04).toString() + "px Lucida, sans-serif")
            ]),
            true, vec2(0, 0), vec2(1, 2), false
        )
    );

    if (platform == ANDROID)
    {
        gameplayUI.push(new TextButton(
            tr(vec2AV(0.2, 0.2, squareBtnSize, 3), squareBtnSize),
            new Label(tr(), "^")));
        gameplayUI.push(new TextButton(
            tr(vec2AV(0.2, 0.05, squareBtnSize, 3), squareBtnSize),
            new Label(tr(), "v")));
        gameplayUI.push(new TextButton(
            tr(vec2AV(0.0, 0.125, squareBtnSize, 3), squareBtnSize),
            new Label(tr(), "<")));
        gameplayUI.push(new TextButton(
            tr(vec2AV(0.4, 0.125, squareBtnSize, 3), squareBtnSize),
            new Label(tr(), ">")));
    }
}

function showTooltip(txt)
{ // abstract tooltip called by ui.js
    if (!txt)
    {
        txt="FIXME: Missing tooltip!";
    }

    var parts = txt.split("\n");
    if (parts.length>1)
    {
        toolTipTitle.text = parts[0];
        parts.splice(0,1); // remove 1st line
        toolTipLabel.text = parts.join(""); // ALL the rest
    }
    else
    {
        toolTipTitle.text = "Click this button to";
        toolTipLabel.text = txt;
    }
}

function handleToolTips()
{
    if (resetPosBtn.button.output == UIOUTPUT_HOVER)
    {
        toolTipTitle.text = "Click this button to";
        toolTipLabel.text = "Reset layer Start Position";
    }
    else if (reloadLvBtn.button.output == UIOUTPUT_HOVER)
    {
        toolTipTitle.text = "Click this button to";
        toolTipLabel.text = "Reload the level data";
    }
}

function getCurrentEditTabIndex()
{
    for(let i = 0; i < 5; i++)
        if(cpEditTabs[i].selector.selected) return i;

    return -1;
}

function gameplayUICustomEvents(deltaTime, wall, area)
{
    healthLabel.text = playerHealth.toString();

    //handleToolTips();

    controlPanel.enabled = mapMode;

    var tabIndex = getCurrentEditTabIndex();
    if(currentEditTabIndex != tabIndex)
    {
        currentEditTabIndex = tabIndex;

        if(currentEditTabIndex == 0) currentWallType = 0;
        else if(currentEditTabIndex == 1) currentAreaType = 0;
        else if(currentEditTabIndex == 2) currentEntityType = decorStartType;
        else if(currentEditTabIndex == 3) currentEntityType = itemStartType;
        else if(currentEditTabIndex == 4) currentEntityType = enemyStartType;
    }

    if (toggleGridBtn.button.output == UIOUTPUT_SELECT)
    {
        showGrid = !showGrid;
        if(showGrid) { toggleGridBtn.label.text = "Grid ON"; toggleGridBtn.label.textColor = toggleONColor; }
        else { toggleGridBtn.label.text = "Grid OFF"; toggleGridBtn.label.textColor = toggleOFFColor; }
        toggleGridBtn.button.resetOutput();
    }
    else if (editorModeBtn.button.output == UIOUTPUT_SELECT)
    {
        editorMode++;
        if(editorMode > 2) editorMode = -1;
        if(editorMode == -1)
        {
            editorModeBtn.label.text = "Mode: DELETE";
            lastSelectedWallIndex = lastSelectedAreaIndex
            = lastSelectedDecorIndex = lastSelectedItemIndex
            = lastSelectedEnemyIndex = -1;
        }
        else if(editorMode == 0) editorModeBtn.label.text = "Mode: MOVE";
        else if(editorMode == 1) editorModeBtn.label.text = "Mode: ADD";
        else if(editorMode == 2) editorModeBtn.label.text = "Mode: CHANGE";
        editorModeBtn.button.resetOutput();
    }
    else if (fixBtn.button.output == UIOUTPUT_SELECT)
    {
        resetWallIndexes();
        entitiesInSectorSet = [];
        setEntitiesInSectors();
        deleteEntitiesOutsideSector();
        decor.removeIfNotInEntities();
        items.removeIfNotInEntities();
        enemies.removeIfNotInEntities();
        fixBtn.button.resetOutput();
    }
    else if (resetPosBtn.button.output == UIOUTPUT_SELECT)
    {
        for(let i = 0; i < ray.length; i++) ray[i].p = vec2(window.innerWidth/2, window.innerHeight/2);
        resetPosBtn.button.resetOutput();
    }
    else if (reloadLvBtn.button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) { deleteWallFromAllSectors(wall[wall.length - 1]); wall.pop(); }
        while(area.length > 0) area.pop();
        activeSector = undefined;
        loadLevel(wall, area);
        reloadLvBtn.button.resetOutput();
    }
    else if (saveLvBtn.button.output == UIOUTPUT_SELECT)
    {
        writeFile(getLevelName(), convertWallsToString(wall) + convertAreasToString(area));
        saveLvBtn.button.resetOutput();
    }
    else if (debugPlayBtn.button.output == UIOUTPUT_SELECT)
    {
        renderEditorAndGameTogether++;
        if(renderEditorAndGameTogether >= 4) renderEditorAndGameTogether = 0;

        debugPlayBtn.button.resetOutput();
    }
    else if (debugEntBtn.button.output == UIOUTPUT_SELECT)
    {
        debugEntities = !debugEntities;
        debugEntBtn.label.textColor = debugEntities ? toggleONColor : toggleOFFColor;

        debugEntBtn.button.resetOutput();
    }
    else if (hideUIBtn.button.output == UIOUTPUT_SELECT)
    {
        showControlPanel = !showControlPanel;
        cpStartObjects[0].enabled = cpStartObjects[1].enabled
        = cpEditPanel.enabled = cpRenderPanel.enabled = showControlPanel;
        for(let i = 0; i < 7; i++) { if(i==3) continue; cpStartObjects[2].subState.uiObjects[i].enabled = showControlPanel; }
        hideUIBtn.label.text = showControlPanel ? "Hide UI" : "Show UI";

        hideUIBtn.button.resetOutput();
    }
    else if (prevLvBtn.button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) { deleteWallFromAllSectors(wall[wall.length - 1]); wall.pop(); }
        while(area.length > 0) area.pop();
        activeSector = undefined;
        currentLevel--;
        if(currentLevel <= 0) currentLevel = totalLevels;
        loadLevel(wall, area);
        lvLabel.text = getLevelName();
        prevLvBtn.button.resetOutput();
    }
    else if (nextLvBtn.button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) { deleteWallFromAllSectors(wall[wall.length - 1]); wall.pop(); }
        while(area.length > 0) area.pop();
        activeSector = undefined;
        currentLevel++;
        if(currentLevel >= totalLevels + 1) currentLevel = 1;
        loadLevel(wall, area);
        lvLabel.text = getLevelName();
        nextLvBtn.button.resetOutput();
    }
    else if (wallSnapBtn.button.output == UIOUTPUT_SELECT)
    {
        snapWallsToGrid(wall, vec2(0, 0));
        snapWallsToGrid(wall, vec2(0, 0));
        wallSnapBtn.button.resetOutput();
    }
    else if (wallDelAllBtn.button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) { deleteWallFromAllSectors(wall[wall.length - 1]); wall.pop(); }
        activeSector = undefined;
        wallDelAllBtn.button.resetOutput();
    }
    else if (areaSnapBtn.button.output == UIOUTPUT_SELECT)
    {
        snapAreasToGrid(area, vec2(0, 0));
        areaSnapBtn.button.resetOutput();
    }
    else if (areaDelAllBtn.button.output == UIOUTPUT_SELECT)
    {
        while(area.length > 0) area.pop();
        area = new Array();
        areaDelAllBtn.button.resetOutput();
    }
    else if (decorDelAllBtn.button.output == UIOUTPUT_SELECT)
    {
        while(decor.ents.length > 0)
        {
            removeEntity(decor.ents[decor.ents.length - 1]);
            decor.ents.pop();
        }
        decor.ents = new Array();
        decorDelAllBtn.button.resetOutput();
    }
    else if (itemsDelAllBtn.button.output == UIOUTPUT_SELECT)
    {
        while(items.ents.length > 0)
        {
            removeEntity(items.ents[items.ents.length - 1]);
            items.ents.pop();
        }
        items.ents = new Array();
        itemsDelAllBtn.button.resetOutput();
    }
    else if (enemiesDelAllBtn.button.output == UIOUTPUT_SELECT)
    {
        while(enemies.ents.length > 0)
        {
            removeEntity(enemies.ents[enemies.ents.length - 1]);
            enemies.ents.pop();
        }
        enemies.ents = new Array();
        enemiesDelAllBtn.button.resetOutput();
    }
    else if(fpsResetBtn.button.output == UIOUTPUT_SELECT)
    {
        maxFPS = 0;
        minFPS = 99999;
        cpRenderObjects[1].button.resetOutput();
    }
    else if(rayRegenerateBtn.button.output == UIOUTPUT_SELECT)
    {
        pos = vec2(ray[ray.length/2].p.x, ray[ray.length/2].p.y);

        ray = [];
        for (let i = -rayRenderFOV; i < 0.0; i += rayAngleDiff)
            ray.push(new Ray(pos, i));
        
        rayRegenerateBtn.button.resetOutput();
    }
    else if(rayResetBtn.button.output == UIOUTPUT_SELECT)
    {
        rayFOVSlider.knobValue = rayRenderFOV = platform == ANDROID ? 30.0 : 45.0;
        rayAngleDiffSlider.knobValue = rayAngleDiff = platform == ANDROID ? 0.5 : 0.25;
        rayMaxDepthSlider.knobValue = maxDepth = 250.0;

        rayResetBtn.button.resetOutput();
    }
    else if(roofFloorToggleTextureBtn.button.output == UIOUTPUT_SELECT)
    {
        roofFloorRenderTexture = !roofFloorRenderTexture;

        if(roofFloorRenderTexture) { roofFloorToggleTextureBtn.label.text = "Texture ON"; roofFloorToggleTextureBtn.label.textColor = toggleONColor; }
        else { roofFloorToggleTextureBtn.label.text = "Texture OFF"; roofFloorToggleTextureBtn.label.textColor = toggleOFFColor; }

        roofFloorToggleTextureBtn.button.resetOutput();
    }
    else if(roofFloorToggleRenderBtn.button.output == UIOUTPUT_SELECT)
    {
        renderRoofFloor = !renderRoofFloor;

        if(renderRoofFloor) { roofFloorToggleRenderBtn.label.text = "Render ON"; roofFloorToggleRenderBtn.label.textColor = toggleONColor; }
        else { roofFloorToggleRenderBtn.label.text = "Render OFF"; roofFloorToggleRenderBtn.label.textColor = toggleOFFColor; }

        roofFloorToggleRenderBtn.button.resetOutput();
    }
   else if(wallToggleTextureBtn.button.output == UIOUTPUT_SELECT)
   {
        wallRenderTexture = !wallRenderTexture;

        if(wallRenderTexture) { wallToggleTextureBtn.label.text = "Texture ON"; wallToggleTextureBtn.label.textColor = toggleONColor; }
        else { wallToggleTextureBtn.label.text = "Texture OFF"; wallToggleTextureBtn.label.textColor = toggleOFFColor; }

        wallToggleTextureBtn.button.resetOutput();
   }
   else if(wallToggleDarkenBtn.button.output == UIOUTPUT_SELECT)
   {
        wallDarkening = !wallDarkening;

        if(wallDarkening) { wallToggleDarkenBtn.label.text = "Darken ON"; wallToggleDarkenBtn.label.textColor = toggleONColor; }
        else { wallToggleDarkenBtn.label.text = "Darken OFF"; wallToggleDarkenBtn.label.textColor = toggleOFFColor; }

        wallToggleDarkenBtn.button.resetOutput();
   }

   gridCellSize = gridSizeSlider.knobValue;
   gridSizeSlider.label.text = "Grid Size " + gridSizeSlider.knobValue.toString();

   areaPadding = areaPaddingSlider.knobValue;
   areaPaddingSlider.label.text = "Padding " + areaPaddingSlider.knobValue;

   currentAreaType = areaTypeSlider.knobValue;
   areaTypeSlider.label.text = "Type " + areaTypeSlider.knobValue;
   if(selectedAreaIndex > -1 && selectedAreaIndex < area.length) area[selectedAreaIndex].type = currentAreaType; 

   fps = Math.floor(1000.0/deltaTime);
   minFPS = minFPS > fps ? fps : minFPS;
   maxFPS = maxFPS < fps ? fps : maxFPS;
   fpsDisplayLabel.text = "FPS: " + minFPS.toString() + "/" + fps + "/" + maxFPS.toString();

   rayRenderFOV = rayFOVSlider.knobValue;
   rayFOVSlider.label.text = "FOV " + rayFOVSlider.knobValue;

   rayAngleDiff = rayAngleDiffSlider.knobValue;
   rayAngleDiffSlider.label.text = "Diff. " + Math.floor(rayAngleDiffSlider.knobValue*100)/100;

   maxDepth = rayMaxDepthSlider.knobValue;
   rayMaxDepthSlider.label.text = "Max D. " + rayMaxDepthSlider.knobValue;

   wallHeightFactor = wallHeightSlider.knobValue;
   wallHeightSlider.label.text = "Height " + wallHeightSlider.knobValue;

   textureSize = wallInclipSlider.knobValue;
   wallInclipSlider.label.text = "Inclip " + wallInclipSlider.knobValue;

   wallStretchFactor = wallStretchSlider.knobValue;
   wallStretchSlider.label.text = "Stretch " + wallStretchSlider.knobValue;

   wallBrightnessThreshold = wallBrightThresholdSlider.knobValue;
   wallBrightThresholdSlider.label.text = "Bright Th. " + wallBrightThresholdSlider.knobValue;

   wallDarknessThreshold = wallDarkThresholdSlider.knobValue;
   wallDarkThresholdSlider.label.text = "Dark Th. " + wallDarkThresholdSlider.knobValue;

   if(roofFloorPerspectiveSlider.knobValue.toString().length >= 0)
        document.body.style.perspective = roofFloorPerspectiveSlider.knobValue.toString() + "px";
    else
    {
        roofFloorPerspectiveSlider.knobValue = parseInt(document.body.style.perspective.replace("px", ""));
        roofFloorPerspectiveSlider.startKnobValueSet = 10;
    }
    
   roofFloorPerspectiveSlider.label.text = "Pers. " + roofFloorPerspectiveSlider.knobValue;

   floorHeight = floorHeightSlider.knobValue;
   floorHeightSlider.label.text = "Fl. H. " + floorHeightSlider.knobValue;

   roofFloorPointSize = roofFloorPointSizeSlider.knobValue;
   roofFloorPointSizeSlider.label.text = "Point Size " + roofFloorPointSizeSlider.knobValue;

   FOV = roofFloorFOVSlider.knobValue;
   roofFloorFOVSlider.label.text = "FOV " + roofFloorFOVSlider.knobValue;

   farDist = roofFloorFarDistSlider.knobValue;
   roofFloorFarDistSlider.label.text = "Far Dist. " + roofFloorFarDistSlider.knobValue;

   nearDist = roofFloorNearDistSlider.knobValue;
   roofFloorNearDistSlider.label.text = "Near Dist. " + roofFloorNearDistSlider.knobValue;

   entPosSegment = entPosSegmentSlider.knobValue;
   entPosSegmentSlider.label.text = "Pos. Seg. " + entPosSegmentSlider.knobValue;

   entScaleFactor = entScaleFactorSlider.knobValue;
   entScaleFactorSlider.label.text = "Scale F. " + entScaleFactorSlider.knobValue;

   entAngleOffset = entAngleOffsetSlider.knobValue;
   entAngleOffsetSlider.label.text = "Ang. Off. " + entAngleOffsetSlider.knobValue;

   entXOffset = entXOffsetSlider.knobValue;
   entXOffsetSlider.label.text = "X Off. " + entXOffsetSlider.knobValue;

   if(currentGun >= 0) ammoLabel.text = ammoInGun[currentGun] + "/" + totalAmmo[currentGun];
   else ammoLabel.text = "0/0";
}