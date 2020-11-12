"use strict";

//********************************************************************
// BingMaps v8
// BmapQuery: v1.0.1 ( https://mapapi.org/indexb.php )
// Auther:Daisuke.Yamazaki
// MIT License.
//********************************************************************
class Bmap {
    //Init
    constructor(target) {
        this.target = target; //#id
        this.map = null;      //mapObject
        this.size = 10;      //Zoom value
        this.typeid ="load"; //TypeID
        this.loc; //Geocode:location
        this.layer = new Microsoft.Maps.Layer();
        this.watchId;
        this.tracker = []; //tracking Array
        this.time = [];   //watchPosition speed.
        this.infoboxs = [];
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
        this.size   = size;
        this.typeid = typeid;
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
     * @augments num    (int)     [1...20]
     * @returns {boolean=false OR void }
     */
    changeMap(lat, lon, id){
        //let size = this.size;
        //Param Check
        if(this.map=="" || lat=="" || lon=="" || id==""){
            return false;
        }
        //location set
        const loc = new Microsoft.Maps.Location(lat,lon);
        //augments[3]=Zoom Value.
        if(typeof arguments[3]!="undefined" && arguments[3]!=""){
            //zoomValue Change
            this.size = arguments[3];
            this.map.setView({
                mapTypeId: eval("Microsoft.Maps.MapTypeId."+id),
                center: loc,
                zoom: this.size,
                bounds:loc.bestView
            });
        }else{
            //zoomValue Not Change
            this.map.setView({
                mapTypeId: eval("Microsoft.Maps.MapTypeId."+id),
                center: loc,
                bounds:loc.bestView
            });
        }
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
     * pin
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
        if(typeof arguments[3]=="undefined" || arguments[3]==false){drag=false;   }else{drag=true;};
        if(typeof arguments[4]=="undefined" || arguments[4]==false){clicked=false;}else{clicked=true;};
        if(typeof arguments[5]=="undefined" || arguments[5]==false){hover=false;  }else{hover=true;};
        if(typeof arguments[6]=="undefined" || arguments[6]==true) {visib = true; }else{visib=false;};
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
     * pushpin add Layer
     * @method pinLayer
     * @param lat    (float)    [47.6149]
     * @param lon    (float)    [-122.1941]
     * @param color  (string)   ["#ff0000"]
     * @param[arguments] drag   (boolean)  [true or false]
     * @param[arguments] clicked (boolean) [true or false]
     * @param[arguments] hover  (boolean)  [true or false]
     * @param[arguments] visib  (boolean)  [true or false]
     * @returns pin (object)
     */
    pinLayer(lat,lon,color){
        const map   = this.map;
        //Param Check
        let drag,clicked,hover,visib;
        if(this.map=="" || lat=="" || lon=="" || color==""){
            return false;
        }
        //arguments[4...7]
        if(typeof arguments[3]=="undefined" || arguments[3]==false){drag=false;   }else{drag=true;};
        if(typeof arguments[4]=="undefined" || arguments[4]==false){clicked=false;}else{clicked=true;};
        if(typeof arguments[5]=="undefined" || arguments[5]==false){hover=false;  }else{hover=true;};
        if(typeof arguments[6]=="undefined" || arguments[6]==true) {visib = true; }else{visib=false;};
        const location =  new Microsoft.Maps.Location(lat,lon);
        const pin = new Microsoft.Maps.Pushpin(location, {
            color: color,                //Color
            draggable:drag,              //MouseDraggable
            enableClickedStyle:clicked,  //Click
            enableHoverStyle:hover,      //MouseOver
            visible:visib                //show/hide
        });
        //add Layer
        this.layer.add(pin);
        map.layers.insert(this.layer);
        return pin;
    }

    /**
     * Switch infobox
     * @method infoboxLayers
     * @param  option  (object)  [ lat, lon, min, max, height, width, title, description, show]
     * @param  flg     (bool)    [true=one/false=multiple]
     */
    infoboxLayers(option, flg) {
        const map = this.map;
        const layer = [];
        const pin   = [];
        const infobox = [];
        //Param Check
        if (map == "" || typeof option !== "object" || option.length===0) {
            return false;
        }
        //Layers Create
        for(let i=0; i<option.length; i++){
            const loc = new Microsoft.Maps.Location(option[i].lat, option[i].lon);
            //Layer Create
            layer[i] = new Microsoft.Maps.Layer();
            layer[i].metadata = {
                zoomRange: {min: 1, max: 20}
            };
            //Pin Create
            pin[i] = new Microsoft.Maps.Pushpin(loc, {
                color: option[i].pinColor
            });
            layer[i].add(pin[i]);

            //ClickEvent:InfoboxSwitch
            infobox[i] = new Microsoft.Maps.Infobox(loc, {
                maxHeight: option[i].height,
                maxWidth:  option[i].width,
                title:     option[i].title,
                description:  option[i].description,
                visible: option[i].show
            });
            infobox[i].setMap(map);
            //flg=3: Switch infobox
            Microsoft.Maps.Events.addHandler(pin[i], 'click', function () {
                //infobox:All Hide
                if(flg===true) {
                    for (let x = 0; x < infobox.length; x++) {
                        infobox[x].setOptions({
                            visible: false
                        });
                    }
                }
                //infobox:Show
                infobox[i].setOptions({
                    visible: true
                });
                infobox[i].setMap(map);
            });
            //MapObject add.
            map.layers.insert(layer[i]);
        }
    }



    /**
     * pushpin Clear Layer
     * @method pinLayerClear
     * @return void
    */
    pinLayerClear(){
        if(typeof arguments[0]=="undefined"){
            this.layer.clear();
        }else{
            this.layer.remove(arguments[0]);
        }

    }

    /**
     * polyline
     * @method polyline
     * @param locations    (array)    [47.6149]
     * @param lineColor    (string)   [-122.1941]
     * @param lineBold     (string)   ["#ff0000"]
     * @param arguments[3] (object)   [lineWidth, spaceWidth]
     */
    polyline(locations,lineColor,lineBold){
        let widths;
        //3.1 Get value arguments[3]
        if(typeof arguments[3]=="object"){
            //Auguments
            widths=arguments[3];
        }else{
            //Default
            widths=[];
        }
        //3.2 option.
        const options = {
            strokeColor: lineColor,
            strokeThickness: lineBold,
            strokeDashArray: widths
        }
        //3.3 polyline create
        const polyline = new Microsoft.Maps.Polyline( locations, options );
        this.map.entities.push(polyline);
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
        const n = this.infoboxs.length;
        const location = new Microsoft.Maps.Location(lat,lon);
        this.infoboxs[n]  = new Microsoft.Maps.Infobox(location,{
            title: t,
            description: d
        });
        this.infoboxs[n].setMap(this.map); //Add infobox to Map
    }
    
    /**
     * crearInfobox:Clear
     * @method crearInfobox
     */
    crearInfobox(){
        const n = this.infoboxs.length;
        for(let i=0; i<n; i++){
            this.infoboxs[i].setOptions({visible:false});
            this.infoboxs[i].setMap(null); //Add infobox to Map
        }
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
        const n = this.infoboxs.length; 
        const location = new Microsoft.Maps.Location(lat,lon);
        this.infoboxs[n]  = new Microsoft.Maps.Infobox(location,{
            htmlContent: html
        });
        this.infoboxs[n].setMap(this.map); //Add infobox to Map
    }

    /**
     * Infobox:Iframe
     * @method infoboxIframe
     * @param lat    (float)    [47.6149]
     * @param lon    (float)    [-122.1941]
     * @param width   (int)      [ 300 ]
     * @param height  (int)      [ 400 ]
     * @param title   (string)   [ "Movie..." ]
     * @param iframe  (string)   ['<iframe src="https://channel9.msdn.com/..."></iframe>]
     */
    infoboxIframe(lat,lon,width,height,title,iframe){
        const n = this.infoboxs.length;      
        this.infoboxs[n] = new Microsoft.Maps.Infobox(this.setLocation(lat, lon),{
            maxHeight: width, maxWidth: height, title: title, description: iframe
        });
        this.infoboxs[n].setMap(this.map);
    }


    /**
     * Infobox:Actions
     * @method onInfobox
     * @param lat      (float)    [47.6149]
     * @param lon      (float)    [-122.1941]
     * @param t        (string)   ["title":text or html]
     * @param d        (string)   ["description":text or html]
     * @param actions  (object)   [actions object]
     */
    onInfobox(lat,lon,t,d,actions) {
        const n = this.infoboxs.length;
        const loc = this.setLocation(lat,lon);
        this.infoboxs[n] = new Microsoft.Maps.Infobox(loc, {
            maxHeight:this.map.getHeight()-50,
            maxWidth:this.map.getWidth()-50,
            title: t,
            description: d,
            actions: actions,
            visible: true
        });
        this.infoboxs[n].setMap(this.map); //Add infobox to Map
    }



    /**
     * Search:Get Geocode
     * @method getGeocode
     * @param query     (string)   [Search string]
     * @param callback  (function) [function{...}]
     * @parm setView (bool) [true = map.setView()]
     * @returns { callback:function }
     */
    async getGeocode(query,callback, setView = true){
        const data = await this._geocodeQuery(query,setView);
        callback(data);
    }
    _geocodeQuery(query,setView) {
        const map = this.map;
        return new Promise(resolve => {
            let searchManager;
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                //searchManager Instance.
                searchManager = new Microsoft.Maps.Search.SearchManager(map);
               if(searchManager) {
                    searchManager.geocode({
                        where: query,
                        callback: function (r,setView) {
                            if (r && r.results && r.results.length > 0) {
                                return resolve(r.results[0]);
                            }
                        },
                        errorCallback: function (e) {
                            return resolve(false);
                        }
                    });
                }
            });
        })
        .then((data)=>{
            if(setView === true){
                map.setView({ bounds: data.bestView});
            }
            return data.location
        })

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

    /**
    * Get Search Boundary
    * @method getSearchBoundary
    * @param  search  (string)  'New York City'
    * @param  type    (string)
    *---------------------------------------------------
    * [ "type" ]
    * *CountryRegion: Country or region.
    * *AdminDivision1: First administrative level within the country/region level, such as a state or a province.
    * *AdminDivision2: Second administrative level within the country/region level, such as a county.
    * *PopulatedPlace: A concentrated area of human settlement, such as a city, town or village.
    * *Neighborhood: A section of a populated place that is typically well-known, but often with indistinct boundaries.
    * *Postcode1: The smallest post code category, such as a zip code.
    * *Postcode2: The next largest post code category after Postcode1 that is created by aggregating Postcode1 areas.
    * *Postcode3: The next largest post code category after Postcode2 that is created by aggregating Postcode2 areas.
    * *Postcode4: The next largest post code category after Postcode3 that is created by aggregating Postcode3 areas.
    * Note: Not all entity types are available in all areas.
    *---------------------------------------------------
    */
    getSearchBoundary(search,type){
        const map = this.map;
        //Load the Bing Spatial Data Services module
        Microsoft.Maps.loadModule(['Microsoft.Maps.SpatialDataService', 'Microsoft.Maps.Search'], function () {
            const searchManager = new Microsoft.Maps.Search.SearchManager(map);
            const geocodeRequest = {
                where: search,
                callback: function (geocodeResult) {
                    if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
                        map.setView({ bounds: geocodeResult.results[0].bestView });
                        const geoDataRequestOptions = {
                            entityType: type,
                            getAllPolygons: true
                        };
                        //Use the GeoData API manager to get the boundary of New York City
                        Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(geocodeResult.results[0].location, geoDataRequestOptions, map, function (data) {
                            if (data.results && data.results.length > 0) {
                                map.entities.push(data.results[0].Polygons);
                            }
                        }, null, function errCallback(networkStatus, statusMessage) {
                            console.log(networkStatus);
                            console.log(statusMessage);
                        });
                    }
                },
            };
            searchManager.geocode(geocodeRequest);
        });
    }


