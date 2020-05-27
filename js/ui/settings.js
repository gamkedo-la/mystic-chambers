function uiInit()
{
    uiSettings();
    setupGameplayUI();
    setupMainMenuUI();
    uistates = [];
    uistates.push(new UIState(mainMenuUI));
    uistates.push(new UIState(gameplayUI));
    ui = new UI(uistates, MAINMENUUI);
}

function uiSettings()
{
    scrSizeFactor = (window.innerWidth > window.innerHeight ? window.innerWidth/2 : window.innerWidth);

    btnSize = vec2(scrSizeFactor * 0.16, scrSizeFactor * 0.04);
    squareBtnSize = vec2(scrSizeFactor * 0.05, scrSizeFactor * 0.05);
    tabSize = vec2(scrSizeFactor * 0.15, scrSizeFactor * 0.08);
    sliderSize = vec2(scrSizeFactor * 0.28, scrSizeFactor * 0.04);
    sliderKnobSize = scrSizeFactor * 0.0075;
    panelSize = vec2(scrSizeFactor * 0.32, scrSizeFactor * 0.54);
    mapMode = true;

    uiContext.set(
        renderer, 2, "Lucida, sans-serif", scrSizeFactor * 0.024,
        "#202040", "#252550", "#252550", "#060612", "#000001", "#ccccee"
        );
}