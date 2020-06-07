//Next Level UI will also display Game Finish Screen.

const NEXTLEVELUI = 2;

nextLevelUI = [];

function setupNextLevelUI()
{
    // menuButtons = [];
    // playButton = new TextButton(tr(vec2(), btnSize),
    //     new Label(tr(), "  PLAY        P",
    //     mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
    //     new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    // menuButtons.push(playButton);
    // editorButton = new TextButton(tr(vec2(), btnSize),
    //     new Label(tr(), "  LEVEL EDITOR        E",
    //     mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
    //     new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    // menuButtons.push(editorButton);
    // loadButton = new TextButton(tr(vec2(), btnSize),
    //     new Label(tr(), "  LOAD LEVEL        L",
    //     mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
    //     new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    // menuButtons.push(loadButton);
    // creditsButton = new TextButton(tr(vec2(), btnSize),
    //     new Label(tr(), "  CREDITS        C",
    //     mainMenuFontSize.toString() + "px " + uiContext.fontFamily, undefined, -1),
    //     new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    // menuButtons.push(creditsButton);

    // mainMenuUI.push(new FlexGroup(tr(vec2(50, 350), vec2(window.innerWidth, window.innerHeight-350)),
    //     new SubState(tr(), menuButtons),false, vec2(window.innerWidth/3, 20), vec2(1, 5), true));

    //mainMenuUI.push(new Label(tr(vec2(window.innerWidth/2+200, window.innerHeight/2), vec2(400, 100)), "Background Door will be here"));
}

function nextLevelUICustomDraw()
{
}

function nextLevelUICustomEvents()
{
    // if(playButton.button.output == UIOUTPUT_SELECT
    //     || keysDown.indexOf('p') != -1)
    // {
    //     ui.stateIndex = GAMEPLAYUI;
    //     ui.transitionAnimation();
    //     if(mapMode) toggleGameplay();

    //     audio.play1DSound(sounds[MENU_CLICK_BTN]);
    //     playButton.button.resetOutput();
    // }
    // else if(editorButton.button.output == UIOUTPUT_SELECT
    //     || keysDown.indexOf('e') != -1)
    // {
    //     ui.stateIndex = GAMEPLAYUI;
    //     ui.transitionAnimation();
    //     if(!mapMode) toggleGameplay();

    //     audio.play1DSound(sounds[MENU_CLICK_BTN]);
    //     editorButton.button.resetOutput();
    // }
    // else if(loadButton.button.output == UIOUTPUT_SELECT
    //     || keysDown.indexOf('l') != -1)
    // {
    //     //  WIP!!!

    //     audio.play1DSound(sounds[MENU_CLICK_BTN]);
    //     loadButton.button.resetOutput();
    // }
    // else if(creditsButton.button.output == UIOUTPUT_SELECT
    //     || keysDown.indexOf('s') != -1)
    // {
    //     //  WIP!!!

    //     audio.play1DSound(sounds[MENU_CLICK_BTN]);
    //     creditsButton.button.resetOutput();
    // }
}