    /**
     * startTracking
     * @method startTracking
     * @param  chkflg (bool) [ true=console.log, false=not console.log ]
     * @return void
     */
    startTracking(chkFlg) {
        const map = this.map;
        const tracker = this.tracker;
        const time = this.time;
        //Add a pushpin to show the user's location.
        const userPin = new Microsoft.Maps.Pushpin(map.getCenter(), {visible: false });
        map.entities.push(userPin);
        //Watch the users location.
        this.watchId = navigator.geolocation.watchPosition(function(position) {
            //location now
            const loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
            //Update the user pushpin.
            userPin.setLocation(loc);
            userPin.setOptions({ visible: true });
            //Center the map on the user's location.
            map.setView({ center: loc });
            if(chkFlg===true) {
                console.log(loc);
            }
            // Add values ​​to the propaty tracker.
            tracker.push(loc);
            time.push(new Date(position.timestamp).toLocaleString());
        });
    }
    /**
     * stopTracking
     * @method stopTracking
     * @return void
     */
    stopTracking() {
        // Cancel the geolocation updates.
        navigator.geolocation.clearWatch(this.watchId);
        //Remove the user pushpin.
        this.map.entities.clear();
    }

    /**
     * Start Tracking Draw(Beta)[2019-05-16:Update]
     * @method startTrackingDraw
     * @param  lineColor (string) [ "#ff0000" ]
     * @param  lineWidth (int) [ 1,2,3...10... ]
     * @augments[3] (bool) [true=console.log(); or false=Not log ]
     * @return void
     */
    startTrackingDraw(lineColor, lineWidth) {
        const map = this.map;
        const tracker = this.tracker;
        const time = this.time;
        let userPin;
        let log=false;
        let id="";
        let iflg=0;
        if(typeof arguments[2]!="undefined" && arguments[2]!="") id=arguments[2];
        if(typeof arguments[3]!="undefined" && arguments[3]==true) log=true;
        //Init
        if(iflg===0) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
                userPin = new Microsoft.Maps.Pushpin(loc, {visible: true});
                map.entities.push(userPin);
            });
        }
        //Watchposition
        this.watchId = navigator.geolocation.watchPosition(function(position) {
            const loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
            userPin.setLocation(loc);
            map.setView({center: loc});
            tracker.push(loc);
            const nowTime = new Date(position.timestamp).toLocaleString();
            time.push(nowTime);
            const options = {
                strokeColor: lineColor,
                strokeThickness: lineWidth
            };
            map.entities.push(new Microsoft.Maps.Polyline(tracker, options));
            if(log==true) {
                console.log(tracker);
                console.log(time);
            }
            if(id!="" && nowTime!=null){
                document.querySelector(id).innerHTML=nowTime;
            }
            iflg++;
        });
    }
    /**
     * Stop TrackingDraw
     * @method stopTrackingDraw
     * @return void
     */
    stopTrackingDraw() {
        // Cancel the geolocation updates.
        navigator.geolocation.clearWatch(this.watchId);
    }
    /**
     * Clear Map
     * @method clearMap
     * @return void
     */
    clearMap() {
        this.map.entities.clear();
    }
    /**
     * get Tracking Data
     * @method getTrackingData
     * @return this.tracker (array)
     */
    getTrackingData() {
        return this.tracker;
    }
    /**
     * + deprecated +
     * get Tracking Speed Data
     * @method getTrackingSpeed
     * @return this.speed (array)
     */
    getTrackingSpeed() {
        return this.time;
    }

    /**
     * get Tracking Time Data
     * @method getTrackingTime
     * @return this.time(array)
     */
    getTrackingTime() {
        return this.time;
    }

    /**
     * Clear Tracking Data
     * @method clearTrackingData
     * @return void
     */
    clearTrackingData(){
        this.tracker = [];
        this.time = [];
    }

    /**
     * Circle: Meter
     * @method circle
     * @param  meter (int) Meters
     * @param style (Object) [pinColor(string), fillColor(string), strokeWidth(int)]
     * @arguments event (string) arguments[2]
     * @arguments callback (function) arguments[3]
     * @return void
     */
    circle(meter, style) {
        const map      = this.map;
        const event    = arguments[2];
        const callback = arguments[3];
        //Load the spatial math module
        Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {

            //Request the user's location
            navigator.geolocation.getCurrentPosition(function (position) {
                const loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
                //Center the map on the user's location.
                map.setView({
                    center: loc
                });

                //Create an accuracy circle
                const path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, meter, 36, Microsoft.Maps.SpatialMath.Meters);
                const poly = new Microsoft.Maps.Polygon(path,{
                    fillColor: typeof style.fillColor==="undefined" ? "rgba(255,0,0,0.3)" : style.fillColor,
                    strokeThickness: typeof style.strokeWidth==="undefined" ? 0 : style.strokeWidth
                });
                map.entities.push(poly);

                //Event:add [click,mousedown,mouseout,mouseover,mouseup]
                if((event==="click" || event==="mousedown" || event==="mouseout" || event==="mouseover" || event==="mouseup") && typeof callback==="function"){
                    Microsoft.Maps.Events.addHandler(poly, event, callback);
                }

                //Add a pushpin at the user's location.
                const pin = new Microsoft.Maps.Pushpin(loc,{
                    color: typeof style.pinColor==="undefined" ? "#ff0000" : style.pinColor
                });
                map.entities.push(pin);

            });
        });
    }

    /**
     * Circle location set
     * @method circleSet
     * @param lat (float) latitude
     * @param lon (float) longitude
     * @param  meter (int) Meters
     * @param style (Object) [pinColor(string), fillColor(string), strokeWidth(int)]
     * @arguments event (string) arguments[2]
     * @arguments callback (function) arguments[3]
     * @return void
     */
    circleSet(lat, lon, meter, style) {
        const map = this.map;
        const event    = arguments[4];
        const callback = arguments[5];
        //Load the spatial math module
        Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {
            //Request the user's location
            const loc = new Microsoft.Maps.Location(lat, lon);
            //Create an accuracy circle
            const path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, meter, 36, Microsoft.Maps.SpatialMath.Meters);
            const poly = new Microsoft.Maps.Polygon(path,{
                fillColor: typeof style.fillColor==="undefined" ? "rgba(255,0,0,0.3)" : style.fillColor,
                strokeThickness: typeof style.strokeWidth==="undefined" ? 0 : style.strokeWidth
            });
            map.entities.push(poly);
            //Event:add [click,mousedown,mouseout,mouseover,mouseup]
            if((event==="click" || event==="mousedown" || event==="mouseout" || event==="mouseover" || event==="mouseup") && typeof callback==="function"){
                Microsoft.Maps.Events.addHandler(poly, event, callback);
            }
            //Add a pushpin at the user's location.
            const pin = new Microsoft.Maps.Pushpin(loc,{
                color: typeof style.pinColor==="undefined" ? "#ff0000" : style.pinColor
            });
            map.entities.push(pin);
        });
    }

    /**
     * SetLocation Multiple Boundary
     * @method setLocationBoundary
     * @param  search  (array)   [ 'Russia', 'France', 'Italy']
     * @param  zoom    (array)   [ [min,max],[min,max],[min,max] ]
     * @param  type    (string)
     *---------------------------------------------------
     * [ "type" ]
     * *CountryRegion: Country or region.
     * *AdminDivision1: First administrative level within the country/region level, such as a state or a province.
     * *AdminDivision2: Second administrative level within the country/region level, such as a county.
     * *PopulatedPlace: A concentrated area of human settlement, such as a city, town or village.
     * *Neighborhood: A section of a populated place that is typically well-known, but often with indistinct boundaries.
     * *Postcode1: The smallest post code category, such as a zip code.
     * *Postcode2: The next largest post code category after Postcode1 that is created by aggregating Postcode1 areas.
     * *Postcode3: The next largest post code category after Postcode2 that is created by aggregating Postcode2 areas.
     * *Postcode4: The next largest post code category after Postcode3 that is created by aggregating Postcode3 areas.
     * Note: Not all entity types are available in all areas.
     *---------------------------------------------------
     */
    setLocationBoundary(searchs,zoom,type){
        const map = this.map;
        let layer = [];
        let getAllPolygonFlg = (typeof arguments[3]==="undefined" || arguments[3]!=true) ? false : true;
        //console.log(getAllPolygonFlg);
        //Load the Bing Spatial Data Services module
        Microsoft.Maps.loadModule(['Microsoft.Maps.SpatialDataService', 'Microsoft.Maps.Search'], function () {
            const searchManager = new Microsoft.Maps.Search.SearchManager(map);
            for(var i=0; i<searchs.length;i++) {
                searchManager.geocode(geo(i,zoom[i]));
            }
            function geo(i,zoom) {
                //console.log( searchs[i]);
                return {
                    where: searchs[i],
                    callback: function (geocodeResult) {
                        if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
                            //.setView({bounds: geocodeResult.results[0].bestView});
                            const geoDataRequestOptions = {
                                entityType: type,
                                getAllPolygons: getAllPolygonFlg
                            };
                            //Use the GeoData API manager to get the boundary of New York City
                            Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(geocodeResult.results[0].location, geoDataRequestOptions, map, function (data) {
                                if (data.results && data.results.length > 0) {
                                    layer[i] = new Microsoft.Maps.Layer();
                                    ///console.log(zoom);
                                    if(typeof zoom=="undefined"){
                                        layer[i].metadata = {
                                            zoomRange: { min: 1, max: 20 }
                                        };
                                    }else{
                                        layer[i].metadata = {
                                            zoomRange: { min: zoom[0], max: zoom[1] }
                                        };
                                    }
                                    //Layer Add
                                    layer[i].add(data.results[0].Polygons);
                                    map.layers.insert(layer[i]);
                                    // map.entities.push(data.results[0].Polygons);
                                }
                            }, null, function errCallback(networkStatus, statusMessage) {
                                console.log(networkStatus);
                                console.log(statusMessage);
                            });
                        }
                    }
                }
            }
        });
        //Add a viewchangeend event to the map so that it updates the visibility of the layers.
        Microsoft.Maps.Events.addHandler(map, 'viewchangeend', updateLayerVisibility);
        //Do an initial update of the visibility.
        updateLayerVisibility();
        function updateLayerVisibility() {
            //Get the current zoom level of the map.
            var zoom = map.getZoom();
            var layer;
            //Loop through the layers in the map and check to see if it has zoomRange metadata.
            for(var i=0;i<map.layers.length;i++){
                layer = map.layers[i];
                if(layer.metadata && layer.metadata.zoomRange){
                    if (zoom >= layer.metadata.zoomRange.min && zoom <= layer.metadata.zoomRange.max) {
                        layer.setVisible(true);
                    } else {
                        layer.setVisible(false);
                    }
                }
            }
        }
    }

    /**
    * heatMap GeoJson
    * @method heatMap
    * @param  geojson  (string)  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
     */
    heatMap(geojson){
        const map = this.map;
        //Load the GeoJSON and HeatMap modules
        Microsoft.Maps.loadModule(['Microsoft.Maps.GeoJson', 'Microsoft.Maps.HeatMap'], function () {
            // earthquake data in the past 30 days from usgs.gov
            Microsoft.Maps.GeoJson.readFromUrl(geojson, function (shapes) {
                const heatMap = new Microsoft.Maps.HeatMapLayer(shapes, {
                    radius: 5,
                    propertyAsWeight: 'mag',
                });
                map.layers.insert(heatMap);
            });
        });
    }

    /**
     * geolocation
     * @method geolocation
     * @param callback  (function) [function{...}]
     */
    async geolocation(callback){
       const data = await this._getGeolocation();
       callback(data);
    };
    _getGeolocation(){
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition( (position) => {
                console.log(position);
                return resolve(position);
            });
        });
    };


}


















