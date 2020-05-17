//TODO:
//set correct value at changeThis variables
var changeThis = 'change';

//set color door to be locked
var doorLocked = true;
var doorColors = ["Blue","Green","Red"]

var availableKeys = [false, false, false];
var totalKeys = 3;
var currentDoorColor = null;

var doorImages = [
    new ImageObject("images/doorBlue.png", vec2(changeThis, changeThis)),
    new ImageObject("images/doorGreen.png", vec2(changeThis, changeThis)),
    new ImageObject("images/doorRed.png", vec2(changeThis, changeThis))
]

function totalKeysAvailable() 
{
    var count = 0;
    for(let i = 0; i < availableKeys.length; i++)
        if(availableKeys[i]) count = count + 1;
    return count;
}

function unlockDoor(doorColor) 
{
    currentDoorColor = doorColor;
    //check if player has key matching to door
    if(totalKeysAvailable() > 0) {
        for(let i = 0; i < availableKeys.length; i++) {
            if(currentDoorColor.includes(doorColors[i])) {
                doorLocked = false;
            }
        }
    }
}

