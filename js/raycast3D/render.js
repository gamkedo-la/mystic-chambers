
var wallX = 0.0;
var maxDepth = 250.0;
var prevType = -1;

var wallRenderTexture = true;
var textureSize = 160.0;
var wallStretchFactor = 5000.0;
var wallHeightFactor = 12.0;

var wallDarkening = true;
var wallDarkeningFactor = 4.0;
var wallDarkeningLayers = 10.0;
var wallDarkeningSteps = 3.0;
var wallBrightnessThreshold = 0.1;
var wallDarknessThreshold = 0.7;

var fishEyeRemoveFactor = 1.0;
var fishEyeRemoveThreshold = 1.0;
var prevDepth = -1.0;

var maxDepthChangeFactor = textureSize / 2.0;

var roofFloorRenderTexture = false;
var roofFloorPointSize = 10;

var colorDepthYG1 = 225; //for texture rendering
var colorDepthYG2 = 250; //for texture rendering

var depthYGStep = 16;

var depthYGThreshold = 0.2;

var renderRoofFloor = true;
var FOV = 17.4;
var farDist = 15.0;
var nearDist = 0.001;

var floorImageData = null;
var roofImageData = null;
var imgDataDone = false;

function drawRenderDataPiece(renderer, i, data, ray)
{
    if (data.depth < maxDepth && data.depth > 0.1)
    {
        if (data.depth >= maxDepth)
            return;

        if(prevDepth > -0.999 && Math.abs(data.depth - prevDepth) < fishEyeRemoveThreshold)
            data.depth = lerp(data.depth, prevDepth, fishEyeRemoveFactor);

        //data.depth = Math.sqrt(data.depth * 25);
        //data.depth = data.depth * Math.cos(degToRad(ray[ray.length/2].angle) - degToRad(ray[i].angle));

        segmentSize = vec2(
            (window.innerWidth / ray.length) + 2,
            (wallHeightFactor * window.innerHeight) * (1.0 / data.depth)
        );
        segmentPos = vec2(
            ((segmentSize.x - 2) * i),
            (window.innerHeight / 2.0) - (segmentSize.y / 2.0)
        );

        // Old - Plain Rectangle Draw Render Method
        if(!wallRenderTexture)
        {
            var color = Math.floor((segmentSize.y / window.innerHeight) * 20) * 20;
            if(color > 255) color = 255;
            drawRect( renderer, segmentPos, segmentSize, true, rgb(color, 0, Math.floor(color/10)) );
        }
        else
        {
            // New Texture Render Method
            totalTextureRepeats = (data.length / textureSize) * wallStretchFactor;
            wallX = (data.lengthPoint / data.length) * totalTextureRepeats;

            wallX = wallX % (textureSize - 10);

            wallInClipWidth = 1;

            sw = wallInClipWidth;
            sx = wallX;

            renderer.drawImage(
                wallImages[data.type > 0 && data.type < wallImages.length ? data.type : 0].image,
                sx, 0, sw, textureSize,
                segmentPos.x - 1, segmentPos.y + jumpOffset,
                segmentSize.x, segmentSize.y);

            if(typeof data.decal != "undefined")
            {
                renderer.drawImage(
                    data.decal.image,
                    sx, 0, sw, textureSize,
                    segmentPos.x - 1, segmentPos.y + jumpOffset,
                    segmentSize.x, segmentSize.y);
            }

            if(wallDarkening && segmentSize.y - (segmentSize.y/wallDarkeningFactor) < window.innerHeight)
            {
                renderer.globalAlpha = 1.0 - ((segmentSize.y - (segmentSize.y/wallDarkeningFactor)) / window.innerHeight);
                renderer.globalAlpha = round(Math.floor(renderer.globalAlpha * wallDarkeningLayers), wallDarkeningSteps, 0) / Math.floor(wallDarkeningLayers);
                renderer.globalAlpha = clamp(renderer.globalAlpha, wallBrightnessThreshold, wallDarknessThreshold);
                renderer.fillStyle= 'black';
                renderer.fillRect(
                    segmentPos.x - 2, segmentPos.y - 1  + jumpOffset,
                    segmentSize.x + 1, segmentSize.y + 2);
            }

            renderer.globalAlpha = 1.0;

            renderer.globalCompositeOperation = "source-over";
        }

        prevDepth = data.depth;
    }
}

var renderData = [];
function renderRaycast3D(renderer, ray, w, plRay, plPos)
{
    prevDepth = -1.0;
    noOfWallsCheckedForRendering = 0;

    renderDataGroup = [];
    do
    {
        var rSec = nextRenderSector;
        nextRenderSector = undefined;
        renderData = [];
        for (let i = 0; i < ray.length; i++)
        {
            renderData.push(ray[i].raycastSector(w, plPos, rSec));
        }
        renderDataGroup.push(renderData);
    }
    while(typeof nextRenderSector != "undefined");

    for(let g = renderDataGroup.length - 1; g >= 0; g--)
    {
        for(let i = 0; i < renderDataGroup[g].length; i++)
            drawRenderDataPiece(renderer, i, (renderDataGroup[g])[i], ray);

        if((g == renderDataGroup.length - 2 && renderDataGroup.length >= 2)
        || (g == renderDataGroup.length - 1 && renderDataGroup.length < 2))
            drawEntitiesInSector(activeSector,
            detectActiveSector(activeSector, plPos),
            renderer, plRay);
        else if(g == renderDataGroup.length - 1 && renderDataGroup.length >= 1)
            drawEntitiesInSector(activeSector,
            -detectActiveSector(activeSector, plPos),
            renderer, plRay);
    }
}

