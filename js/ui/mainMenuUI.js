const MAINMENUUI = 0;

mainMenuBackground = new Sprite(tr(vec2(0, 0)),
    new ImageObject("images/BG.png", vec2(1920*2, 1080*2)));
mainMenuTitle = new Sprite(tr(vec2(320, 180)),
    new ImageObject("images/mysticChambers.png", vec2(600, 300)));

hugeDoorSpr = new Sprite(tr(vec2(920, 325), vec2(640, 576)),
    new ImageObject("images/huge_door.png", vec2(640, 576)));
hugeDoorAbvSpr = new Sprite(tr(vec2(920, 325), vec2(640+80, 576+80)),
    new ImageObject("images/huge_door_abv.png", vec2(640+80, 576+80)));
behindTheDoorSpr = new Sprite(tr(vec2(920, 279), vec2(412, 282)),
    new ImageObject("images/behind-the-door.png", vec2(412, 282)));

mainMenuUI = [];

var mainMenuFontSize = 20;

var leftdoor;
var rightdoor;

var hoverSoundDone = false;

function setupMainMenuUI()
{
    leftdoor = document.getElementById("leftdoor");
    rightdoor = document.getElementById("rightdoor");

    menuButtons = [];
    playButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  PLAY        P",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    menuButtons.push(playButton);
    editorButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  LEVEL EDITOR        E",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    menuButtons.push(editorButton);
    creditsButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  CREDITS        C",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    menuButtons.push(creditsButton);
    bugLabel = new Label(tr(), "NOTE: If you see void/black areas, just move into them or turn a lil' bit ;)",
        (mainMenuFontSize/1.25).toString() + "px " + uiContext.fontFamily, "yellow", -1);
    menuButtons.push(bugLabel);

    mainMenuUI.push(new FlexGroup(tr(vec2(50, 350), vec2(window.innerWidth, window.innerHeight-350)),
        new SubState(tr(), menuButtons),false, vec2(window.innerWidth/3.5, 20), vec2(1, 5), true));
}

function mainMenuUICustomDraw()
{
    mainMenuBackground.draw();
        
    behindTheDoorSpr.draw();
    hugeDoorSpr.draw();
    hugeDoorAbvSpr.draw();

    mainMenuTitle.draw();
    mainMenuFX.draw();
}

function mainMenuUICustomEvents()
{
    // open the main menu doors
    if(playButton.button.output == UIOUTPUT_HOVER) {
        leftdoor.style.left = "-92px";
        rightdoor.style.left = "526px";
    } else {
        leftdoor.style.left = "114px";
        rightdoor.style.left = "320px";
    }

    if(playButton.button.output == UIOUTPUT_HOVER
        || editorButton.button.output == UIOUTPUT_HOVER
        //|| loadButton.button.output == UIOUTPUT_HOVER
        || creditsButton.button.output == UIOUTPUT_HOVER)
    {
        if(!hoverSoundDone) audio.play1DSound(sounds[HOVER]);
        hoverSoundDone = true;
    }
    else hoverSoundDone = false;
    
    if(playButton.button.output == UIOUTPUT_SELECT
        || keysDown.indexOf('p') != -1)
    {
        hideMainMenuCube();
        ui.stateIndex = GAMEPLAYUI;
        ui.transitionAnimation();
        if(mapMode) toggleGameplay();
        restrictLevelEditor = true;

        gameTimer = 0;
        gameTimerStart = true;
        enemiesKilled = 0;

        while(wall.length > 0) { deleteWallFromAllSectors(wall[wall.length - 1]); wall.pop(); }
        while(area.length > 0) area.pop();
        while(entities.length > 0) { entities.pop(); decor.removeIfNotInEntities(); items.removeIfNotInEntities(); enemies.removeIfNotInEntities(); }
        activeSector = undefined;
        currentLevel = 1;
        loadLevel(wall, area);
        lvLabel.text = getLevelName();

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        playButton.button.resetOutput();
    }
    else if(editorButton.button.output == UIOUTPUT_SELECT
        || keysDown.indexOf('e') != -1)
    {
        hideMainMenuCube();
        ui.stateIndex = GAMEPLAYUI;
        ui.transitionAnimation();
        if(!mapMode) toggleGameplay();
        restrictLevelEditor = false;

        gameTimer = 0;
        gameTimerStart = false;
        enemiesKilled = 0;

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        editorButton.button.resetOutput();
    }
    else if(creditsButton.button.output == UIOUTPUT_SELECT
        || keysDown.indexOf('c') != -1)
    {
        hideMainMenuCube();
        ui.stateIndex = CREDITSUI;
        ui.transitionAnimation();

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        creditsButton.button.resetOutput();
    }
}

function hideMainMenuCube() {
    var div = document.getElementById("mainMenuCube");
    if (div) div.style.display = "none";
}