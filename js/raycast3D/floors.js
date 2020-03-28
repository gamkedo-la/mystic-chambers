// an infinite plane effect, used for floors and ceilings
// because affine texture mode7 style pixel-by-pixel raycasting was too slow
// this "fakes" a similar effect using two DIVs and a 3d CSS xform

const DEBUGFLOORS = false;

class floorClass
{
    constructor()
    {
        if (DEBUGFLOORS) console.log("floor and ceiling init...");

        this.gradientFix = document.createElement("DIV");
        this.gradientFix.className = "gradientFix";

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
        document.body.appendChild(this.floor);
        document.body.appendChild(this.ceiling);
        document.body.appendChild(this.blackScreen);
    }

    update(position, angle)
    {
        if(mapMode)
        {
            this.floor.style.display = "none";
            this.ceiling.style.display = "none";
        }
        else
        {
            this.floor.style.display = "block";
            this.ceiling.style.display = "block";
        }

        if (DEBUGFLOORS) console.log("floor and ceiling update...");

        // this.floor.style.transform="rotate3d(1, 1, 1, 45deg);"; // or rad

        // maybe scroll the bg tile? might not be as fast, but simpler
        // FIXME yeah, scrolling bg tile is quite laggy! any fix???
        // removing performance eaters will give super smooth FPS!
        
        const anglescale = 1; // it seems to turn too slow, but this is the 
        //perspective and fov being different - we can tweak this in the CSS
        // TODO FIXME: change body css perspective and fov to match game
        angle = 90 - angle;
        angle *= anglescale;
        
        this.floor.style.transformOrigin = "center center";
        this.floor.style.transform = "rotate3d(1, 0, 0, 90deg) translate3d(-3360px, 0px, 3072px)"; 
        this.floor.style.transform += "rotate(" + angle.toString() + "deg)";
        
        //performance eater
        // this.floor.style.backgroundPosition = (position.x%100).toString() + "%" + (position.y%100).toString() + "%";
        // simulate a backgroundPosition change by sliding around a child div
        const floorScrollScale = 42; // pixel dist for game units travelled
        const bgtilesize = 320;
        
        var xform = "translate3d("
                        +((position.x*floorScrollScale)%bgtilesize).toString()+"px, "
                        +((position.y*floorScrollScale)%bgtilesize).toString()+"px, "
                        +"0px"
                        +")";
        this.floorGraphic.style.transform = xform;

        this.ceiling.style.transformOrigin = "center center";
        this.ceiling.style.transform = "rotate3d(1, 0, 0, 90deg) translate3d(-3360px, 0px, 4096px)"; 
        this.ceiling.style.transform += "rotate(" + angle.toString() + "deg)";
        
        //performance eater
        //this.ceiling.style.backgroundPosition = (position.x%100).toString() + "% " + (position.y%100).toString() + "%";
        this.ceilingGraphic.style.transform = xform;

    }
}

