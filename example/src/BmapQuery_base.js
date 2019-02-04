"use strict";

//********************************************************************
// BingMaps v8
// BmapQuery: ( https://mapapi.org/indexb.php )
//********************************************************************
class Bmap {
    constructor(target) {
        this.target = target; //#id
        this.map = null;      //mapObject
        this.directionsManager = null;
        this.loc = null; //Geocode:location
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
     * Set location data for BingMaps
     * @method setLocation
     * @param lat    (float)   [47.6149]
     * @param lon    (float)   [-122.1941]
     * @returns      (Object)  location Object
     */
    setLocation(lat,lon){
        return new Microsoft.Maps.Location(lat,lon);
    }

    /**
     * Get Map center
     * @method getCenter
     * @returns  (Object) location Object
     */
    getCenter(){
        return this.map.getCenter();
    }

    /**
     * Get Mapcenter Latitude
     * @method getLat
     * @returns  (floot) latitude
     */
    getLat(){
        return this.map.getCenter().latitude;
    }

     /**
     * Get Mapcenter longitude
     * @method getLon
     * @returns  (floot) longitude
     */
    getLon(){
        return this.map.getCenter().longitude;
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
     * @method onMap
     * @param event    (string)   ["click"...]
     * @param collback (function) [function(){...}]
     */
    onMap(event, callback){
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
     * @method onPin
     * @param pushpin    (object)   [pushpinObject]
     * @param collback   (function) [function(){...}]
     */
    onPin(pushpin, event, callback){
        //Param Check
        if(typeof pushpin!=="object" || event==="" || typeof callback!=="function"){
            return false;
        }
        if(event=="click")     Microsoft.Maps.Events.addHandler(pushpin, 'click',     callback);
        if(event=="mousedown") Microsoft.Maps.Events.addHandler(pushpin, 'mousedown', callback);
        if(event=="mouseout")  Microsoft.Maps.Events.addHandler(pushpin, 'mouseout',  callback);
        if(event=="mouseover") Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', callback);
        if(event=="mouseup")   Microsoft.Maps.Events.addHandler(pushpin, 'mouseup',   callback);
    }

    /**
     * pushpin:Delete
     * @method deletePin
     */
    deletePin(){
        const map = this.map;
        for (let i=map.entities.getLength()-1; i>=0; i--) {
            const pushpin = map.entities.get(i);
            if (pushpin instanceof Microsoft.Maps.Pushpin) {
                map.entities.removeAt(i);
            }
        }
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
    pinIcon(lat, lon, icon, scale, anchor1, anchor2){
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
     * Layer:Add
     * @method layerAdd
     * @param pinObj   (float)    [pushpin]
     * @returns {boolean=false OR void }
     */
    layerAdd(lat,lon){
        const map = this.map;
        const location =  new Microsoft.Maps.Location(lat,lon);
        const pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
        const layer = new Microsoft.Maps.Layer();
        layer.add(pushpin);
        map.layers.insert(layer);
        return pin;
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
     * Infobox:Iframe
     * @method infoboxIframe
     * @param center      (object)   [ map.setLocation(47.6130, -122.1945); map.getCenter(); ]
     * @param width       (int)      [ 300 ]
     * @param height      (int)      [ 400 ]
     * @param title       (string)   [ "Movie..." ]
     * @param description (string)   ['<iframe src="https://channel9.msdn.com/..."></iframe>]
     */
    infoboxIframe(center,width,height,title,description){
        const infobox = new Microsoft.Maps.Infobox(center,{
            maxHeight: width, maxWidth: height, title: title, description: description
        });
        infobox.setMap(this.map);
    }

    /**
     * Search:Get Geocode
     * @method getGeocode
     * @param query     (string)   [Search string]
     * @param callback  (function) [function{...}]
     * @returns { callback:function }
     */
    async getGeocode(query,callback){
        const data = await this._geocodeQuery(query);
        callback(data);
    }
    _geocodeQuery(query) {
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
                                return resolve(r.results[0].location);
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

    /**
     * Search:Get Reverse Geocode
     * @method reverseGeocode
     * @param location  (object)   [location(lat,lon)]
     * @param callback  (function) [function{...}]
     * @returns { callback:function }
     */
    async reverseGeocode(location,callback){
        const data = await this._reverseGeocode(location);
        callback(data);
    }
    _reverseGeocode(location) {
        const map = this.map;
        return new Promise(resolve => {
            let searchManager;
            if (!searchManager) {
                let searchRequest = {
                    location: location,
                    callback: function (r) {
                        return resolve(r.name);
                    },
                    errorCallback: function (e) {
                        return resolve("Unable to reverse geocode location.");
                    }
                };
                //Create an instance of the search manager and call the reverseGeocode function again.
                Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                    searchManager = new Microsoft.Maps.Search.SearchManager(map);
                    searchManager.reverseGeocode(searchRequest);
                });
            }
        });
    }

    /**
    * Get Geocode from event
    * @method onGeocode
    * @param event    (string)   ["click"...]
    * @param collback (function) [function(){...}]
    */
    onGeocode(event, callback){
        if(event!=="" && typeof event==="string" || typeof callback!=="function") {
            Microsoft.Maps.Events.addHandler(this.map, event, callback);
        }
    }

    /**
    * direction:root search
    * ------------------------------------------------------------------
    * !! For confirmation, set the parameters for each country !!
    * + [ English => https://www.bing.com/...&setLang=en&setMkt=en-US ]
    * + [ Japan   => https://www.bing.com/...&setLang=ja&setMkt=ja-JP ]
    * ------------------------------------------------------------------
    * @method direction
    * @param details    (string)   [Destination details ]
    * @param mode       (string)   ["driving","walking"]
    * @param from       (string)   [root from]
    * @param to         (string)   [root to]
    * @param waypoints  (array)    * ["Bellevue","Yarrow Point"...]
    */
     direction(details,mode,from,to){
         const map = this.map;
         let directionsManager;
         const waypoints = arguments[4];
        //Load the directions module.
         Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
            //Create an instance of the directions manager.
            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
             //RouteMode
             if(mode == "walking"){
                 directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
             }else{
                 directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });
             }
            //Start waypoints to route between.
            const start = new Microsoft.Maps.Directions.Waypoint({address:from});
            directionsManager.addWaypoint(start);
            //Waypoints
            if(typeof waypoints!="undefined"){
                waypoints.forEach(function( waypoint ) {
                    let way = new Microsoft.Maps.Directions.Waypoint({address:waypoint});
                    directionsManager.addWaypoint(way);
                });
            }
            //EndPoint
            const end = new Microsoft.Maps.Directions.Waypoint({address:to});
            directionsManager.addWaypoint(end);
            //Specify the element in which the itinerary will be rendered.
            directionsManager.setRenderOptions({ itineraryContainer: details});
            //Add event handlers to directions manager.
            Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function(e){
                alert('Error: ' + e.message + '\r\nResponse Code: ' + e.responseCode)
            });
            //Time and distance
            Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated',function(e){
                //Get the current route index.
                var routeIdx = directionsManager.getRequestOptions().routeIndex;
                //Get the distance of the route, rounded to 2 decimal places.
                var distance = Math.round(e.routeSummary[routeIdx].distance * 100)/100;
                //Get the distance units used to calculate the route.
                var units = directionsManager.getRequestOptions().distanceUnit;
                var distanceUnits = '';
                if (units == Microsoft.Maps.Directions.DistanceUnit.km) {
                    distanceUnits = 'km'
                } else {
                    //Must be in miles
                    distanceUnits = 'miles'
                }
                //Time is in seconds, convert to minutes and round off.
                //var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);
                //document.querySelector(panel).innerHTML = 'Distance: ' + distance + ' ' + distanceUnits + '<br/>Time with Traffic: ' + time + ' minutes';
            });
            //Calculate directions.
            directionsManager.calculateDirections();
        });
    }

    /**
    * AutoSuggest
    * @method selectedSuggestion
    * @param searchBox           (string)   [ SuggestArea #id ]
    * @param searchBoxContainer  (string)   [ SuggestBox  #id ]
    * ------------------------------------------------------------------------
    * !! Only viewing user's region can be displayed !!
    * !! HTML:Add !!
    * <h1>AutoSuggest（Enter city in text box）</h1>
    * <div id='searchBoxContainer'>
    *     <input type='text' id='searchBox'><button id="clear">Clear</button>
    *  </div>
    * ------------------------------------------------------------------------
    */
    selectedSuggestion(searchBox,searchBoxContainer) {
        //AutoSuggest
        const map = this.map;
        Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
            var manager = new Microsoft.Maps.AutosuggestManager({
                map: map
            });
            manager.attachAutosuggest(searchBox,searchBoxContainer, function(result){
                //Remove previously selected suggestions from the map.
                map.entities.clear();
                map.entities.push(new Microsoft.Maps.Pushpin(result.location));
                map.setView({ bounds: result.bestView });
            });
        });
    }

    /**
    * Traffic
    * Coverage [ https://docs.microsoft.com/en-us/bingmaps/coverage/traffic-coverage ]
    * @method traffic
    */
    traffic(){
        const map = this.map;
        Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', function () {
            const manager = new Microsoft.Maps.Traffic.TrafficManager(map);
            manager.show();
        });
    }

    /**
    * SpatialDataService:getBoundary
    * @method getBoundary
    * @param  type  (string)
    */
    // [ "type" ]
    // *CountryRegion:Country or region.
    // *AdminDivision1:First administrative level within the country/region level, such as a state or a province.
    // *AdminDivision2:Second administrative level within the country/region level, such as a county.
    // *PopulatedPlace:A concentrated area of human settlement, such as a city, town or village.
    // *Neighborhood:A section of a populated place that is typically well-known, but often with indistinct boundaries.
    // *Postcode1:The smallest post code category, such as a zip code.
    // *Postcode2:The next largest post code category after Postcode1 that is created by aggregating Postcode1 areas.
    // *Postcode3:The next largest post code category after Postcode2 that is created by aggregating Postcode2 areas.
    // *Postcode4:The next largest post code category after Postcode3 that is created by aggregating Postcode3 areas.
    // Note: Not all entity types are available in all areas.
    //---------------------------------------------------
    getBoundary(type){
        const map = this.map;
        const geoDataRequestOptions = {
            entityType: type
        };
        Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function () {
            //Use the GeoData API manager to get the boundary
            Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(map.getCenter(), geoDataRequestOptions, map, function (data) {
                if (data.results && data.results.length > 0) {
                    map.entities.push(data.results[0].Polygons);
                }
            }, null, function errCallback(networkStatus, statusMessage) {
                console.log(networkStatus);
                console.log(statusMessage);
            });
        });
    }
    /**
    * SpatialDataService:Get multiple boundaries
    * @method getMultiBoundary
    * @param  type  (string)  ['Postcode'...]
    */
    getMultiBoundary(zipCodes){
        const map = this.map;
        //Create an array of locations to get the boundaries of
        const geoDataRequestOptions = {
            entityType: 'Postcode1'
        };
        Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function () {
            //Use the GeoData API manager to get the boundary
            Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(zipCodes, geoDataRequestOptions, map, function (data) {
                if (data.results && data.results.length > 0) {
                    map.entities.push(data.results[0].Polygons);
                }
            }, null, function errCallback(callbackState, networkStatus, statusMessage) {
                console.log(callbackState);
                console.log(networkStatus);
                console.log(statusMessage);
            });
        });
    }



}


















