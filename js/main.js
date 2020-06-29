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
        case CREDITSUI: creditsUICustomEvents(); break;
    }
    ui.event();
}

function update()
{
    ui.update();
    if (AUDIO_ENABLED) audio.update();
}

function draw(deltaTime)
{
    renderer.clearRect(0, 0, canvas.width, canvas.height);
    switch(ui.stateIndex)
    {
        case MAINMENUUI: mainMenuUICustomDraw(); break;
        case GAMEPLAYUI: gameplayUICustomDraw(deltaTime); break;
        case NEXTLEVELUI: nextLevelUICustomDraw(); break;
        case CREDITSUI: creditsUICustomDraw(); break;
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