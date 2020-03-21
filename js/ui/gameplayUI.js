
var showControlPanel = true;

const GAMEPLAYUI = 1;
var minFPS = 99999;
var maxFPS = 0;

var gameplayUI = [];

var toolTipTitle,tooltipLabel;

function setupGameplayUI()
{
    gameplayUI.push(new TextButton(
        tr(vec2AV(0.025, 0.025, squareBtnSize, 1), squareBtnSize),
        new Label(tr(), "X"),
        new Button(),"Click here to exit the level editor\nand play the game fullscreen."));

    wallEditorObjects = [];
    wallAddBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Add"),undefined,"Click to insert another\nof the selected type.");
    wallEditorObjects.push(wallAddBtn);
    wallDelBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Delete Last Selected"),undefined,"Click this button to delete\nthe previously added entity.");
    wallEditorObjects.push(wallDelBtn);
    wallTypeSlider = new Slider(tr(vec2(), sliderSize), vec2(0, wallImages.length - 1), new Label(tr(), "Type", undefined, undefined, -1, "Select a wall type"), 4, currentWallType, sliderKnobSize, undefined, undefined, undefined, undefined, undefined, "This slider\nselects a wall type");
    wallEditorObjects.push(wallTypeSlider);
    wallSnapBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Snap"),undefined,"Toggle grid snap\non or off, for alignment.");
    wallEditorObjects.push(wallSnapBtn);
    wallDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"), new Button(tr(), "#992222"),"Delete all entities\nof the current type.");
    wallEditorObjects.push(wallDelAllBtn);

    areasEditorObjects = [];
    areaPaddingSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 20), new Label(tr(), "Padding", undefined, undefined, -1), 40, areaPadding, sliderKnobSize);
    areasEditorObjects.push(areaPaddingSlider);
    areaAddBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Add"),undefined,"Click to spawn a new entity\nof the current type.");
    areasEditorObjects.push(areaAddBtn);
    areaDelBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Delete Last Selected"),undefined,"Click this button to delete\nthe previously selected entity.");
    areasEditorObjects.push(areaDelBtn);
    areaTypeSlider = new Slider(tr(vec2(), sliderSize), vec2(0, 2), new Label(tr(), "Type", undefined, undefined, -1), 4, 0, sliderKnobSize);
    areasEditorObjects.push(areaTypeSlider);
    areaSnapBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "Snap"));
    areasEditorObjects.push(areaSnapBtn);
    areaDelAllBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "DELETE ALL"), new Button(tr(), "#992222"));
    areasEditorObjects.push(areaDelAllBtn);

    decorEditorObjects = [];
    decorEditorObjects.push(new TextButton(tr(vec2(), btnSize), new Label(tr(), "WIP"),undefined,"This area will contain\ndecorations you can place."));

    itemsEditorObjects = [];
    itemsEditorObjects.push(new TextButton(tr(vec2(), btnSize), new Label(tr(), "WIP"),undefined,"This area will contain\nitems you can place."));

    enemiesEditorObjects = [];
    enemiesEditorObjects.push(new TextButton(tr(vec2(), btnSize), new Label(tr(), "WIP"),undefined,"This area will contain\nenemies you can place."));

    cpEditTabs = [];
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), wallEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "WALLS"),undefined,"Click to switch into\nWALL EDITING MODE"), true, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), areasEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "AREAS"),undefined,"Click to switch into\nAREA EDITING MODE"), false, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), decorEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "DECOR."),undefined,"Click to switch into\nDECORATION EDITING MODE"), false, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), itemsEditorObjects, undefined,
        new TextButton(tr(), new Label(tr(), "ITEMS"),undefined,"Click to switch into\nITEM EDITING MODE"), false, "#024050", "#000000"));
    cpEditTabs.push(new Tab(tr(vec2(), tabSize), enemiesEditorObjects,
        [cpEditTabs[0], cpEditTabs[1], cpEditTabs[2], cpEditTabs[3]],
        new TextButton(tr(), new Label(tr(), "ENEMIES"),undefined,"Click to switch into\nENEMY EDITING MODE"), false, "#024050", "#000000"));

    cpEditObjects = [];
    toggleGridCheckbox = new FlexGroup( tr(vec2(), btnSize), new SubState(tr(), [
        new Label(tr(), "Grid",undefined,undefined,undefined,"Click to toggle grid\nsnapping ON/OFF for alignment."), new Checkbox(tr(), vec2(48, 10), undefined, showGrid, "#44bb44", "#bb4444")
        ]), false, vec2(5, 0), vec2(2, 1), true)
    cpEditObjects.push(toggleGridCheckbox);
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
    cpEditPanel.enabled = true;

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
    rayResetBtn = new TextButton(tr(vec2(), btnSize), new Label(tr(), "RESET"), new Button(tr(), "#992222"));
    rayRenderObjects.push(rayResetBtn);

    roofFloorRenderObjects = [];
    roofFloorTextureCheckbox = new FlexGroup( tr(vec2(), btnSize), new SubState(tr(), [
        new Label(tr(), "Texture"), new Checkbox(tr(), vec2(48, 10), undefined, roofFloorRenderTexture, "#44bb44", "#bb4444")
        ]), false, vec2(5, 0), vec2(2, 1), true);
    roofFloorRenderObjects.push(roofFloorTextureCheckbox);
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
    roofFloorRenderCheckbox = new FlexGroup( tr(vec2(), btnSize), new SubState(tr(), [
        new Label(tr(), "Render"), new Checkbox(tr(), vec2(48, 10), undefined, renderRoofFloor, "#44bb44", "#bb4444")
        ]), false, vec2(5, 0), vec2(2, 1), true)
    roofFloorRenderObjects.push(roofFloorRenderCheckbox);

    wallRenderObjects = [];
    wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(4, 64),
        new Label(tr(), "Height"), 60, wallHeightFactor, sliderKnobSize));
    wallRenderObjects.push(new FlexGroup( tr(vec2(), btnSize), new SubState(tr(), [
        new Label(tr(), "Texture"), new Checkbox(tr(), vec2(48, 10), undefined, wallRenderTexture, "#44bb44", "#bb4444")
        ]), false, vec2(5, 0), vec2(2, 1), true));
    wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(10, 1000),
        new Label(tr(), "Inclip"), 99, textureSize, sliderKnobSize));
    wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(100, 50000),
        new Label(tr(), "Stretch"), 4990, wallStretchFactor, sliderKnobSize));
    wallRenderObjects.push(new FlexGroup( tr(vec2(), btnSize), new SubState(tr(), [
        new Label(tr(), "Darkening"), new Checkbox(tr(), vec2(48, 10), undefined, wallDarkening, "#44bb44", "#bb4444")
        ]), false, vec2(5, 0), vec2(2, 1), true));
    wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0.0, 30.0),
        new Label(tr(), "Dark Factor"), 30.0, wallDarkeningFactor, sliderKnobSize));
    wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0.0, 80.0),
        new Label(tr(), "Dark Layers"), 80.0, wallDarkeningLayers, sliderKnobSize));
    wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(1.0, 10.0),
        new Label(tr(), "Dark Steps"), 18.0, wallDarkeningSteps, sliderKnobSize));
    wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0.0, 1.0),
        new Label(tr(), "Bright Thres."), 20.0, wallBrightnessThreshold, sliderKnobSize));
        wallRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0.0, 1.0),
        new Label(tr(), "Dark Thres."), 20.0, wallDarknessThreshold, sliderKnobSize));

    entRenderObjects = [];
    entRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0, 500),
        new Label(tr(), "Pos. Seg."), 100, entPosSegment, sliderKnobSize));
    entRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0, 500),
        new Label(tr(), "Scale F."), 100, entScaleFactor, sliderKnobSize));
    entRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0, 360),
        new Label(tr(), "Ang. Off."), 72, entAngleOffset, sliderKnobSize));
    entRenderObjects.push(new Slider(tr(vec2(), sliderSize), vec2(0, 10000),
        new Label(tr(), "X Off."), 10000, entXOffset, sliderKnobSize));

    cpRenderTabs = [];
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), rayRenderObjects, undefined,
        new TextButton(tr(), new Label(tr(), "RAYS"),undefined,"Debug stats toggle:\nShow RAYCASTING stats."), true, "#024050", "#000000"));
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), roofFloorRenderObjects, undefined,
        new TextButton(tr(), new Label(tr(), "RF./FL."),undefined,"Debug stats toggle:\nShow camera and rendering stats"), false, "#024050", "#000000"));
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), wallRenderObjects, undefined,
        new TextButton(tr(), new Label(tr(), "WALLS"),undefined,"Debug stats toggle:\nShow WALL stats."), false, "#024050", "#000000"));
    cpRenderTabs.push(new Tab(tr(vec2(), tabSize), entRenderObjects,
        [cpRenderTabs[0], cpRenderTabs[1], cpRenderTabs[2]],
        new TextButton(tr(), new Label(tr(), "ENT."),undefined,"Debug stats toggle:\nShow ENTITY stats."), false, "#024050", "#000000"));

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
    cpRenderPanel.enabled = false;
    
    cpStartObjects = [];
    cpStartObjects.push(new Tab(tr(vec2(), tabSize), [cpEditPanel], undefined, new TextButton(tr(), new Label(tr(), "Edit"),undefined,"Click to toggle the \nLEVEL EDITING menu."), true));
    cpStartObjects.push(new Tab(tr(vec2(), tabSize), [cpRenderPanel], [cpStartObjects[0]], new TextButton(tr(), new Label(tr(), "Render"),undefined,"Click to toggle the \nrendering STATS display.")));
    cpStartObjects.push(new FlexGroup(tr(vec2(), btnSize.add(btnSize)), new SubState(tr(), [
        new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Reset Pl. Pos."),undefined,"Click here to reset the\nplayer position to defaults."),
        new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Reload Level"),undefined,"Click here to discard changes\nand reload the lavel as last saved."),
        new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Save Level"),undefined,"Click here to download the\nlevel data to save locally."),
        new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Hide UI"),undefined,"Toggle the level editor\nGUI on or off."),
        new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "< Prev. Lv."),undefined,"Discard any recent changes\nand load the previous level."),
        new Label(tr(vec2(), btnSize), getLevelName()),
        new TextButton(tr(vec2(), btnSize), new Label(tr(vec2(), btnSize), "Next Lv. >"),undefined,"Discard any recent changes\nand load the next level.")
    ]), false, vec2(5, 5), vec2(4, 2), false));

    var tooltipSize = vec2(scrSizeFactor * 0.5, scrSizeFactor * 0.08);
    var tooltipLabelSize = vec2(scrSizeFactor * 0.5, scrSizeFactor * 0.05);
    var toolTipBackground = new TextButton(tr(vec2(),vec2(scrSizeFactor * 0.5, scrSizeFactor * 0.08)),undefined,undefined,"Welcome to the Mystic Chambers\nIn-game Level Editor!");
    toolTipTitle = new Label(tr(vec2(), tooltipLabelSize), "Welcome to the Mystic Chambers");
    toolTipLabel = new Label(tr(vec2(0, scrSizeFactor * 0.032), tooltipLabelSize), "In-game Level Editor!");
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

