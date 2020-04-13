const PLAY_BUTTON = '1';
const EDITOR_BG_COLOUR = "black";

renderEditorAndGameTogether = 0;
debugEntities = false;

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

    playerInit();

    editorInit(wall, area);

    setupGameplayUI();
    setupMainMenuUI();

    //wall[10].decal = entImg[0][0];

    floorAndCeiling = new floorClass();

    uistates = [];
    uistates.push(new UIState(mainMenuUI));
    uistates.push(new UIState(gameplayUI));

    ui = new UI(uistates, GAMEPLAYUI);

    // test water drops
    decor.scatter(ENT_WATERDROPS,60,400,0,700,400,0);

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

function draw(deltaTime)
{
    renderer.clearRect(0, 0, canvas.width, canvas.height);

    plPos = collisionWithWallsInSector(plPos, prevPlPos);

    if(!mapMode || renderEditorAndGameTogether >= 1)
    {
        renderRaycast3DRoofAndFloorLining(renderer,
            ray[ray.length/2].p.x, ray[ray.length/2].p.y,
            ray[ray.length/2].angle);
        renderRaycast3D(renderer, ray, wall,
            ray[ray.length/2], vec2(ray[ray.length/2].p.x,
            ray[ray.length/2].p.y));
        sectorsMap(plPos);
        for (let i = 0; i < ray.length; i++)
            ray[i].p = vec2(plPos.x, plPos.y);
        
        if(!mapMode || debugEntities) items.check(plPos);
    }
    
    var off = vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
            ray[ray.length/2].p.y - (window.innerHeight/2));

    if(mapMode && renderEditorAndGameTogether < 3)
    {
        aiOffset = vec2(off.x, off.y);

        //wall offset added before rendering rays
        //otherwise rays-walls casting won't work appropriately
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

    if(!mapMode || renderEditorAndGameTogether >= 1) 
    {
        drawGun(deltaTime);
        drawAllGunsDisplay(renderer);
        drawKeysDisplay(renderer);
        drawCrosshair(renderer);
    }

    ui.draw();

    //if(mapMode) drawText(renderer, touchPos[0].x.toString() + ", " + touchPos[0].y.toString());

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
        draw(deltaTime);
    }
}