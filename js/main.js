window.onload = function()
{
    init();
    setInterval(frame, 1000 / 60);
};

function events(deltaTime)
{
    switch(ui.stateIndex)
    {
        case MAINMENUUI: mainMenuUICustomEvents(); break;
        case GAMEPLAYUI: gameplayUICustomEvents(deltaTime); break;
        case NEXTLEVELUI: nextLevelUICustomEvents(); break;
    }
    ui.event();
}

function update()
{
    ui.update();
    audio.update();
}

function draw(deltaTime)
{
    renderer.clearRect(0, 0, canvas.width, canvas.height);
    switch(ui.stateIndex)
    {
        case MAINMENUUI: mainMenuUICustomDraw(); break;
        case GAMEPLAYUI: gameplayUICustomDraw(deltaTime); break;
        case NEXTLEVELUI: nextLevelUICustomDraw(deltaTime); break;
    }
    ui.draw(deltaTime);
}

function frame()
{
    if (ImageObject.areAllLoaded())
    {
        var deltaTime = getDeltaTime();
        events(deltaTime);
        update();
        draw(deltaTime);
    }
}