function showTooltip(txt) { // abstract tooltip called by ui.js
    if (!txt) {
        txt="FIXME: Missing tooltip!";
    }

    var parts = txt.split("\n");
    if (parts.length>1) {
        toolTipTitle.text = parts[0];
        parts.splice(0,1); // remove 1st line
        toolTipLabel.text = parts.join(""); // ALL the rest
    } else {
        toolTipTitle.text = "Click this button to";
        toolTipLabel.text = txt;
    }
}

function handleToolTips() {
    
    // FIXME these hardcoded array references are hard to maintain!
    // we have no idea what each control is... yuck...
    

    // temporary hack: find hardcoded references, TODO: put into the inits

    if (gameplayUI[0].button.output == UIOUTPUT_HOVER) {
        toolTipTitle.text = "Click this button to";
        toolTipLabel.text = "Toggle Map Mode ON/OFF";
    }

    if (cpStartObjects[2].subState.uiObjects[0].button.output == UIOUTPUT_HOVER) {
        toolTipTitle.text = "Click this button to";
        toolTipLabel.text = "Reset layer Start Position";
    }

    if (cpStartObjects[2].subState.uiObjects[1].button.output == UIOUTPUT_HOVER) {
        toolTipTitle.text = "Click this button to";
        toolTipLabel.text = "Reload the level data";
    }

    // no way to know what each does without trial and error
}

