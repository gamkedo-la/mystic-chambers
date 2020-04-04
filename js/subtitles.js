const MAX_DISPLAY_TIME = 60 * 5;

class SubtitleManager 
{
    constructor(transform)
    {
        this.color = "red";
        this.font = 60 + "px Lucida, sans-serif";
        this.text = undefined;
        this.transform = transform==undefined ? tr() : transform;
        this.displayTimer = MAX_DISPLAY_TIME;
    }

    updateAndDisplayText(text, transform)
    {
        this.text = text;
        this.displayTimer = 0;

        if (transform != undefined){
            this.transform = transform;
        }
    }

    draw()
    {
        if (!mapMode && this.displayTimer < MAX_DISPLAY_TIME)
        {
            renderer.fillStyle = this.color;
            renderer.font = this.font;
            var textWidth = renderer.measureText(this.text).width;
            renderer.fillText(
                this.text, 
                this.transform.position.x - textWidth/2,
                this.transform.position.y,
            )
        }

        this.displayTimer += 1;
    }
}

subtitleManager = new SubtitleManager(
    tr(vec2(
        screen.width/2, 
        gunDefMinY + gunImages[0][0].image.height/2 + 0.1*screen.height
    ))
)