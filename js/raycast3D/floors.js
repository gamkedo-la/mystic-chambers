// an infinite plane effect, used for floors and ceilings
// because affine texture mode7 style pixel-by-pixel raycasting was too slow
// this "fakes" a similar effect using two DIVs and a 3d CSS xform

const DEBUGFLOORS = false;

class floorClass
{
    constructor()
    {
        if (DEBUGFLOORS) console.log("floor and ceiling init...");

        this.floor = document.createElement("DIV");
        this.floor.className = "floordiv";

        this.ceiling = document.createElement("DIV");
        this.ceiling.className = "ceilingdiv";

        this.blackScreen = document.createElement("DIV");
        this.blackScreen.className = "blackScreen";
        
        document.body.appendChild(this.floor);
        document.body.appendChild(this.ceiling);
        document.body.appendChild(this.blackScreen);
    }

    update()
    {
        if (DEBUGFLOORS) console.log("floor and ceiling update...");

        // this.floor.style.transform="rotate3d(1, 1, 1, 45deg);"; // or rad
        // maybe scroll the bg tile? might not be as fast, but simpler
        
        // this.floor.style.backgroundPosition = 

    }
}

