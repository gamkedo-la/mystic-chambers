const PLAY_BUTTON = '1';
const EDITOR_BG_COLOUR = "black";

renderEditorAndGameTogether = 0;
debugEntities = false;

window.onload = function()
{
    init();
    playerInit();
    editorInit(wall, area);
    uiInit();
    audio.loadBGMusic("audio/ambientBackgroundMusic1.mp3");
    floorAndCeiling = new floorClass();
    inputSetup();
    setInterval(frame, 1000 / 60);
};

function events(deltaTime)
{
    if(ui.stateIndex == MAINMENUUI)
    {
        mainMenuUICustomEvents();
    }
    else if(ui.stateIndex == GAMEPLAYUI)
    {
        playerEvents(deltaTime);

        gameplayUICustomEvents(deltaTime, wall, area);

        if(keysDown.indexOf(PLAY_BUTTON) != -1)
        {
            if(!isKeyPressed(PLAY_BUTTON))
            {
                toggleGameplay();
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
    }

    ui.event();
}

function update(deltaTime) // FIXME: deltaTime is not used yet
{
    if(ui.stateIndex == GAMEPLAYUI)
    {
        loadRoofAndFloorTextureDataOnce();
        gridOffset = vec2(-((ray[ray.length/2].p.x - (window.innerWidth/2)) % gridCellSize),
            -((ray[ray.length/2].p.y - (window.innerHeight/2)) % gridCellSize));
        floorAndCeiling.update(ray[ray.length/2].p, ray[ray.length/2].angle);
    }
    ui.update();
    audio.update();
}

function draw(deltaTime)
{
    renderer.clearRect(0, 0, canvas.width, canvas.height);

    if(ui.stateIndex == MAINMENUUI)
    {
        mainMenuBackground.draw();
        
        hugeDoorSpr.draw();
        behindTheDoorSpr.draw();

        mainMenuTitle.draw();
        mainMenuFX.draw();
    }
    else if(ui.stateIndex == GAMEPLAYUI)
    {
        plPos = collisionWithWallsInSector(plPos, prevPlPos);

        if(!mapMode || renderEditorAndGameTogether >= 1)
        {
            renderRaycast3DRoofAndFloorLining(renderer,
                ray[ray.length/2].p.x, ray[ray.length/2].p.y,
                ray[ray.length/2].angle);
            renderRaycast3D(renderer, ray, wall,
                ray[ray.length/2], vec2(ray[ray.length/2].p.x,
                ray[ray.length/2].p.y), deltaTime);
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

            drawEntities(renderer, ray[ray.length/2], true, deltaTime);

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

        if(flash > 0)
        {
            drawRect(renderer, vec2(0, 0), vec2(window.innerWidth, window.innerHeight), true, flashColor);
            flash -= deltaTime;
        }

        subtitleManager.draw(deltaTime);
    }

    ui.draw(deltaTime);
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