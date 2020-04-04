const PLAY_BUTTON = '1';
const EDITOR_BG_COLOUR = "black"; //"rgba(0,0,0,0.2)"; // could be partially transparent

renderEditorAndGameTogether = 0;
debugEntities = false;

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


window.onload = function()
{
    canvas = document.getElementById("gameCanvas");
    renderer = canvas.getContext("2d");
    renderer.canvas.width = window.innerWidth;
    renderer.canvas.height = window.innerHeight;
    platform = getPlatform();
    spritesRenderer = renderer;
    audio.init();
    uiSettings();

    audio.loadBGMusic("audio/ambientBackgroundMusic1.mp3");

    areaColors = [
        "#00ff0020",
        "#0000ff20",
        "#80800020"
    ];
    area = [];

    enemies.add(530, 140, ENT_FIRESKULL, "[Wander] Fire Skull", aiWander);
    enemies.add(540, 140, ENT_FIRESKULL, "[Seek] Fire Skull", aiSeek);
    enemies.add(550, 120, ENT_FIRESKULL, "[Avoid] Fire Skull", aiAvoid);
    enemies.add(560, 120, ENT_FIRESKULL, "[Explore] Fire Skull", aiExplore);
    enemies.add(560, 120, ENT_FIRESKULL, "[Waypoint] Fire Skull", aiWaypointNavigation);
    
    items.add(560, 290, ENT_REDKEY, vec2(1, -100));
    items.add(630, 240, ENT_GREENKEY, vec2(1, -100));
    items.add(500, 100, ENT_BLUEKEY, vec2(1, -100));
    items.add(600, 200, ENT_HEALTHBOX, vec2(1, -100));
    items.add(640, 170, ENT_REVOLVERGUN, vec2(1, -100));
    items.add(520, 60, ENT_REVOLVERAMMO, vec2(1, -100));
    items.add(610, 280, ENT_WINCHESTERGUN, vec2(1, -100));
    items.add(590, 100, ENT_WINCHESTERAMMO, vec2(1, -100));
    
    items.add(572, 290, ENT_BARREL_RED, vec2(1, -100));
    items.add(574, 302, ENT_BARREL_RED, vec2(1, -100));
    items.add(576, 298, ENT_BARREL_STEEL, vec2(1, -100));
    items.add(578, 306, ENT_BARREL_STEEL, vec2(1, -100));
    items.add(580, 296, ENT_BARREL_STEEL, vec2(1, -100));
    items.add(590, 293, ENT_SPIKES, vec2(1, -100));

    playerInit();

    //editorInit(wall, area);
    //when using editor init, remove resetWallIndexes from below
    //because it is already in editor init (load level)

    setupGameplayUI();
    setupMainMenuUI();

    // Wall Sector TEST

    var s1_w1 = new Wall();
    s1_w1.set(549.99, 350, 524.99, 275);
    s1_w1.type = 3;
    var s1_w2 = new Wall();
    s1_w2.set(599.99, 225, 524.99, 275);
    s1_w2.type = 3;
    var s1_w3 = new Wall();
    s1_w3.set(549.99, 350, 674.99, 225);
    s1_w3.type = 3;

    var s2_w1 = new Wall();
    s2_w1.set(574.99, 150, 599.99, 225);
    s2_w1.type = 1;
    var s2_w2 = new Wall();
    s2_w2.set(674.99, 175, 674.99, 225);
    s2_w2.type = 1;
    var s2_w3 = new Wall();
    s2_w3.set(674.99, 175, 599.99, 125);
    s2_w3.type = 1;

    var s3_w1 = new Wall();
    s3_w1.set(499.99, 150, 574.99, 150);
    s3_w1.type = 3;
    var s3_w2 = new Wall();
    s3_w2.set(449.99, 100, 499.99, 150);
    s3_w2.type = 3;
    var s3_w3 = new Wall();
    s3_w3.set(499.99, 50, 449.99, 100);
    s3_w3.type = 3;
    var s3_w4 = new Wall();
    s3_w4.set(599.99, 75, 499.99, 50);
    s3_w4.type = 3;
    var s3_w5 = new Wall();
    s3_w5.set(599.99, 125, 599.99, 75);
    s3_w5.type = 3;

    var s1_s2 = new Wall();
    s1_s2.set(674.99, 225, 599.99, 225);
    s1_s2.type = 0;
    var s2_s3 = new Wall();
    s2_s3.set(599.99, 125, 574.99, 150);
    s2_s3.type = 0;

    wall.push(s1_s2, s2_s3);
    wall.push(s1_w1, s1_w2, s1_w3);
    wall.push(s2_w1, s2_w2, s2_w3);
    wall.push(s3_w1, s3_w2, s3_w3, s3_w4, s3_w5);

    s1_s2.sectorData.wallsLeft = [s1_w1, s1_w2, s1_w3];
    s1_s2.sectorData.wallsRight = [s2_w1, s2_w2, s2_w3];
    s1_s2.sectorData.sectorsLeft = undefined;
    s1_s2.sectorData.sectorsRight = [s2_s3];

    s2_s3.sectorData.wallsLeft = [s2_w1, s2_w2, s2_w3];
    s2_s3.sectorData.wallsRight = [s3_w1, s3_w2, s3_w3, s3_w4, s3_w5];
    s2_s3.sectorData.sectorsLeft = [s1_s2];
    s2_s3.sectorData.sectorsRight = undefined;

    activeSector = s1_s2;

    resetWallIndexes();

    entitiesInSectorSet = [];
    setEntitiesInSectors();
    deleteEntitiesOutsideSector();
    decor.removeIfNotInEntities();
    items.removeIfNotInEntities();
    enemies.removeIfNotInEntities();

    //wall[10].decal = entImg[0][0];

    floorAndCeiling = new floorClass();

    uistates = [];
    uistates.push(new UIState(mainMenuUI));
    uistates.push(new UIState(gameplayUI));

    ui = new UI(uistates, GAMEPLAYUI);

    inputSetup();
    setInterval(frame, 1000 / 60);
};

