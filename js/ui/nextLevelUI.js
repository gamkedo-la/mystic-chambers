//Next Level UI will also display Game Finish Screen.

const NEXTLEVELUI = 2;
var nextLevelCounter = 0;

nextLevelUI = [];

function setupNextLevelUI()
{
    nextLevelUIObjects = [];

    flexibleLabel = new Label(tr(), "none",
        (mainMenuFontSize * 3.0).toString() + "px " + uiContext.fontFamily, "#44FF44");
    nextLevelUIObjects.push(flexibleLabel);

    timeTakenLabel = new Label(tr(), "TIME TAKEN: 123 SECONDS",
        (mainMenuFontSize * 1.5).toString() + "px " + uiContext.fontFamily);
    nextLevelUIObjects.push(timeTakenLabel);
    enemiesKilledLabel = new Label(tr(), "ENEMIES KILLED: 123",
        (mainMenuFontSize * 1.5).toString() + "px " + uiContext.fontFamily);
    nextLevelUIObjects.push(enemiesKilledLabel);
    pressKeyLabel = new Label(tr(), "  PRESS ANY KEY TO PROCEED!",
        (mainMenuFontSize * 1.5).toString() + "px " + uiContext.fontFamily, "white");
    nextLevelUIObjects.push(pressKeyLabel);

    nextLevelUI.push(new FlexGroup(tr(vec2(0, 100), vec2(window.innerWidth, window.innerHeight-200)),
        new SubState(tr(), nextLevelUIObjects),false, vec2(0, 0), vec2(1, 4), true));
}

function nextLevelUICustomDraw()
{
    mainMenuBackground.draw();
}

function nextLevelUICustomEvents()
{
    if(keysDown.length > 0)
    {
        if(nextLevelCounter > 100)
        {
            if(playerHealth <= 0)
            {
                ui.stateIndex = MAINMENUUI;

                playerHealth = playerMaxHealth;
                currentLevel = 1;
            }
            else if(currentLevel > totalLevels)
            {
                ui.stateIndex = CREDITSUI;

                playerHealth = playerMaxHealth;
                currentLevel = 1;
            }
            else
            {
                ui.stateIndex = GAMEPLAYUI;
            }
            
            ui.transitionAnimation();
            if(mapMode) toggleGameplay();

            nextLevelCounter = 0;

            audio.play1DSound(sounds[MENU_CLICK_BTN]);
            nextLevelButton.button.resetOutput();
        }
    }

    nextLevelCounter++;
}