const AUTOSCALE_SPRITES = false; // WIP

//requires Vector2
imagesLoadingLeft = 0;
class ImageObject
{
    constructor(imageSrc, size)
    {
        var me = this; // because onload events have a different "this"

        this.image = document.createElement("img");

        imagesLoadingLeft++;
        
        this.image.onload = function()
        {
            if (AUTOSCALE_SPRITES) {
                // optionally scale up if it is tiny, note: this won't be "this"
                // FIXME: outputs blank, is the loop wrong?
                var oldW = me.image.width;
                var oldH = me.image.height;
                var scale = 10;
                if (oldW < 100 && oldH < 100) {
                    var newW = oldW * scale;
                    var newH = oldH * scale;
                    console.log("We need to scale up a "+oldW+"x"+oldH+" sprite to "+newW+"x"+newH);
                    // let's edit the imagedata
                    //var smallData = me.image.getImageData(0, 0, oldW, oldH); // image can't do this, only a canvas
                    renderer.drawImage(me.image, 0, 0);
                    var smallData = renderer.getImageData(0, 0, oldW, oldH);
                    var bigData = new ImageData(newW,newH);
                    me.image.width = newW;
                    me.image.height = newH;
                    for (var i=0; i<bigData.length/4; i++) {
                        for (var n=0; n<scale; n++) {
                            bigData[((i+n)*4)*scale+0] = smallData[i/scale+0]; // r
                            bigData[((i+n)*4)*scale+1] = smallData[i/scale+1]; // g
                            bigData[((i+n)*4)*scale+2] = smallData[i/scale+2]; // b
                            bigData[((i+n)*4)*scale+3] = smallData[i/scale+3]; // a
                        }
                    }
                    //me.image.putImageData(bigData,0,0); // not allowed on an Image
                    // convert imagedata to image:
                    var _canvas = document.createElement('canvas');
                    var _ctx = _canvas.getContext('2d');
                    _canvas.width = bigData.width;
                    _canvas.height = bigData.height;
                    _ctx.putImageData(bigData, 0, 0);
                    var _image = new Image();
                    _image.src = _canvas.toDataURL();

                    // replace old small image with new large one!
                    me.image = _image; 
                } // if AUTOSCALE_SPRITES
            }

            imagesLoadingLeft--;
        }
        
        this.image.src = imageSrc;
        this.size = size;
        
        if (!AUTOSCALE_SPRITES) { // resize the image in a blurry simple way
            this.image.width = size.x;
            this.image.height = size.y;
        }
    }

    setSize(size)
    {
        this.size = size;
        this.image.width = size.x;
        this.image.height = size.y;
    }

    compareSrc(imageSrc)
    {
        return (this.image.src === imageSrc);
    }

    static areAllLoaded()
    {
        return (imagesLoadingLeft <= 0);
    }
}

//requires Transform and ImageObject
sprites = [];
spritesRenderer = null;
class Sprite
{
    constructor(transform, imageObject)
    {
        this.transform = transform;
        this.imageObject = imageObject;
        sprites.push(this);

        this.event = function() {};
    }

    destroy()
    {
        for (let i = 0; i < sprites.length; i++)
        {
            if (sprites[i] == this)
            {
                sprites.splice(i, 1)
                break;
            }
        }
    }

    getTransformWithSize()
    {
        return new Transform(this.transform.position,
            this.transform.scale.multiply(new Vector2(this.imageObject.image.width, this.imageObject.image.height)),
            this.transform.rotation,
            this.transform.origin,
            this.transform.anchor);
    }
    
    getEvent()
    {
        return this.event;
    }
    
    setEvent(func)
    {
        this.event = func;
    }

    relPointInside(vec2)
    {
        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;

        if (vec2.x >= pos.x - ((img.width * scale.x) / 2) &&
            vec2.y >= pos.y - ((img.height * scale.y) / 2) &&
            vec2.x < pos.x + ((img.width * scale.x) / 2) &&
            vec2.y < pos.y + ((img.height * scale.y) / 2))
        {
            return new Vector2(vec2.x - pos.x, vec2.y - pos.y);
        }

        return new Vector2(-1, -1);
    }

    draw()
    {
        var img = this.imageObject.image;
        var pos = this.transform.position;

        spritesRenderer.drawImage(img,
            pos.x - (img.width / 2), pos.y - (img.height / 2),
            img.width, img.height);
    }

    drawSc()
    {
        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;

        spritesRenderer.drawImage(img,
            pos.x - ((img.width * scale.x) / 2), pos.y - ((img.height * scale.y) / 2),
            img.width * scale.x, img.height * scale.y);
    }

    drawScIn(inPos, inSize)
    {
        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;

        spritesRenderer.drawImage(img,
            inPos.x, inPos.y, inSize.x, inSize.y,
            pos.x - ((inSize.x * scale.x) / 2), pos.y - ((inSize.y * scale.y) / 2),
            inSize.x * scale.x, inSize.y * scale.y);
    }

    drawRot()
    {
        var img = this.imageObject.image;
        var pos = this.transform.position;
        var ori = this.transform.origin;

        spritesRenderer.save();

        spritesRenderer.translate(pos.x + ori.x, pos.y + ori.y);
        spritesRenderer.rotate(this.transform.rotation + (Math.PI / 2));
        spritesRenderer.translate(-pos.x - ori.x, -pos.y - ori.y);

        spritesRenderer.drawImage(img,
            pos.x - (img.width / 2), pos.y - (img.height / 2),
            img.width, img.height);

        spritesRenderer.restore();
    }

    drawScRot()
    {
        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;
        var ori = this.transform.origin;

        spritesRenderer.save();

        spritesRenderer.translate(pos.x + ori.x, pos.y + ori.y);
        spritesRenderer.rotate(this.transform.rotation + (Math.PI / 2));
        spritesRenderer.translate(-pos.x - ori.x, -pos.y - ori.y);

        spritesRenderer.drawImage(img,
            pos.x - ((img.width * scale.x) / 2), pos.y - ((img.height * scale.y) / 2),
            img.width * scale.x, img.height * scale.y);

        spritesRenderer.restore();
    }
}

function drawSprites(index, noOfSprites, scaled, rotated)
{
    index = typeof index == "undefined" ? 0 : index;
    noOfSprites = typeof noOfSprites == "undefined" ? sprites.length : noOfSprites;

    if (scaled && rotated)
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].drawScRot();
        }
    }
    else if (scaled)
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].drawSc();
        }
    }
    else if (rotated)
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].drawRot();
        }
    }
    else
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].draw();
        }
    }
}

function eventSprites(index, noOfSprites)
{
    index = typeof index == "undefined" ? 0 : index;
    noOfSprites = typeof noOfSprites == "undefined" ? sprites.length : noOfSprites;

    for (let i = index; i < index + noOfSprites; i++)
    {
        sprites[i].event();
    }
}