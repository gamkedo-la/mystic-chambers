const FLOOR_AND_CEILING_CSS3D_ENABLED = true;

function init()
{
    canvas = document.getElementById("gameCanvas");

    renderer = canvas.getContext("2d");
    renderer.canvas.width = window.innerWidth;
    renderer.canvas.height = window.innerHeight;

    platform = getPlatform();
    
    spritesRenderer = renderer;

    //audio.init(); // won't run until the user has clicked once

    //Custom Initialization
    playerInit();
    editorInit(wall, area);
    uiInit();
    // browsers will not allow us to do this here:
    // audio.loadBGMusic("audio/ambientBackgroundMusic1.mp3");
    
    if (FLOOR_AND_CEILING_CSS3D_ENABLED) {
        floorAndCeiling = new floorClass();
    }
    
    inputSetup();
}