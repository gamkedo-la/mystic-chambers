// an infinite plane effect, used for floors and ceilings
// because affine texture mode7 style pixel-by-pixel raycasting was too slow
// this "fakes" a similar effect using two DIVs and a 3d CSS xform

const DEBUGFLOORS = false;

// thse are hacky magic numbers
// FIXME remove all of these! use math instead
var floorScrollScale = 42; // pixels scrolled per game units travelled
var bgtilesize = 320; // size of texture in pixels
var ceilingOffsetX = -3700; // to center it on-screen
var floorOffsetX = -3700;
var ceilingHeight = 3960; // so it appears at correct height
var floorHeight = 3500;
var angleFixFactor = 1280;

var prevMapMode = true;
var prevRenderEditorAndGameTogether = 0;

class floorClass
{
    constructor()
    {
        document.body.style.perspective = "888px";

        if (DEBUGFLOORS) console.log("floor and ceiling init...");

        this.gradientFix = document.createElement("DIV");
        this.gradientFix.className = "gradientFix";

        this.gradientAltFix = document.createElement("DIV");
        this.gradientAltFix.className = "gradientAltFix";

        this.floor = document.createElement("DIV");
        this.floor.className = "floordiv";

        this.floorGraphic = document.createElement("DIV");
        this.floorGraphic.className = "floorgraphic";
        this.floor.appendChild(this.floorGraphic);

        this.ceiling = document.createElement("DIV");
        this.ceiling.className = "ceilingdiv";

        this.ceilingGraphic = document.createElement("DIV");
        this.ceilingGraphic.className = "ceilinggraphic";
        this.ceiling.appendChild(this.ceilingGraphic);

        this.blackScreen = document.createElement("DIV");
        this.blackScreen.className = "blackScreen";
        
        document.body.appendChild(this.gradientFix);
        document.body.appendChild(this.gradientAltFix);
        document.body.appendChild(this.floor);
        document.body.appendChild(this.ceiling);
        document.body.appendChild(this.blackScreen);

        this.floor.style.display = "none";
        this.ceiling.style.display = "none";
    }

    update(position, angle)
    {
        if(prevMapMode != mapMode
        || prevRenderEditorAndGameTogether != renderEditorAndGameTogether)
        {
            if(mapMode && renderEditorAndGameTogether <= 0)
            {
                this.floor.style.display = "none";
                this.ceiling.style.display = "none";
            }
            else if(!mapMode || renderEditorAndGameTogether >= 2)
            {
                this.floor.style.display = "block";
                this.ceiling.style.display = "block";
            }
            prevMapMode = mapMode;
            prevRenderEditorAndGameTogether = renderEditorAndGameTogether;
        }

        if (DEBUGFLOORS) console.log("floor and ceiling update...");

        // thse are a bit magic numbery - FIXME
        ceilingOffsetX = -screen.width/2 - 2700;
        floorOffsetX = -screen.width/2 - 2700;

        angle = 90 - angle;
        
        // rotate
        this.floor.style.transform = "rotate3d(1, 0, 0, 90deg) translate3d("+floorOffsetX+"px, "+angleFixFactor+"px, "+floorHeight+"px)";
        this.floor.style.transform += "rotate(" + angle.toString() + "deg)";
        this.ceiling.style.transform = "rotate3d(1, 0, 0, 90deg) translate3d("+ceilingOffsetX+"px, "+angleFixFactor+"px, "+ceilingHeight+"px)"; 
        this.ceiling.style.transform += "rotate(" + angle.toString() + "deg)";

        // shift around floor and ceiling to simulate scrolling the sprite
        var xform = "translate3d("
                        +(((position.x*floorScrollScale)%bgtilesize)).toString()+"px, "
                        +(((position.y*floorScrollScale)%bgtilesize)).toString()+"px, "
                        +"0px"
                        +")";

        this.floorGraphic.style.transform = xform;
        this.ceilingGraphic.style.transform = xform;
    }
}

