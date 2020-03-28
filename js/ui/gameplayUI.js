
var showControlPanel = true;

const GAMEPLAYUI = 1;
var minFPS = 99999;
var maxFPS = 0;

var gameplayUI = [];

var toolTipTitle, tooltipLabel;

function setupGameplayUI()
{
    wallEditorObjects = [];
    wallAddBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Add"),
        undefined,"Click to insert another\nof the selected type.");
    wallEditorObjects.push(wallAddBtn);
    wallDelBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Delete Last Selected"),
        undefined,"Click this button to delete\nthe previously added entity.");
    wallEditorObjects.push(wallDelBtn);
    wallTypeSlider = new Slider(tr(vec2(), sliderSize), vec2(0, wallImages.length - 1), new Label(tr(), "Type", undefined, undefined, -1, "Select a wall type"),
        4, currentWallType, sliderKnobSize, undefined, undefined, undefined, undefined, undefined, "This slider\nselects a wall type");
    wallEditorObjects.push(wallTypeSlider);
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
    areaAddBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Add"),
        undefined,"Click to spawn a new entity\nof the current type.");
    areasEditorObjects.push(areaAddBtn);
    areaDelBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Delete Last Selected"),
        undefined,"Click this button to delete\nthe previously selected entity.");
    areasEditorObjects.push(areaDelBtn);
    areaTypeSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 2), new Label(tr(), "Type", undefined, undefined, -1),
        4, 0, sliderKnobSize);
    areasEditorObjects.push(areaTypeSlider);
    areaSnapBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Snap"));
    areasEditorObjects.push(areaSnapBtn);
    areaDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"),
        new Button(tr(), "#992222"));
    areasEditorObjects.push(areaDelAllBtn);

    decorEditorObjects = [];
    decorEditorObjects.push(new TextButton(tr(vec2(), btnSize), new Label(tr(), "WIP"),
        undefined,"This area will contain\ndecorations you can place."));

    itemsEditorObjects = [];
    itemsEditorObjects.push(new TextButton(tr(vec2(), btnSize), new Label(tr(), "WIP"),
        undefined,"This area will contain\nitems you can place."));

    enemiesEditorObjects = [];
    enemiesEditorObjects.push(new TextButton(tr(vec2(), btnSize), new Label(tr(), "WIP"),
        undefined,"This area will contain\nenemies you can place."));

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
    toggleGridBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Grid " + showGrid ? "ON" : "OFF", undefined, showGrid ? "green" : "red"),
        undefined,"Click to toggle\neditor grid.");
    cpEditObjects.push(toggleGridBtn);
    gridSizeSlider = new Slider(tr(vec2(), sliderSize), vec2(10, 100), new Label(tr(),
        "Grid Size", undefined, undefined, -1), 18, gridCellSize, sliderKnobSize)
    cpEditObjects.push(gridSizeSlider);

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
        false, vec2(5, 5), vec2(1, 10));
    
    cpEditPanel = new Panel(
        tr(vec2(5, 60), panelSize), new SubState(tr(), [cpEditGrid]
        ), vec2(0, -100), vec2(0, 100));

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
    rayFishEyeSlider = new Slider(tr(vec2(), sliderSize), vec2(0.0, 5.0),
        new Label(tr(), "Fish Eye"), 50, fishEyeRemoveFactor, sliderKnobSize);
    rayRenderObjects.push(rayFishEyeSlider);
    rayFishEyeThresholdSlider = new Slider(tr(vec2(), sliderSize), vec2(0.0, 10.0),
        new Label(tr(), "Fish Eye Thr."), 40, fishEyeRemoveThreshold, sliderKnobSize);
    rayRenderObjects.push(rayFishEyeThresholdSlider);
    rayResetBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "RESET"),
        new Button(tr(), "#992222"));
    rayRenderObjects.push(rayResetBtn);

    roofFloorRenderObjects = [];
    roofFloorToggleTextureBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Texture " + roofFloorRenderTexture ? "ON" : "OFF", undefined, roofFloorRenderTexture ? "green" : "red"),
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
    roofFloorColor1Slider = new Slider(tr(vec2(), sliderSize), vec2(0, 255),
        new Label(tr(), "Color 1"), 255, colorDepthYG1, sliderKnobSize)
    roofFloorRenderObjects.push(roofFloorColor1Slider);
    roofFloorColor2Slider = new Slider(tr(vec2(), sliderSize), vec2(0, 255),
        new Label(tr(), "Color 2"), 255, colorDepthYG2, sliderKnobSize)
    roofFloorRenderObjects.push(roofFloorColor2Slider);
    roofFloorDepthStepSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 64),
        new Label(tr(), "Depth Step"), 64, depthYGStep, sliderKnobSize);
    roofFloorRenderObjects.push(roofFloorDepthStepSlider);
    roofFloorDepthThresholdSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 1),
        new Label(tr(), "Depth Thr."), 10, depthYGThreshold, sliderKnobSize);
    roofFloorRenderObjects.push(roofFloorDepthThresholdSlider);
    roofFloorToggleRenderBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Render " + renderRoofFloor ? "ON" : "OFF", undefined, renderRoofFloor ? "green" : "red"),
        undefined,"Click to toggle\nroof/floor rendering.");
    roofFloorRenderObjects.push(roofFloorToggleRenderBtn);

    wallRenderObjects = [];
    wallHeightSlider = new Slider(tr(vec2(), sliderSize), vec2(4, 64),
        new Label(tr(), "Height"), 60, wallHeightFactor, sliderKnobSize)
    wallRenderObjects.push(wallHeightSlider);
    wallToggleTextureBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Texture " + wallRenderTexture ? "ON" : "OFF", undefined, wallRenderTexture ? "green" : "red"),
        undefined,"Click to toggle\nwall textures.");
    wallRenderObjects.push(wallToggleTextureBtn);
    wallInclipSlider = new Slider(tr(vec2(), sliderSize), vec2(10, 1000),
        new Label(tr(), "Inclip"), 99, textureSize, sliderKnobSize);
    wallRenderObjects.push(wallInclipSlider);
    wallStretchSlider = new Slider(tr(vec2(), sliderSize), vec2(100, 50000),
        new Label(tr(), "Stretch"), 4990, wallStretchFactor, sliderKnobSize)
    wallRenderObjects.push(wallStretchSlider);
    wallToggleDarkenBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Darken " + wallDarkening ? "ON" : "OFF", undefined, wallDarkening ? "green" : "red"),
        undefined,"Click to toggle\nwall darkening effect.");
    wallRenderObjects.push(wallToggleDarkenBtn);
    wallDarkFactorSlider = new Slider(tr(vec2(), sliderSize), vec2(0.0, 30.0),
        new Label(tr(), "Dark Factor"), 30.0, wallDarkeningFactor, sliderKnobSize);
    wallRenderObjects.push(wallDarkFactorSlider);
    wallDarkLayersSlider = new Slider(tr(vec2(), sliderSize), vec2(0.0, 80.0),
        new Label(tr(), "Dark Layers"), 80.0, wallDarkeningLayers, sliderKnobSize);
    wallRenderObjects.push(wallDarkLayersSlider);
    wallDarkStepsSlider = new Slider(tr(vec2(), sliderSize), vec2(1.0, 10.0),
        new Label(tr(), "Dark Steps"), 18.0, wallDarkeningSteps, sliderKnobSize);
    wallRenderObjects.push(wallDarkStepsSlider);
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
                false, vec2(5, 5), vec2(1, 10))
        ]
        ), vec2(0, -100), vec2(0, 100));

    resetPosBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Reset Pl. Pos."),undefined,"Click here to reset the\nplayer position to defaults.");
    reloadLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Reload Level"),undefined,"Click here to discard changes\nand reload the lavel as last saved.");
    saveLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Save Level"),undefined,"Click here to download the\nlevel data to save locally.");
    hideUIBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Hide UI"),undefined,"Toggle the level editor\nGUI on or off.");
    prevLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "< Prev. Lv."),undefined,"Discard any recent changes\nand load the previous level.");
    lvLabel = new Label(tr(vec2(), btnSize), getLevelName());
    nextLvBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Next Lv. >"),undefined,"Discard any recent changes\nand load the next level.");
    
    cpStartObjects = [];
    cpStartObjects.push(new Tab(tr(vec2(), tabSize), [cpEditPanel], undefined, new TextButton(tr(), new Label(tr(), "Edit"),undefined,"Click to toggle the \nLEVEL EDITING menu.")));
    cpStartObjects.push(new Tab(tr(vec2(), tabSize), [cpRenderPanel], [cpStartObjects[0]], new TextButton(tr(), new Label(tr(), "Render"),undefined,"Click to toggle the \nrendering STATS display."), true));
    cpStartObjects.push(new FlexGroup(tr(vec2(), btnSize.add(btnSize)), new SubState(tr(), [
        resetPosBtn, reloadLvBtn, saveLvBtn, hideUIBtn, prevLvBtn, lvLabel, nextLvBtn ]), false, vec2(5, 5), vec2(4, 2), false));

    var tooltipSize = vec2(scrSizeFactor * 0.6, scrSizeFactor * 0.08);
    var tooltipLabelSize = vec2(scrSizeFactor * 0.6, scrSizeFactor * 0.05);
    var toolTipBackground = new TextButton(tr(vec2(),vec2(scrSizeFactor * 0.6, scrSizeFactor * 0.08)),undefined,undefined,"Welcome to the Mystic Chambers Level Editor!\nPress F11 to Toggle between Play and Editor");
    toolTipTitle = new Label(tr(vec2(), tooltipLabelSize), "Welcome to the Mystic Chambers Level Editor!");
    toolTipLabel = new Label(tr(vec2(0, scrSizeFactor * 0.032), tooltipLabelSize), "Press F11 to Toggle between Play and Editor");
    cpStartObjects.push(new SubState(tr(), [toolTipBackground,toolTipTitle,toolTipLabel]));

    controlPanel = new SubState(tr(vec2(), vec2(window.innerWidth, window.innerHeight)),
        [
        new FlexGroup(
            tr(vec2(5, 5), vec2(window.innerWidth, 50)), 
            new SubState(tr(), cpStartObjects),
            false, vec2(10, 0), vec2(10, 1), false),
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

function gameplayUICustomEvents(deltaTime, wall, area)
{
    healthLabel.text = playerHealth.toString();

    //handleToolTips();

    controlPanel.enabled = mapMode;

    if (toggleGridBtn.button.output == UIOUTPUT_SELECT)
    {
        showGrid = !showGrid;
        if(showGrid) { toggleGridBtn.label.text = "Grid ON"; toggleGridBtn.label.textColor = "green"; }
        else { toggleGridBtn.label.text = "Grid OFF"; toggleGridBtn.label.textColor = "red"; }
        toggleGridBtn.button.resetOutput();
    }
    else if (resetPosBtn.button.output == UIOUTPUT_SELECT)
    {
        for(let i = 0; i < ray.length; i++) ray[i].p = vec2(window.innerWidth/2, window.innerHeight/2);
        resetPosBtn.button.resetOutput();
    }
    else if (reloadLvBtn.button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) wall.pop();
        while(area.length > 0) area.pop();
        loadLevel(wall, area);
        reloadLvBtn.button.resetOutput();
    }
    else if (saveLvBtn.button.output == UIOUTPUT_SELECT)
    {
        writeFile(getLevelName(), convertWallsToString(wall) + convertAreasToString(area));
        saveLvBtn.button.resetOutput();
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
        while(wall.length > 0) wall.pop();
        while(area.length > 0) area.pop();
        currentLevel--;
        if(currentLevel <= 0) currentLevel = totalLevels;
        loadLevel(wall, area);
        lvLabel.text = getLevelName();
        prevLvBtn.button.resetOutput();
    }
    else if (nextLvBtn.button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) wall.pop();
        while(area.length > 0) area.pop();
        currentLevel++;
        if(currentLevel >= totalLevels + 1) currentLevel = 1;
        loadLevel(wall, area);
        lvLabel.text = getLevelName();
        nextLvBtn.button.resetOutput();
    }
    else if (wallAddBtn.button.output == UIOUTPUT_SELECT)
    {
        newWall = new Wall();
        newWall.set(ray[ray.length/2].p.x, ray[ray.length/2].p.y,
            ray[ray.length/2].p.x, ray[ray.length/2].p.y - gridCellSize);
        newWall.type = 0;
        wall.push(newWall);
        wallAddBtn.button.resetOutput();
    }
    else if (wallDelBtn.button.output == UIOUTPUT_SELECT)
    {
        if(lastSelectedWallIndex >= 0 && lastSelectedWallIndex < wall.length) wall.splice(lastSelectedWallIndex, 1);
        lastSelectedWallIndex = -1;
        wallDelBtn.button.resetOutput();
    }
    else if (wallSnapBtn.button.output == UIOUTPUT_SELECT)
    {
        snapWallsToGrid(wall, vec2(0, 0));
        wallSnapBtn.button.resetOutput();
    }
    else if (wallDelAllBtn.button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) wall.pop();
        wallDelAllBtn.button.resetOutput();
    }
    else if (areaAddBtn.button.output == UIOUTPUT_SELECT)
    {
        newArea = new Area(vec2(ray[ray.length/2].p.x, ray[ray.length/2].p.y),
            vec2(gridCellSize, gridCellSize), 0);
        area.push(newArea);
        areaAddBtn.button.resetOutput();
    }
    else if (areaDelBtn.button.output == UIOUTPUT_SELECT)
    {
        if(lastSelectedAreaIndex >= 0 && lastSelectedAreaIndex < area.length) area.splice(lastSelectedAreaIndex, 1);
        lastSelectedAreaIndex = -1;
        areaDelBtn.button.resetOutput();
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
        rayFishEyeSlider.knobValue = fishEyeRemoveFactor = 1.0;
        rayFishEyeThresholdSlider.knobValue = fishEyeRemoveThreshold = 1.0;

        rayResetBtn.button.resetOutput();
    }
    else if(roofFloorToggleTextureBtn.button.output == UIOUTPUT_SELECT)
    {
        roofFloorRenderTexture = !roofFloorRenderTexture;

        if(roofFloorRenderTexture) { roofFloorToggleTextureBtn.label.text = "Texture ON"; roofFloorToggleTextureBtn.label.textColor = "green"; }
        else { roofFloorToggleTextureBtn.label.text = "Texture OFF"; roofFloorToggleTextureBtn.label.textColor = "red"; }

        roofFloorToggleTextureBtn.button.resetOutput();
    }
    else if(roofFloorToggleRenderBtn.button.output == UIOUTPUT_SELECT)
    {
        renderRoofFloor = !renderRoofFloor;

        if(renderRoofFloor) { roofFloorToggleRenderBtn.label.text = "Render ON"; roofFloorToggleRenderBtn.label.textColor = "green"; }
        else { roofFloorToggleRenderBtn.label.text = "Render OFF"; roofFloorToggleRenderBtn.label.textColor = "red"; }

        roofFloorToggleRenderBtn.button.resetOutput();
    }
   else if(wallToggleTextureBtn.button.output == UIOUTPUT_SELECT)
   {
        wallRenderTexture = !wallRenderTexture;

        if(wallRenderTexture) { wallToggleTextureBtn.label.text = "Texture ON"; wallToggleTextureBtn.label.textColor = "green"; }
        else { wallToggleTextureBtn.label.text = "Texture OFF"; wallToggleTextureBtn.label.textColor = "red"; }

        wallToggleTextureBtn.button.resetOutput();
   }
   else if(wallToggleDarkenBtn.button.output == UIOUTPUT_SELECT)
   {
        wallDarkening = !wallDarkening;

        if(wallDarkening) { wallToggleDarkenBtn.label.text = "Darken ON"; wallToggleDarkenBtn.label.textColor = "green"; }
        else { wallToggleDarkenBtn.label.text = "Darken OFF"; wallToggleDarkenBtn.label.textColor = "red"; }

        wallToggleDarkenBtn.button.resetOutput();
   }

   gridCellSize = gridSizeSlider.knobValue;
   gridSizeSlider.label.text = "Grid Size " + gridSizeSlider.knobValue.toString();

   currentWallType = wallTypeSlider.knobValue;
   wallTypeSlider.label.text = "Type " + wallTypeSlider.knobValue.toString();
   if(selectedWallIndex > -1 && selectedWallIndex < wall.length) wall[selectedWallIndex].type = currentWallType; 

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

   fishEyeRemoveFactor = rayFishEyeSlider.knobValue;
   rayFishEyeSlider.label.text = "Fish Eye " + rayFishEyeSlider.knobValue;

   fishEyeRemoveThreshold = rayFishEyeThresholdSlider.knobValue;
   rayFishEyeThresholdSlider.label.text = "Fish Eye Th." + rayFishEyeThresholdSlider.knobValue;

   wallHeightFactor = wallHeightSlider.knobValue;
   wallHeightSlider.label.text = "Height " + wallHeightSlider.knobValue;

   textureSize = wallInclipSlider.knobValue;
   wallInclipSlider.label.text = "Inclip " + wallInclipSlider.knobValue;

   wallStretchFactor = wallStretchSlider.knobValue;
   wallStretchSlider.label.text = "Stretch " + wallStretchSlider.knobValue;

   wallDarkeningFactor = wallDarkFactorSlider.knobValue;
   wallDarkFactorSlider.label.text = "Dark Factor " + wallDarkFactorSlider.knobValue;

   wallDarkeningLayers = wallDarkLayersSlider.knobValue;
   wallDarkLayersSlider.label.text = "Dark Layers " + wallDarkLayersSlider.knobValue;

   wallDarkeningSteps = wallDarkStepsSlider.knobValue;
   wallDarkStepsSlider.label.text = "Dark Steps " + wallDarkStepsSlider.knobValue;

   wallBrightnessThreshold = wallBrightThresholdSlider.knobValue;
   wallBrightThresholdSlider.label.text = "Bright Th. " + wallBrightThresholdSlider.knobValue;

   wallDarknessThreshold = wallDarkThresholdSlider.knobValue;
   wallDarkThresholdSlider.label.text = "Dark Th. " + wallDarkThresholdSlider.knobValue;

   roofFloorPointSize = roofFloorPointSizeSlider.knobValue;
   roofFloorPointSizeSlider.label.text = "Point Size " + roofFloorPointSizeSlider.knobValue;

   FOV = roofFloorFOVSlider.knobValue;
   roofFloorFOVSlider.label.text = "FOV " + roofFloorFOVSlider.knobValue;

   farDist = roofFloorFarDistSlider.knobValue;
   roofFloorFarDistSlider.label.text = "Far Dist. " + roofFloorFarDistSlider.knobValue;

   nearDist = roofFloorNearDistSlider.knobValue;
   roofFloorNearDistSlider.label.text = "Near Dist. " + roofFloorNearDistSlider.knobValue;

   colorDepthYG1 = roofFloorColor1Slider.knobValue;
   roofFloorColor1Slider.label.text = "Color 1 " + roofFloorColor1Slider.knobValue;

   colorDepthYG2 = roofFloorColor2Slider.knobValue;
   roofFloorColor2Slider.label.text = "Color 2 " + roofFloorColor2Slider.knobValue;

   depthYGStep = roofFloorDepthStepSlider.knobValue;
   roofFloorDepthStepSlider.label.text = "Depth Step " + roofFloorDepthStepSlider.knobValue;

   depthYGThreshold = roofFloorDepthThresholdSlider.knobValue;
   roofFloorDepthThresholdSlider.label.text = "Depth Thr. " + roofFloorDepthThresholdSlider.knobValue;

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