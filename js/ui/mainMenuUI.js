
const MAINMENUUI = 0;

mainMenuBackground = new Sprite(tr(vec2(0, 0)), new ImageObject("images/BG.png", vec2(1920*2, 1080*2)));
mainMenuTitle = new Sprite(tr(vec2(320, 180)), new ImageObject("images/mysticChambers.png", vec2(600, 300)));

mainMenuUI = [];

var mainMenuFontSize = 20;

function setupMainMenuUI()
{
    menuButtons = [];
    playButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  PLAY",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    menuButtons.push(playButton);
    editorButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  LEVEL EDITOR",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    menuButtons.push(editorButton);
    loadButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  LOAD LEVEL",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    menuButtons.push(loadButton);
    settingsButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  SETTINGS",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    menuButtons.push(settingsButton);

    mainMenuUI.push(new FlexGroup(tr(vec2(50, 350), vec2(window.innerWidth, window.innerHeight-350)),
        new SubState(tr(), menuButtons),false, vec2(window.innerWidth/3, 20), vec2(1, 5), true));

    mainMenuUI.push(new Label(tr(vec2(window.innerWidth/2+200, window.innerHeight/2), vec2(400, 100)), "Background Door will be here"));
}

function mainMenuUICustomEvents()
{
    if(playButton.button.output == UIOUTPUT_SELECT)
    {
        ui.stateIndex = GAMEPLAYUI;
        if(mapMode) toggleGameplay();

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        playButton.button.resetOutput();
    }
    else if(editorButton.button.output == UIOUTPUT_SELECT)
    {
        ui.stateIndex = GAMEPLAYUI;
        if(!mapMode) toggleGameplay();

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        editorButton.button.resetOutput();
    }
    else if(loadButton.button.output == UIOUTPUT_SELECT)
    {
        //will get the file that you give it
        //and loads that file for playing
        //  WIP!!!

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        loadButton.button.resetOutput();
    }
    else if(settingsButton.button.output == UIOUTPUT_SELECT)
    {
        //will toggle settings substate
        //(i.e no seperate state, within main menu)
        //  WIP!!!

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        settingsButton.button.resetOutput();
    }
}