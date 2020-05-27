function init()
{
    canvas = document.getElementById("gameCanvas");

    renderer = canvas.getContext("2d");
    renderer.canvas.width = window.innerWidth;
    renderer.canvas.height = window.innerHeight;

    platform = getPlatform();
    
    spritesRenderer = renderer;

    audio.init();

    //Custom Initialization
    playerInit();
    editorInit(wall, area);
    uiInit();
    audio.loadBGMusic("audio/ambientBackgroundMusic1.mp3");
    floorAndCeiling = new floorClass();
    inputSetup();
}