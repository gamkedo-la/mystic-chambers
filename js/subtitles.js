const MAX_DISPLAY_TIME = 60 * 4;

class SubtitleManager 
{
    constructor(transform)
    {
        this.text = undefined;
        this.transform = transform==undefined ? tr() : transform;
        this.displayTimer = MAX_DISPLAY_TIME;
    }

    updateAndDisplayText(text, transform)
    {
        this.text = text;
        this.displayTimer = 0;

        if (transform != undefined)
            this.transform = transform;
    }

    draw()
    {
        if (!mapMode && this.displayTimer < MAX_DISPLAY_TIME)
        {
            renderer.fillStyle = uiContext.textColor;
            renderer.font = uiContext.fontFamily + " " + uiContext.fontSize.toString() + "px";
            var textWidth = renderer.measureText(this.text).width;
            renderer.fillText(
                this.text, 
                this.transform.position.x - textWidth/2,
                this.transform.position.y,
            );
        }

        this.displayTimer += 1;
    }
}

subtitleManager = new SubtitleManager(tr(vec2(screen.width/2, uiContext.fontSize * 1.5)));