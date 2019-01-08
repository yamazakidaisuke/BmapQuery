"use strict";

//****************************************************************************************
// BingMaps Functions
//****************************************************************************************
/**
 * MapView
 * @method mapView
 * @param target (string)  ["#id"]
 * @param lat    (float)   [47.6149]
 * @param lon    (float)   [-122.1941]
 * @param id     (string)  ["load","aerial","canvasDark","canvasLight","birdseye","grayscale","streetside"]
 * @param num    (int)     [1...20]
 * @returns {boolean=false OR Object=Map}
 */
function mapStart(target, lat, lon, id, num){
    //Param Check
    if(target=="" || lat=="" || lon=="" || id=="" || num==""){
        return false;
    }
    //MapObject
    return new Microsoft.Maps.Map(target, {
        center: new Microsoft.Maps.Location(lat,lon), //Location center position
        mapTypeId: eval("Microsoft.Maps.MapTypeId."+id), //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
        zoom: num  //Zoom:1=zoomOut, 20=zoomUp[ 1~20 ]
    });
}

/**
 * MapViewMove
 * @method mapChangeView
 * @param map    (object)  [mapObject]
 * @param lat    (float)   [47.6149]
 * @param lon    (float)   [-122.1941]
 * @param id     (string)  ["load","aerial","canvasDark","canvasLight","birdseye","grayscale","streetside"]
 * @param num    (int)     [1...20]
 * @returns {boolean=false OR void }
 */
function mapChangeView(map, lat, lon, id, num){
    //Param Check
    if(map=="" || lat=="" || lon=="" || id=="" || num==""){
        return false;
    }
    //MapObject
    const loc = new Microsoft.Maps.Location(lat,lon);
    map.setView({
        mapTypeId: eval("Microsoft.Maps.MapTypeId."+id),
        center: loc,
        zoom: num,
        bounds:loc.bestView
    });
}

/**
 * Pushpin:Add
 * @method mapPushpin
 * @param map    (object)   [mapObject]
 * @param lat    (float)    [47.6149]
 * @param lon    (float)    [-122.1941]
 * @param color  (string)   ["#ff0000"]
 * @param[arguments] drag   (boolean)  [true or false]
 * @param[arguments] clicked (boolean) [true or false]
 * @param[arguments] hover  (boolean)  [true or false]
 * @param[arguments] visib  (boolean)  [true or false]
 * @returns {boolean=false OR void }
 */
function mapPushpin(map, lat, lon, color){
    //Param Check
    let drag,clicked,hover,visib;
    if(map=="" || lat=="" || lon=="" || color==""){
        return false;
    }
    //arguments[4...7]
    if(typeof arguments[4]=="undefined" || arguments[4]==false){drag=false;}else{drag=true;};
    if(typeof arguments[5]=="undefined" || arguments[5]==false){clicked=false;}else{clicked=true;};
    if(typeof arguments[6]=="undefined" || arguments[6]==false){hover=false;}else{hover=true;};
    if(typeof arguments[7]=="undefined" || arguments[7]==true){visib = true;}else{visib=false;};
    const location =  new Microsoft.Maps.Location(lat,lon);
    const pin = new Microsoft.Maps.Pushpin(location, {
        color: color,                //Color
        draggable:drag,              //MouseDraggable
        enableClickedStyle:clicked,  //Click
        enableHoverStyle:hover,      //MouseOver
        visible:visib                //show/hide
    });
    map.entities.push(pin);
}

/**
 * Pushpin:Add
 * @method mapPushpinText
 * @param map       (object)   [mapObject]
 * @param lat       (float)    [47.6149]
 * @param lon       (float)    [-122.1941]
 * @param title     (string)   ["Tokyo Tower"]
 * @param subtitle  (string)   ["A symbol of Tokyo that used to be."]
 * @param text      (string)   ["A... or 1..."]
 * @returns {boolean=false OR void }
 */
