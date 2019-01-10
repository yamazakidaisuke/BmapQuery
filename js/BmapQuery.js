"use strict";

//********************************************************************
// BingMaps Liblary(v8)
//********************************************************************
class Bmap {
    constructor(target) {
        this.target = target; //#id
        this.map = null;      //mapObject
    }

    /**
     * MapView
     * @method startMap
     * @param lat    (float)   [47.6149]
     * @param lon    (float)   [-122.1941]
     * @param typeid(string)   ["load","aerial","canvasDark","canvasLight","birdseye","grayscale","streetside"]
     * @param size    (int)    [1...20]
     * @returns {boolean=false OR Object=Map}
     */
    startMap(lat, lon, typeid, size){
        //Param Check
        if(this.target=="" || lat=="" || lon=="" || typeid=="" || size==""){
            return false;
        }
        //MapObject
        this.map = new Microsoft.Maps.Map(this.target, {
            center: new Microsoft.Maps.Location(lat,lon), //Location center position
            mapTypeId: eval("Microsoft.Maps.MapTypeId."+typeid), //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
            zoom: size  //Zoom:1=zoomOut, 20=zoomUp[ 1~20 ]
        });
    }

    /**
     * MapViewMove
     * @method changeMap
     * @param lat    (float)   [47.6149]
     * @param lon    (float)   [-122.1941]
     * @param id     (string)  ["load","aerial","canvasDark","canvasLight","birdseye","grayscale","streetside"]
     * @param num    (int)     [1...20]
     * @returns {boolean=false OR void }
     */
    changeMap(lat, lon, id, num){
        //Param Check
        if(this.map=="" || lat=="" || lon=="" || id=="" || num==""){
            return false;
        }
        //MapObject
        const loc = new Microsoft.Maps.Location(lat,lon);
        this.map.setView({
            mapTypeId: eval("Microsoft.Maps.MapTypeId."+id),
            center: loc,
            zoom: num,
            bounds:loc.bestView
        });
    }

    /**
     * map:Event
     * @method eventMap
     * @param event    (string)   ["click"...]
     * @param collback (function) [function(){...}]
     */
    eventMap(event, callback){
        //Param Check
        if(typeof this.map!="object" || event=="" || typeof callback!="function"){
            return false;
        }
        if(event=="viewchangestart") Microsoft.Maps.Events.addHandler(this.map, 'viewchangestart', callback);
        if(event=="viewchange")      Microsoft.Maps.Events.addHandler(this.map, 'viewchange',      callback);
        if(event=="viewchangeend")   Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend',   callback);
        if(event=="click")           Microsoft.Maps.Events.addHandler(this.map, 'click',           callback);
        if(event=="dblclick")        Microsoft.Maps.Events.addHandler(this.map, 'dblclick',        callback);
        if(event=="rightclick")      Microsoft.Maps.Events.addHandler(this.map, 'rightclick',      callback);
        if(event=="mousedown")       Microsoft.Maps.Events.addHandler(this.map, 'mousedown',       callback);
        if(event=="mouseout")        Microsoft.Maps.Events.addHandler(this.map, 'mouseout',        callback);
        if(event=="mouseover")       Microsoft.Maps.Events.addHandler(this.map, 'mouseover',       callback);
        if(event=="mouseup")         Microsoft.Maps.Events.addHandler(this.map, 'mouseup',         callback);
        if(event=="mousewheel")      Microsoft.Maps.Events.addHandler(this.map, 'mousewheel',      callback);
        if(event=="maptypechanged")  Microsoft.Maps.Events.addHandler(this.map, 'maptypechanged',  callback);
    }

    /**
     * Pushpin:Add
     * @method pin
     * @param lat    (float)    [47.6149]
     * @param lon    (float)    [-122.1941]
     * @param color  (string)   ["#ff0000"]
     * @param[arguments] drag   (boolean)  [true or false]
     * @param[arguments] clicked (boolean) [true or false]
     * @param[arguments] hover  (boolean)  [true or false]
     * @param[arguments] visib  (boolean)  [true or false]
     * @returns {boolean=false OR void }
     */
    pin(lat, lon, color){
        //Param Check
        let drag,clicked,hover,visib;
        if(this.map=="" || lat=="" || lon=="" || color==""){
            return false;
        }
        //arguments[4...7]
        if(typeof arguments[4]=="undefined" || arguments[4]==false){drag=false;   }else{drag=true;};
        if(typeof arguments[5]=="undefined" || arguments[5]==false){clicked=false;}else{clicked=true;};
        if(typeof arguments[6]=="undefined" || arguments[6]==false){hover=false;  }else{hover=true;};
        if(typeof arguments[7]=="undefined" || arguments[7]==true) {visib = true; }else{visib=false;};
        const location =  new Microsoft.Maps.Location(lat,lon);
        const pin = new Microsoft.Maps.Pushpin(location, {
            color: color,                //Color
            draggable:drag,              //MouseDraggable
            enableClickedStyle:clicked,  //Click
            enableHoverStyle:hover,      //MouseOver
            visible:visib                //show/hide
        });
        this.map.entities.push(pin);
        return pin;
    }
    /**
     * pushpin:Event
     * @method eventPin
     * @param pushpin    (object)   [pushpinObject]
     * @param collback   (function) [function(){...}]
     */
    eventPin(pushpin, event, callback){
        //Param Check
        if(typeof pushpin!="object" || event=="" || typeof callback!="function"){
            return false;
        }
        if(event=="click")     Microsoft.Maps.Events.addHandler(pushpin, 'click',     callback);
        if(event=="mousedown") Microsoft.Maps.Events.addHandler(pushpin, 'mousedown', callback);
        if(event=="mouseout")  Microsoft.Maps.Events.addHandler(pushpin, 'mouseout',  callback);
        if(event=="mouseover") Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', callback);
        if(event=="mouseup")   Microsoft.Maps.Events.addHandler(pushpin, 'mouseup',   callback);
    }