function loadRoofAndFloorTextureDataOnce()
{
    if(!imgDataDone)
    {
        renderer.drawImage(wallImages[2].image, 0, 0);
        floorImageData
        = renderer.getImageData(0, 0,
            wallImages[2].image.width, wallImages[2].image.height);

        renderer.drawImage(wallImages[2].image, 0, 0);
        roofImageData
        = renderer.getImageData(0, 0,
            wallImages[2].image.width, wallImages[2].image.height);

        imgDataDone = true;
    }
}

function renderRaycast3DRoofAndFloorLining(renderer, xG, yG, angG)
{
    if(renderRoofFloor)
    {
        var farX1 = xG + Math.cos(degToRad(angG - FOV)) * farDist;
        var farY1 = yG + Math.sin(degToRad(angG - FOV)) * farDist;
        var farX2 = xG + Math.cos(degToRad(angG + FOV)) * farDist;
        var farY2 = yG + Math.sin(degToRad(angG + FOV)) * farDist;
        var nearX1 = xG + Math.cos(degToRad(angG - FOV)) * nearDist;
        var nearY1 = yG + Math.sin(degToRad(angG - FOV)) * nearDist;
        var nearX2 = xG + Math.cos(degToRad(angG + FOV)) * nearDist;
        var nearY2 = yG + Math.sin(degToRad(angG + FOV)) * nearDist;
        
        for(var ytg = 0; ytg < window.innerHeight/2; ytg += roofFloorPointSize)
        {
            var depthYG = ytg / (window.innerHeight/2.0);

            if(depthYG < depthYGThreshold) continue;

            var depthEffectToColor = 0;
            if(roofFloorRenderTexture)
                depthEffectToColor = round(Math.floor(colorDepthYG1 - ((depthYG) * colorDepthYG2)), depthYGStep, 0);
            
            //Concept: texturePoints = (farPoint - nearPoint) / depth + nearPoint;
            var x1GS = (farX1 - nearX1) / depthYG + nearX1;
            var y1GS = (farY1 - nearY1) / depthYG + nearY1;
            var x2GS = (farX2 - nearX2) / depthYG + nearX2;
            var y2GS = (farY2 - nearY2) / depthYG + nearY2;
            
            for(var xtg = 0; xtg < window.innerWidth; xtg += roofFloorPointSize)
            {
                var depthXG = xtg / window.innerWidth;
                var sampleX = (x2GS - x1GS) * depthXG + x1GS;
                var sampleY = (y2GS - y1GS) * depthXG + y1GS;

                if(roofFloorRenderTexture)
                {
                    //Texturing Rendering - Very Heavy, Massive Drop in FPS (~22)

                    //160 = texture width
                    //var texIndex = ((Math.floor(Math.abs(sampleY * 8.0)) % 160) * 160)
                    //+ (Math.floor(Math.abs(sampleX * 8.0)) % 160);
                    pxf =
                        getPixelXY(floorImageData,
                            Math.floor(Math.abs(sampleX * 8.0)) % 160,
                            Math.floor(Math.abs(sampleY * 8.0)) % 160,
                            160);
                    pxr = 
                        getPixelXY(roofImageData,
                            Math.floor(Math.abs(sampleX * 8.0)) % 160,
                            Math.floor(Math.abs(sampleY * 8.0)) % 160,
                            160);
                    if(typeof pxf[0] != "undefined")
                    {
                        pxf[0] = clamp(pxf[0] - depthEffectToColor, 0, pxf[0]);
                        pxf[1] = clamp(pxf[1] - depthEffectToColor, 0, pxf[1]);
                        pxf[2] = clamp(pxf[2] - depthEffectToColor, 0, pxf[2]);
                        drawRect(renderer, vec2(xtg, ytg + (window.innerHeight / 2) + jumpOffset),
                            vec2(roofFloorPointSize, roofFloorPointSize), true,
                            rgb(pxf[0], pxf[1], pxf[2]));
                    }
                    if(typeof pxr[0] != "undefined")
                    {
                        pxr[0] = clamp(pxr[0] - depthEffectToColor, 0, pxr[0]);
                        pxr[1] = clamp(pxr[1] - depthEffectToColor, 0, pxr[1]);
                        pxr[2] = clamp(pxr[2] - depthEffectToColor, 0, pxr[2]);
                        drawRect(renderer, vec2(xtg, (window.innerHeight / 2) - ytg + jumpOffset),
                            vec2(roofFloorPointSize, roofFloorPointSize), true,
                            rgb(pxr[0], pxr[1], pxr[2]));
                    }
                }
                else
                {
                    //Lines Rendering - Very Fast, No Texture Involved (60+)

                    if((Math.floor(sampleX) % 14 < 1
                    || Math.floor(sampleY) % 14 < 1)
                    && Math.random() < 0.5)
                    {
                        var colorDepth = Math.floor(30*(Math.floor(depthYG * 255.0) / 100));
                        colorDepth = colorDepth > 255 ? 255 : colorDepth;
                        var colorDepthAlt = colorDepth - 80;
                        if(colorDepthAlt < 0) colorDepthAlt = 0;

                        var pointSize = (roofFloorPointSize * (ytg/(window.innerHeight/1.5)));
                        
                        drawRect(renderer, vec2(xtg, ytg + (window.innerHeight/2) + jumpOffset),
                            vec2(pointSize, pointSize), true,
                                rgb(colorDepth, colorDepthAlt/ + 30, colorDepth));

                        drawRect(renderer, vec2(xtg, (window.innerHeight/2) - ytg + jumpOffset),
                            vec2(pointSize, pointSize), true,
                                rgb(colorDepth, colorDepth, colorDepthAlt/ + 30));
                    }
                }
            }
        }
    }
}