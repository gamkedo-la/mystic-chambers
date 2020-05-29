var mainMenuFX = new function() {

    var mainMenuFXparticle = [];
    var mainMenuFXcount = 256;
    var mainMenuFXdecay = 0.01;
    var mainMenuFXmaxspeed = -4;
    var mainMenuFXsize = 120;
    var mainMenuFXsprites = [ // can be more than one
        new ImageObject("images/smoke.png", vec2(160, 160)),
        new ImageObject("images/fire_menubg.png", vec2(160, 160))
    ];

    this.draw = function() {

        var i = 0;
        var imgnum = 0;

        if (!mainMenuFXparticle.length) { // first time?
            for (i=0; i<mainMenuFXcount; i++) {
                mainMenuFXparticle[i] = { x:0,y:-9999999,a:0,s:1,i:mainMenuFXsprites[0] };
            }
        }
        
        for (i=0; i<mainMenuFXcount; i++) {
            
            if (mainMenuFXparticle[i].a<mainMenuFXdecay) { 
                // respawn
                mainMenuFXparticle[i].x = Math.random() * gameCanvas.width - 64;
                mainMenuFXparticle[i].a = 0.5+Math.random()*0.5;
                mainMenuFXparticle[i].y = gameCanvas.height + 64 + Math.random()*256;
                mainMenuFXparticle[i].s = Math.random() * mainMenuFXmaxspeed;
                imgnum = Math.floor(Math.random() * mainMenuFXsprites.length);
                if (imgnum==1) mainMenuFXparticle[i].s *= 0.6; // fire moves slower than smoke
                mainMenuFXparticle[i].i = mainMenuFXsprites[imgnum].image;
            }

            // step sim
            mainMenuFXparticle[i].a -= mainMenuFXdecay;
            mainMenuFXparticle[i].y += mainMenuFXparticle[i].s;
           
            // render
            renderer.globalAlpha = mainMenuFXparticle[i].a;
            renderer.drawImage(mainMenuFXparticle[i].i,
                mainMenuFXparticle[i].x,
                mainMenuFXparticle[i].y,
                mainMenuFXsize, // scaled down
                // scale but respect aspect ratio
                (mainMenuFXparticle[i].i.height/mainMenuFXparticle[i].i.width)*(mainMenuFXsize));

        }
        renderer.globalAlpha = 1;
    };

}(); // creates a new global obj named mainMenuFX now