function events(deltaTime)
{
    playerEvents(deltaTime);

    mainMenuUICustomEvents();
    gameplayUICustomEvents(deltaTime, wall, area);

    if(keysDown.indexOf(PLAY_BUTTON) != -1)
    {
        if(!isKeyPressed(PLAY_BUTTON))
        {
            if(mapMode)
            {
                mapMode = false;
                enableFullScreen(document.documentElement);
                enablePointerLock(canvas);
            }
            else
            {
                mapMode = true;
                disableFullscreen(document.documentElement);
                disableFullscreen(canvas);
                disableFullscreen(document);
                disablePointerLock(document);
            }
        }
    }
    else
    {
        removeKeyPressed(PLAY_BUTTON);
    }

    eventSprites();

    if(mapMode && renderEditorAndGameTogether < 3)
    {
        editorEvents(deltaTime,
            vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
            ray[ray.length/2].p.y - (window.innerHeight/2)),
            wall, area, decor.ents, items.ents, enemies.ents);
    }

    ui.event();
}

function update(deltaTime) // FIXME: deltaTime is not used yet
{
    loadRoofAndFloorTextureDataOnce();

    gridOffset = vec2(-((ray[ray.length/2].p.x - (window.innerWidth/2)) % gridCellSize),
        -((ray[ray.length/2].p.y - (window.innerHeight/2)) % gridCellSize));

    floorAndCeiling.update(ray[ray.length/2].p, ray[ray.length/2].angle);

    ui.update();
    audio.update();
}

function draw()
{
    renderer.clearRect(0, 0, canvas.width, canvas.height);

    plPos = collisionWithWallsInSector(plPos, prevPlPos);

    //draw all the floors and walls in 3d
    if(!mapMode || renderEditorAndGameTogether >= 1)
    {
        if(platform != ANDROID)
            renderRaycast3DRoofAndFloorLining(renderer, ray[ray.length/2].p.x, ray[ray.length/2].p.y, ray[ray.length/2].angle);
        renderRaycast3D(renderer, ray, wall, ray[ray.length/2], vec2(ray[ray.length/2].p.x, ray[ray.length/2].p.y));
        calculateActiveSector(plPos);
        for (let i = 0; i < ray.length; i++)
            ray[i].p = vec2(plPos.x, plPos.y);
        
        if(!mapMode || debugEntities) items.check(plPos);
    }
    
    var off = vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
            ray[ray.length/2].p.y - (window.innerHeight/2));

    if(mapMode && renderEditorAndGameTogether < 3)
    {
        aiOffset = vec2(off.x, off.y);

        //wall offset added before rendering rays otherwise rays-walls casting won't work appropriately
        addOffsetToList(wall, off.negative());
        for (let i = 0; i < ray.length; i++)
        {
            plPos = vec2(ray[i].p.x, ray[i].p.y);
            ray[i].p = vec2(window.innerWidth/2, window.innerHeight/2);
            ray[i].draw(renderer, wall, true);
            ray[i].p = vec2(plPos.x, plPos.y);
        }

        drawEntities(renderer, ray[ray.length/2], true);

        for (let i = 0; i < wall.length; i++) wall[i].draw(renderer, wallColors, 12);
        drawSectorsMap(renderer, vec2(window.innerWidth/2, window.innerHeight/2), vec2(0,0));
        addOffsetToList(wall, off);

        addOffsetToList(area, off.negative());
        for(let i = 0; i < area.length; i++) area[i].draw(renderer, areaColors);
        addOffsetToList(area, off);

        editorDraw(renderer, off, wall, area, decor.ents, items.ents, enemies.ents);

        if (AUDIO_DEBUG) { audio.draw(off); }

        aiOffset = vec2(0, 0);
    }

    if(plPos.x != prevPlPos.x && plPos.y != prevPlPos.y)
        playerCalculatedAngleMovement = plPos.angle(prevPlPos);
    prevPlPos = vec2(plPos.x, plPos.y);

    drawGun();

    if(!mapMode || renderEditorAndGameTogether >= 1) 
    {
        drawAllGunsDisplay(renderer);
        drawKeysDisplay(renderer);
        drawCrosshair(renderer);
    }

    ui.draw();

    if(mapMode)
    {
        drawText(renderer, touchPos[0].x.toString() + ", " + touchPos[0].y.toString());
    }

    if(itemPickupFlash > 0)
    {
        drawRect(renderer, vec2(0, 0), vec2(window.innerWidth, window.innerHeight), true, itemPickupFlashColor);
        itemPickupFlash--;
    }

    subtitleManager.draw();
}

function frame()
{
    if (ImageObject.areAllLoaded())
    {
        var deltaTime = getDeltaTime();
        events(deltaTime);
        update(deltaTime);
        draw();
    }
}