    /**
     * Pushpin:Add
     * @method pinText
     * @param lat       (float)    [47.6149]
     * @param lon       (float)    [-122.1941]
     * @param title     (string)   ["Tokyo Tower"]
     * @param subtitle  (string)   ["A symbol of Tokyo that used to be."]
     * @param text      (string)   ["A... or 1..."]
     * @returns {boolean=false OR void }
     */
    pinText(lat, lon, title,subtitle,text){
        //Param Check
        if(this.map=="" || lat=="" || lon=="" || title=="" || subtitle=="" || text==""){
            return false;
        }
        const location =  new Microsoft.Maps.Location(lat,lon);
        const pin = new Microsoft.Maps.Pushpin(location, {
            title:title,
            subTitle:subtitle,
            text:text
        });
        this.map.entities.push(pin);
        return pin;
    }

    /**
     * Pushpin:Add
     * @method pinIcon
     * @param lat       (float)    [47.6149]
     * @param lon       (float)    [-122.1941]
     * @param icon      (string)   ["ImagePath: img/poi_costom.png"]
     * @param scale     (float)    ["1.2...2.0"]
     * @param anchor1   (int)      ["Adjusting the position： widthPx"]
     * @param anchor2   (int)      ["Adjusting the position： heightPx"]
     * @returns {boolean=false OR void }
     */
    pinIcon (lat, lon, icon, scale, anchor1, anchor2){
        //Param Check
        if(this.map=="" || lat=="" || lon=="" || icon=="" ||  scale=="" ){
            return false;
        }
        const map = this.map;
        const location =  new Microsoft.Maps.Location(lat,lon);
        this._createScaledPushpin(location, icon, scale, anchor1, anchor2, function(pin) {
            map.entities.push(pin);
            return pin;
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
     */
    _createScaledPushpin(location, imgUrl, scale, anchor1, anchor2, callback) {
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
     * @method infobox
     * @param lat    (float)    [47.6149]
     * @param lon    (float)    [-122.1941]
     * @param t      (string)   ["title"]
     * @param d      (string)   ["description"]
     */
    infobox(lat, lon, t, d){
        //Param Check
        if(this.map=="" || lat=="" || lon=="" || t=="" || d==""){
            return false;
        }
        //Infobox
        const location = new Microsoft.Maps.Location(lat,lon);
        const infobox  = new Microsoft.Maps.Infobox(location,{
            title: t,
            description: d
        });
        infobox.setMap(this.map); //Add infobox to Map
    }
    
    /**
     * Infobox:HTML
     * @method infoboxHtml
     * @param lat    (float)    [47.6149]
     * @param lon    (float)    [-122.1941]
     * @param html   (string)   ['<div style="background-color: rgba(0,0,0,0.5);color: white;">ABCDE</div>']
     */
    infoboxHtml(lat, lon, html){
        //Param Check
        if(this.map=="" || lat=="" || lon=="" || html==""){
            return false;
        }
        //Infobox
        const location = new Microsoft.Maps.Location(lat,lon);
        const infobox  = new Microsoft.Maps.Infobox(location,{
            htmlContent: html
        });
        infobox.setMap(this.map); //Add infobox to Map
    }
    
    /**
     * Search:Get Geocode JSON
     * @method mapGeocodeValue or mapGeocodeHtml
     * @param query     (string)   [Search string]
     * @param callback  (function) [function{...}]
     * @returns { callback:function }
     */
    async getGeocode(query,callback){
        const data = await this.geocodeQuery(query);
        callback(data);
    }
    geocodeQuery(query) {
        const map = this.map;
        return new Promise(resolve => {
            let searchManager;
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                //searchManager Instance.
                searchManager = new Microsoft.Maps.Search.SearchManager(map);
               if(searchManager) {
                    searchManager.geocode({
                        where: query,
                        callback: function (r) {
                            if (r && r.results && r.results.length > 0) {
                                const pin = new Microsoft.Maps.Pushpin(r.results[0].location);
                                map.entities.push(pin);
                                map.setView({ bounds: r.results[0].bestView});
                                return resolve(JSON.stringify(r.results[0].location));
                            }
                        },
                        errorCallback: function (e) {
                            return resolve(false);
                        }
                    });
                }
            });
        });

    }

}




















