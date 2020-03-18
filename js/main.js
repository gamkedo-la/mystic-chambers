
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

    revolverImages = [
        new ImageObject("images/revolver.png", vec2(480, 480)),
        new ImageObject("images/revolverFire.png", vec2(480, 480))
    ]

    revolver = new Sprite(
        tr(vec2(screen.width/2, 0)), revolverImages[0]);

    wallImages = [
        new ImageObject("images/door.png", vec2(160, 160)),
        new ImageObject("images/wall_stone_moss.png", vec2(160, 160)),
        new ImageObject("images/wall_stone.png", vec2(160, 160)),
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
    ent.set(window.innerWidth/2 + 50, window.innerHeight/2 - 100, ENT_FIRESKULL_NEW);
    entities.push(ent);

    ent2 = new Entity();
    ent2.set(window.innerWidth/2 + 10, window.innerHeight/2 - 5, ENT_FIRESKULL_OLD);
    entities.push(ent2);

    items.add(800, 400, ENT_REDKEY, vec2(1, -80));
    items.add(840, 420, ENT_GREENKEY, vec2(1, -80));
    items.add(880, 410, ENT_BLUEKEY, vec2(1, -80));
    
    decorations.scatter(ENT_TECHTORCH, 20,
        400, 0, 800, 400, vec2(1, -120)); // experimental WIP

    playerInit();

    //editorInit(wall, area);

    setupGameplayUI();
    setupMainMenuUI();

    
    // Wall Sector TEST

    var s1_w1 = new Wall();
    s1_w1.set(549.99, 350, 524.99, 275);
    s1_w1.type = 2;
    //549.99 350 524.99 275 2
    var s1_w2 = new Wall();
    s1_w2.set(599.99, 225, 524.99, 275);
    s1_w2.type = 2;
    //599.99 225 524.99 275 2
    var s1_w3 = new Wall();
    s1_w3.set(549.99, 350, 674.99, 225);
    s1_w3.type = 2;
    //549.99 350 674.99 225 2

    var s2_w1 = new Wall();
    s2_w1.set(574.99, 150, 599.99, 225);
    s2_w1.type = 1;
    //574.99 150 599.99 225 1
    var s2_w2 = new Wall();
    s2_w2.set(674.99, 175, 674.99, 225);
    s2_w2.type = 1;
    //674.99 175 674.99 225 1
    var s2_w3 = new Wall();
    s2_w3.set(674.99, 175, 599.99, 125);
    s2_w3.type = 1;
    //674.99 175 599.99 125 1

    var s3_w1 = new Wall();
    s3_w1.set(499.99, 150, 574.99, 150);
    s3_w1.type = 2;
    //499.99 150 574.99 150 2
    var s3_w2 = new Wall();
    s3_w2.set(449.99, 100, 499.99, 150);
    s3_w2.type = 2;
    //449.99 100 499.99 150 2
    var s3_w3 = new Wall();
    s3_w3.set(499.99, 50, 449.99, 100);
    s3_w3.type = 2;
    //499.99 50 449.99 100 2
    var s3_w4 = new Wall();
    s3_w4.set(599.99, 75, 499.99, 50);
    s3_w4.type = 2;
    //599.99 75 499.99 50 2
    var s3_w5 = new Wall();
    s3_w5.set(599.99, 125, 599.99, 75);
    s3_w5.type = 2;
    //599.99 125 599.99 75 2

    var s1_s2 = new Wall();
    s1_s2.set(674.99, 225, 599.99, 225);
    s1_s2.type = 0;
    //674.99 225 599.99 225 0
    var s2_s3 = new Wall();
    s2_s3.set(599.99, 125, 574.99, 150);
    s2_s3.type = 0;
    //599.99 125 574.99 150 0

    wall.push(s1_w1, s1_w2, s1_w3);
    wall.push(s2_w1, s2_w2, s2_w3);
    wall.push(s3_w1, s3_w2, s3_w3, s3_w4, s3_w5);
    wall.push(s1_s2, s2_s3);

    s1_s2.sectorData.wallsLeft = [s1_w1, s1_w2, s1_w3];
    s1_s2.sectorData.wallsRight = [s2_w1, s2_w2, s2_w3];
    s1_s2.sectorData.sectorsLeft = undefined;
    s1_s2.sectorData.sectorsRight = [s2_s3]

    s2_s3.sectorData.wallsLeft = [s2_w1, s2_w2, s2_w3];
    s2_s3.sectorData.wallsRight = [s3_w1, s3_w2, s3_w3, s3_w4, s3_w5];
    s2_s3.sectorData.sectorsLeft = [s1_s2];
    s2_s3.sectorData.sectorsRight = undefined;

    activeSector = s1_s2;

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

        drawSectorsMap(renderer, wallColors,
            vec2(window.innerWidth/2, window.innerHeight/2),
            vec2(0,0)/*-(ray[ray.length/2].p.x - (window.innerWidth/2)),
            -(ray[ray.length/2].p.y - (window.innerHeight/2)))*/
        );

        for (let i = 0; i < wall.length; i++)
        {
            //wall[i].draw(renderer, wallColors);

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

    revolver.transform.position = vec2(
        screen.width/2 + (Math.sin(gunMoveCounter) * 30.0),
        screen.height - 240 + Math.abs(Math.cos(gunMoveCounter) * 10.0));
    if(!mapMode) revolver.drawSc();

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