function mapPushpinText(map, lat, lon, title,subtitle,text){
    //Param Check
    if(map=="" || lat=="" || lon=="" || title=="" || subtitle=="" || text==""){
        return false;
    }
    const location =  new Microsoft.Maps.Location(lat,lon);
    const pin = new Microsoft.Maps.Pushpin(location, {
        title:title,
        subTitle:subtitle,
        text:text
    });
    map.entities.push(pin);
}

/**
 * Pushpin:Add
 * @method mapPushpinIcon
 * @param map       (object)   [mapObject]
 * @param lat       (float)    [47.6149]
 * @param lon       (float)    [-122.1941]
 * @param icon      (string)   ["ImagePath: img/poi_costom.png"]
 * @param scale     (float)    ["1.2...2.0"]
 * @param anchor1   (int)      ["Adjusting the position： widthPx"]
 * @param anchor2   (int)      ["Adjusting the position： heightPx"]
 * @returns {boolean=false OR void }
 */
function mapPushpinIcon(map, lat, lon, icon, scale, anchor1, anchor2){
    //Param Check
    if(map=="" || lat=="" || lon=="" || icon=="" ||  scale=="" ){
        return false;
    }
    const location =  new Microsoft.Maps.Location(lat,lon);
    _createScaledPushpin(location, icon, scale, anchor1, anchor2, function(pin) {
        map.entities.push(pin); //MapにPushpinを追加！
    });
}


/**
 * Pushpin:pushpinIcon Scale change size.
 * @method _createScaledPushpin
 * @param location  (object)   [location information(lat,lon...)]
 * @param imgUrl    (string)   ["ImagePath: img/poi_costom.png"]
 * @param scale     (float)    ["1.2...2.0"]
 * @param anchor1   (int)      ["Adjusting the position： widthPx"]
 * @param anchor2   (int)      ["Adjusting the position： heightPx"]
 * @param callback  (Function) ["Callback function"]
 * @returns {boolean=false OR void }
 */
function _createScaledPushpin(location, imgUrl, scale, anchor1, anchor2, callback) {
    const img = new Image();
    img.onload = function () {
        const c = document.createElement('canvas');
        c.width = img.width * scale;    //scale
        c.height = img.height * scale;  //scale
        //Draw scaled image
        const context = c.getContext('2d');
        context.drawImage(img, 0, 0, c.width, c.height);
        const pin = new Microsoft.Maps.Pushpin(location, {
            icon: c.toDataURL(),
            anchor:new Microsoft.Maps.Point(anchor1,anchor2)
        });
        //callback
        if (callback) {
            callback(pin);
        }
    };
    img.src = imgUrl;
}

/**
 * Infobox:Add
 * @method mapInfobox
 * @param map    (object)   [mapObject]
 * @param lat    (float)    [47.6149]
 * @param lon    (float)    [-122.1941]
 * @param t      (string)   ["title"]
 * @param d      (string)   ["description"]
 * @returns {boolean}
 */
function mapInfobox(map, lat, lon, t, d){
    //Param Check
    if(map=="" || lat=="" || lon=="" || t=="" || d==""){
        return false;
    }
    //Infobox
    const location = new Microsoft.Maps.Location(lat,lon);
    const infobox  = new Microsoft.Maps.Infobox(location,{
        title: t,
        description: d
    });
    infobox.setMap(map); //Add infobox to Map
}

/**
 * Infobox:HTML
 * @method mapInfoboxHtml
 * @param map    (object)   [mapObject]
 * @param lat    (float)    [47.6149]
 * @param lon    (float)    [-122.1941]
 * @param html   (string)   ['<div style="background-color: rgba(0,0,0,0.5);color: white;">ABCDE</div>']
 * @returns {boolean}
 */
function mapInfoboxHtml(map, lat, lon, html){
    //Param Check
    if(map=="" || lat=="" || lon=="" || html==""){
        return false;
    }
    //Infobox
    const location = new Microsoft.Maps.Location(lat,lon);
    const infobox  = new Microsoft.Maps.Infobox(location,{
        htmlContent: html
    });
    infobox.setMap(map); //Add infobox to Map
}
