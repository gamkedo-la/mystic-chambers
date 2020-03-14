
window.onload = function()
{
    canvas = document.getElementById("gameCanvas");
    renderer = canvas.getContext("2d");
    renderer.canvas.width = window.innerWidth;
    renderer.canvas.height = window.innerHeight;
    setPointerLock(canvas);
    platform = getPlatform();
    spritesRenderer = renderer;
    audio.init();
    uiSettings();

    musicStarted = false;
    loadBGMusic("audio/ambientBackgroundMusic1.mp3");

    wallImages = [
        new ImageObject("images/door.png", vec2(160, 160)),
        new ImageObject("images/ground.png", vec2(160, 160)),
        new ImageObject("images/wall.png", vec2(160, 160)),
    ];
    wallColors = [
        "yellow",
        "grey",
        "red"
    ];
    wall = [];

    areaColors = [
        "#00ff0020",
        "#0000ff20",
        "#80800020"
    ];
    area = [];

    ent = new Entity();
    ent.set(window.innerWidth/2, window.innerHeight/2, ENT_FIRESKULL_NEW);
    entities.push(ent);

    ent2 = new Entity();
    ent2.set(window.innerWidth/2 + 10, window.innerHeight/2 - 5, ENT_FIRESKULL_OLD);
    entities.push(ent2);

    items.add(800, 400, ENT_HEALTHBOX, vec2(1, -80));
    items.add(840, 420, ENT_HEALTHBOX, vec2(1, -80));
    items.add(880, 410, ENT_HEALTHBOX, vec2(1, -80));
    
    decorations.scatter(ENT_TECHTORCH, 20,
        400, 0, 800, 400, vec2(1, -120)); // experimental WIP

    playerInit();

    editorInit(wall, area);

    setupGameplayUI();
    setupMainMenuUI();

    wall[10].decal = entImg[0][0];

    uistates = [];
    uistates.push(new UIState(mainMenuUI));
    uistates.push(new UIState(gameplayUI));

    ui = new UI(uistates, GAMEPLAYUI);

    inputSetup();
    setInterval(frame, 1000 / 60);
}

function events(deltaTime)
{
    playerEvents(deltaTime);

    mainMenuUICustomEvents();
    gameplayUICustomEvents(deltaTime, wall, area);

    if( (screen.availHeight || screen.height - 30) <= window.innerHeight)
        canvas.requestPointerLock();
    else if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas)
        try{canvas.exitPointerLock();} catch(e) {console.log(e.toString());}
            

    if(platform == WINDOWS)
        mapMode = !isPointerLocked();

    eventSprites();

    if(mapMode)
    {
        for(let i = 0; i < wall.length; i++)
            wall[i].addOffset(vec2(-(ray[ray.length/2].p.x - (window.innerWidth/2)),
                -(ray[ray.length/2].p.y - (window.innerHeight/2))));

        for(let i = 0; i < area.length; i++)
            area[i].addOffset(vec2(-(ray[ray.length/2].p.x - (window.innerWidth/2)),
                -(ray[ray.length/2].p.y - (window.innerHeight/2))));

                editorEvents(deltaTime,
                    vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
                    ray[ray.length/2].p.y - (window.innerHeight/2)),
                    wall, area);

        for(let i = 0; i < wall.length; i++)
            wall[i].addOffset(vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
                ray[ray.length/2].p.y - (window.innerHeight/2)));

        for(let i = 0; i < area.length; i++)
            area[i].addOffset(vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
                ray[ray.length/2].p.y - (window.innerHeight/2)));
    }

    ui.event();
}

function update(deltaTime)
{
    loadRoofAndFloorTextureDataOnce();

    if(!musicStarted && typeof bgMusicBuffer != "undefined")
    {
        musicStarted = true;
        audio.playMusic(bgMusicBuffer);
    }

    gridOffset = vec2(-((ray[ray.length/2].p.x - (window.innerWidth/2)) % gridCellSize),
        -((ray[ray.length/2].p.y - (window.innerHeight/2)) % gridCellSize));

    ui.update();
}

function draw()
{
    renderer.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(renderer, vec2(0, 0), vec2(window.innerWidth, window.innerHeight), true, "black");

    //drawSprites();

    if(mapMode)
    {
        //Offsets added before rendering and removed after rendering for Camera Movement
        for(let i = 0; i < wall.length; i++)
            wall[i].addOffset(vec2(-(ray[ray.length/2].p.x - (window.innerWidth/2)),
                -(ray[ray.length/2].p.y - (window.innerHeight/2))));

        for(let i = 0; i < area.length; i++)
            area[i].addOffset(vec2(-(ray[ray.length/2].p.x - (window.innerWidth/2)),
                -(ray[ray.length/2].p.y - (window.innerHeight/2))));

        for (let i = 0; i < ray.length; i++)
        {
            plPos = vec2(ray[i].p.x, ray[i].p.y);
            ray[i].p = vec2(window.innerWidth/2, window.innerHeight/2);

            ray[i].draw(renderer, wall, true);

            ray[i].p = vec2(plPos.x, plPos.y);
        }

        editorDraw(renderer, wall, area);

        for(let i = 0; i < area.length; i++)
        {
            area[i].draw(renderer, areaColors);
            
            area[i].addOffset(vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
                ray[ray.length/2].p.y - (window.innerHeight/2)));
        }

        for (let i = 0; i < wall.length; i++)
        {
            wall[i].draw(renderer, wallColors);

            wall[i].addOffset(vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
                ray[ray.length/2].p.y - (window.innerHeight/2)));
        }

        //var coll = ent.getCollValue(plPos);
        //if(coll.x != 0.0 && coll.y != 0.0) entCol = true;
        //plPos = plPos.add(coll);

    }
    else
    {
        if(platform != ANDROID)
            renderRaycast3DRoofAndFloorLining(renderer, ray[ray.length/2].p.x, ray[ray.length/2].p.y,
                ray[ray.length/2].angle)
        renderRaycast3D(renderer, ray, wall);

        for(let i = 0; i < area.length; i++)
        {
            var coll = area[i].getCollValue(plPos, prevPlPos);
            plPos = plPos.add(coll);
        }

        items.check(plPos);
    }

    drawEntities(renderer, ray[ray.length/2], mapMode);

    ui.draw();
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