
const CREDITSUI = 3;

creditsUI = [];

function setupCreditsUI()
{
    //Label doesn't support multi line so, you have to create it manually.
    //A new line will be inserted where ever &/ampersand is located in the text.
    var creditsText = "Bilal A. Cheema: Project lead, core gameplay, rendering engine, custom editor functionality, entity system, fireskull art, wall decal support, health box, item support,&weapon bob, spritesheet support, UI, engine optimizations, minimap, rifle gun/ammo art, pickup flash, weapon transition, spikes, save/load, gravestones, fires,&pearl, ladder, treasure&&Michael \"Misha\" Fewkes: Audio manager code, 3D spatial sounds upport, music events feature, sound occlusion, dynamic reverb, propogation, additional sound integration&&Christer \"McFunkypants\" Kaitila: Enemy AI, art autoscaling, editor tooltips, editor save improvement, wall textures (tech, concrete, warning, carbon, marble, tan,&obsidian, rock, sandstone), garbage collection optimizations, exploding barrels, crosshair, floor and ceiling support, assorted code cleanup, waterdrops,&evil dwarf art, menu particles, menu decoration, level design&&Alan Zaring: Background music, death sound&&Jeff \"Axphin\" Hanlon: Messy stone wall texture, sounds (evil dwarf, fireball, spell attack, drip), revolver animation, huge door&&Ian Cherabier: Red brick wall art, cracked red wall, subtitle manager, audio reload debug support&&Vaan Hope Khani: Sounds (skull, wall, danger, hurt, fire, flash, full, steps, pick up, danger, shriek, dash, menu tones, revolver, ammo, rifle, doors)&&Ryan Gaillard: Portal sound, key/lock system&&Ygor Dimas: Art for speed injection&&Chris DeLeon: Compiled credits&&Apply at HomeTeamGameDev.com to make games with us!";

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

    creditsUI.push(new FlexGroup(tr(vec2(40, 40), vec2(window.innerWidth - 80, window.innerHeight - 80)),
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