function gameplayUICustomEvents(deltaTime, wall, area)
{
    healthLabel.text = playerHealth.toString();

    //handleToolTips();

    controlPanel.enabled = mapMode;

    if (gameplayUI[0].button.output == UIOUTPUT_SELECT)
    {
        mapMode = !mapMode;
        if(platform != ANDROID) enableFullScreen(canvas);
        gameplayUI[0].button.resetOutput();
    }
    else if (cpStartObjects[2].subState.uiObjects[0].button.output == UIOUTPUT_SELECT)
    {
        for(let i = 0; i < ray.length; i++) ray[i].p = vec2(window.innerWidth/2, window.innerHeight/2);
        cpStartObjects[2].subState.uiObjects[0].button.resetOutput();
    }
    else if (cpStartObjects[2].subState.uiObjects[1].button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) wall.pop();
        while(area.length > 0) area.pop();
        loadLevel(wall, area);
        cpStartObjects[2].subState.uiObjects[1].button.resetOutput();
    }
    else if (cpStartObjects[2].subState.uiObjects[2].button.output == UIOUTPUT_SELECT)
    {
        writeFile(getLevelName(), convertWallsToString(wall) + convertAreasToString(area));
        cpStartObjects[2].subState.uiObjects[2].button.resetOutput();
    }
    else if (cpStartObjects[2].subState.uiObjects[3].button.output == UIOUTPUT_SELECT)
    {
        showControlPanel = !showControlPanel;
        cpStartObjects[0].enabled = cpStartObjects[1].enabled = cpEditPanel.enabled = cpRenderPanel.enabled = showControlPanel;
        for(let i = 0; i < 7; i++) { if(i==3) continue; cpStartObjects[2].subState.uiObjects[i].enabled = showControlPanel; }
        cpStartObjects[2].subState.uiObjects[3].label.text = showControlPanel ? "Hide UI" : "Show UI";

        cpStartObjects[2].subState.uiObjects[3].button.resetOutput();
    }
    else if (cpStartObjects[2].subState.uiObjects[4].button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) wall.pop();
        while(area.length > 0) area.pop();
        currentLevel--;
        if(currentLevel <= 0) currentLevel = totalLevels;
        loadLevel(wall, area);
        cpStartObjects[2].subState.uiObjects[5].text = getLevelName();
        cpStartObjects[2].subState.uiObjects[4].button.resetOutput();
    }
    else if (cpStartObjects[2].subState.uiObjects[6].button.output == UIOUTPUT_SELECT)
    {
        while(wall.length > 0) wall.pop();
        while(area.length > 0) area.pop();
        currentLevel++;
        if(currentLevel >= totalLevels + 1) currentLevel = 1;
        loadLevel(wall, area);
        cpStartObjects[2].subState.uiObjects[5].text = getLevelName();
        cpStartObjects[2].subState.uiObjects[6].button.resetOutput();
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

    showGrid = toggleGridCheckbox.subState.uiObjects[1].check;

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

   wallHeightFactor = wallRenderObjects[0].knobValue;
   wallRenderObjects[0].label.text = "Height " + wallRenderObjects[0].knobValue;

   wallRenderTexture = wallRenderObjects[1].subState.uiObjects[1].check;

   textureSize = wallRenderObjects[2].knobValue;
   wallRenderObjects[2].label.text = "Inclip " + wallRenderObjects[2].knobValue;

   wallStretchFactor = wallRenderObjects[3].knobValue;
   wallRenderObjects[3].label.text = "Stretch " + wallRenderObjects[3].knobValue;

   wallDarkening = wallRenderObjects[4].subState.uiObjects[1].check;

   wallDarkeningFactor = wallRenderObjects[5].knobValue;
   wallRenderObjects[5].label.text = "Dark Factor " + wallRenderObjects[5].knobValue;

   wallDarkeningLayers = wallRenderObjects[6].knobValue;
   wallRenderObjects[6].label.text = "Dark Layers " + wallRenderObjects[6].knobValue;

   wallDarkeningSteps = wallRenderObjects[7].knobValue;
   wallRenderObjects[7].label.text = "Dark Steps " + wallRenderObjects[7].knobValue;

   wallBrightnessThreshold = wallRenderObjects[8].knobValue;
   wallRenderObjects[8].label.text = "Bright Th. " + wallRenderObjects[8].knobValue;

   wallDarknessThreshold = wallRenderObjects[9].knobValue;
   wallRenderObjects[9].label.text = "Dark Th. " + wallRenderObjects[9].knobValue;

   roofFloorRenderTexture = roofFloorTextureCheckbox.subState.uiObjects[1].check;

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

   renderRoofFloor = roofFloorRenderCheckbox.subState.uiObjects[1].check;

   entPosSegment = entRenderObjects[0].knobValue;
   entRenderObjects[0].label.text = "Pos. Seg. " + entRenderObjects[0].knobValue;

   entScaleFactor = entRenderObjects[1].knobValue;
   entRenderObjects[1].label.text = "Scale F. " + entRenderObjects[1].knobValue;

   entAngleOffset = entRenderObjects[2].knobValue;
   entRenderObjects[2].label.text = "Ang. Off. " + entRenderObjects[2].knobValue;

   entXOffset = entRenderObjects[3].knobValue;
   entRenderObjects[3].label.text = "X Off. " + entRenderObjects[3].knobValue;

   if(currentGun >= 0) ammoLabel.text = ammoInGun[currentGun] + "/" + totalAmmo[currentGun];
   else ammoLabel.text = "0/0";
}