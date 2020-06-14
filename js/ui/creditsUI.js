
const CREDITSUI = 3;

creditsUI = [];

function setupCreditsUI()
{
    //Label doesn't support multi line so, you have to create it manually.
    //A new line will be inserted where ever &/ampersand is located in the text.
    var creditsText = "THIS IS JUST EXAMPLE. THE CREDITS ARE FROM NICK OF TIME.&Lead, core gameplay functionality, storyline, level design, most art (including environment assets), player sprite, lighting, graphics outlines, spit screen support, font selection,&movement indicator, katana weapon, main enemies code and art, minimap, weapon throwing, breakable objects, hit combos, main menu functionality, boss art, score system: Bilal A. Cheema&Inventory UI and related functionality, player health and stamina bars, UI shake, potion and weapon equipping, item stacking, trading implementation, assorted bug fixes: Brian Nielsen&Portal teleportation, whip animations, time whip equipment, door animation sprites and hookups, lock and key art and implementation, assorted bug fixes: Tyler Funk&Title particles, additional player and attack particles, main menu music, intro music, dialog interaction improvement, footprints, substitles, light rays effect, health and stamina flash&when low, two dozen sound effects: Christer \"McFunkypants\" Kaitila&Boss clock animations, spear art, pnedulum, chest box art, old paper background: Charlene A.&Enemy attack telegraphing, blinking implementation, floating text improvements: Kornel&Fire snake sprite and related animations: Gonzalo Delgado&Gameplay music: Alan Zaring&Screenshake implementation: Lucas Hausrath&Enemy healthbars: Caspar \"SpadXIII\" Dunant&2 player mode bug fix: Randy Tan Shaoxian&Compiled credits: Chris DeLeon";

    creditsUIObjects = [];

    var seperator = "&";
    var maxLabels = creditsText.split(seperator).length;
    for(var i = 0; i < maxLabels; i++)
    {
        textLabel = new Label(tr(), creditsText.split(seperator)[i],
        (mainMenuFontSize/1.25).toString() + "px " + uiContext.fontFamily, undefined, -1);
        creditsUIObjects.push(textLabel);
    }

    backButton = new TextButton(tr(vec2(), btnSize),
        new Label(tr(), "  BACK        B",
        mainMenuFontSize.toString() + "px " + uiContext.fontFamily),
        new Button(tr(), "#00000090", "#990099FF", "#330033FF"),"");
    creditsUIObjects.push(backButton);

    creditsUI.push(new FlexGroup(tr(vec2(50, 50), vec2(window.innerWidth - 100, window.innerHeight - 100)),
        new SubState(tr(), creditsUIObjects),false, vec2(0, 0), vec2(1, creditsText.split(seperator).length + 1), true));
}

function creditsUICustomDraw()
{
    mainMenuBackground.draw();
}

function creditsUICustomEvents()
{
    if(backButton.button.output == UIOUTPUT_SELECT
        || keysDown.indexOf('b') != -1)
    {
        ui.stateIndex = MAINMENUUI;
        ui.transitionAnimation();

        audio.play1DSound(sounds[MENU_CLICK_BTN]);
        backButton.button.resetOutput();
    }
}