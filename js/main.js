const EDITOR_BG_COLOUR = "black"; //"rgba(0,0,0,0.2)"; // could be partially transparent
const RENDER_EDITOR_AND_GAME_TOGETHER = false; // if false, draw either editor OR game

noOfWallsCheckedForRendering = 0;

function play3DSound(buffer, vec2_a, vec2_b)
{
    var dist = vec2_a.dist(vec2_b); //for volume
    var angle = vec2_a.angle(vec2_b); //for panning

    //calculating volume and panning from above variables here

    //audio.playOneshot(buffer);
}
//...then use it like this
//play3DSound(plPos, fireSkullEnt.p)
//-OR-
//play3DSound(ray[ray.length/2].p, fireSkullEnt.p)
//anywhere after window.onload
//
//Some practical uses as of now:
//- fire skull making noise after some time (in main.js, update or event method)
//- when picking item (in item.js, in the switch cases, after line 26)
//- when firing or reloading gun (in player.js, after line 199)
//
//Note To Bilal: Line no. 313 of main.js, Line no. 126 of render.js

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

    audio.loadBGMusic("audio/ambientBackgroundMusic1.mp3");

    wallImages = [
        new ImageObject("images/door.png", vec2(160, 160)),
        new ImageObject("images/wall_stone_moss.png", vec2(160, 160)),
        new ImageObject("images/wall_stone.png", vec2(160, 160)),
    ];
    wallColors = [
        "#ffff0099",
        "#50505099",
        "#ff000099"
    ];
    wall = [];

    areaColors = [
        "#00ff0020",
        "#0000ff20",
        "#80800020"
    ];
    area = [];

    fireSkullEnt = new Entity();
    fireSkullEnt.set(530, 140, ENT_FIRESKULL);
    fireSkullEnt.name = "[Wander] Fire Skull";
    fireSkullEnt.ai = aiWander;
    entities.push(fireSkullEnt);

    seeker_fireSkullEnt = new Entity();
    seeker_fireSkullEnt.set(540, 130, ENT_FIRESKULL);
    seeker_fireSkullEnt.name = "[Seek] Fire Skull";
    seeker_fireSkullEnt.ai = aiSeek;
    entities.push(seeker_fireSkullEnt);

    cowardly_fireSkullEnt = new Entity();
    cowardly_fireSkullEnt.set(550, 120, ENT_FIRESKULL);
    cowardly_fireSkullEnt.name = "[Avoid] Fire Skull";
    cowardly_fireSkullEnt.ai = aiAvoid;
    entities.push(cowardly_fireSkullEnt);

    explorer_fireSkullEnt = new Entity();
    explorer_fireSkullEnt.set(560, 120, ENT_FIRESKULL);
    explorer_fireSkullEnt.name = "[Explore] Fire Skull";
    explorer_fireSkullEnt.ai = aiExplore;
    entities.push(explorer_fireSkullEnt);
    
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


    decorations.scatter(ENT_TECHTORCH, 200,
        400, 0, 800, 400, vec2(1, -120)); // experimental WIP

    playerInit();

    //editorInit(wall, area);
    //when using editor init, remove resetWallIndexes from below
    //because it is already in editor init (load level)

    setupGameplayUI();
    setupMainMenuUI();

    // Wall Sector TEST

    var s1_w1 = new Wall();
    s1_w1.set(549.99, 350, 524.99, 275);
    s1_w1.type = 2;
    var s1_w2 = new Wall();
    s1_w2.set(599.99, 225, 524.99, 275);
    s1_w2.type = 2;
    var s1_w3 = new Wall();
    s1_w3.set(549.99, 350, 674.99, 225);
    s1_w3.type = 2;

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
    s3_w1.type = 2;
    var s3_w2 = new Wall();
    s3_w2.set(449.99, 100, 499.99, 150);
    s3_w2.type = 2;
    var s3_w3 = new Wall();
    s3_w3.set(499.99, 50, 449.99, 100);
    s3_w3.type = 2;
    var s3_w4 = new Wall();
    s3_w4.set(599.99, 75, 499.99, 50);
    s3_w4.type = 2;
    var s3_w5 = new Wall();
    s3_w5.set(599.99, 125, 599.99, 75);
    s3_w5.type = 2;

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

    //wall[10].decal = entImg[0][0];

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
        mapMode = !isPointerLocked(); // FIXME this can also get toggled by code elsewhere

    eventSprites();

    if(mapMode)// || RENDER_EDITOR_AND_GAME_TOGETHER)
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

    gridOffset = vec2(-((ray[ray.length/2].p.x - (window.innerWidth/2)) % gridCellSize),
        -((ray[ray.length/2].p.y - (window.innerHeight/2)) % gridCellSize));

    ui.update();
}

function draw()
{
    renderer.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(renderer, vec2(0, 0), vec2(window.innerWidth, window.innerHeight), true, EDITOR_BG_COLOUR);

    //drawSprites();

    plPos = collisionWithWallsInSector(plPos, prevPlPos);

    // draw all the floors and walls in 3d
    if(!mapMode || RENDER_EDITOR_AND_GAME_TOGETHER)
    {
        if(platform != ANDROID)
            renderRaycast3DRoofAndFloorLining(renderer, ray[ray.length/2].p.x, ray[ray.length/2].p.y,
                ray[ray.length/2].angle)
        renderRaycast3D(renderer, ray, wall, ray[ray.length/2], vec2(ray[ray.length/2].p.x, ray[ray.length/2].p.y));
        calculateActiveSector(plPos);
        for (let i = 0; i < ray.length; i++)
            ray[i].p = vec2(plPos.x, plPos.y);
        items.check(plPos);
    }
    

    if(mapMode)// || RENDER_EDITOR_AND_GAME_TOGETHER)
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

        drawSectorsMap(renderer,
            vec2(window.innerWidth/2, window.innerHeight/2),
            vec2(0,0));

        for (let i = 0; i < wall.length; i++)
        {
            wall[i].draw(renderer, wallColors, 12);

            wall[i].addOffset(vec2(ray[ray.length/2].p.x - (window.innerWidth/2),
                ray[ray.length/2].p.y - (window.innerHeight/2)));
        }

    }

    if(mapMode && !RENDER_EDITOR_AND_GAME_TOGETHER)
        drawEntities(renderer, ray[ray.length/2], true);

    //Old Entities Rendering
    //drawEntities(renderer, ray[ray.length/2], mapMode);

    if(plPos.x != prevPlPos.x && plPos.y != prevPlPos.y)
        playerCalculatedAngleMovement = plPos.angle(prevPlPos);
    prevPlPos = vec2(plPos.x, plPos.y);

    gun.transform.position = vec2(
        screen.width/2 + (Math.sin(gunMoveCounter) * 30.0),
        screen.height - 240 + Math.abs(Math.cos(gunMoveCounter) * 10.0));
    if(currentGun >= 0)
        if(!mapMode && typeof gun.imageObject != "undefined") gun.drawSc();

    if(!mapMode) 
    {
        drawAllGunsDisplay(renderer);
        drawKeysDisplay(renderer);
    }

    ui.draw();

    //if(mapMode)
        drawText(renderer,
        touchPos[0].x.toString() + ", " + touchPos[0].y.toString() + ", " + noOfWallsCheckedForRendering + "/" + (180 * (wall.length - 2)),
        vec2(10, window.innerHeight - 16));
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