"use strict";
//********************************************************************
// BingMaps v8
// BmapQuery: v0.8.3 ( https://mapapi.org/indexb.php )
//********************************************************************

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bmap =
    /*#__PURE__*/
    function () {
        //Init
        function Bmap(target) {
            _classCallCheck(this, Bmap);

            this.target = target; //#id

            this.map = null; //mapObject

            this.directionsManager = null;
            this.loc; //Geocode:location

            this.layer = new Microsoft.Maps.Layer();
            this.watchId;
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


        _createClass(Bmap, [{
            key: "startMap",
            value: function startMap(lat, lon, typeid, size) {
                //Param Check
                if (this.target == "" || lat == "" || lon == "" || typeid == "" || size == "") {
                    return false;
                } //MapObject


                this.map = new Microsoft.Maps.Map(this.target, {
                    center: new Microsoft.Maps.Location(lat, lon),
                    //Location center position
                    mapTypeId: eval("Microsoft.Maps.MapTypeId." + typeid),
                    //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
                    zoom: size //Zoom:1=zoomOut, 20=zoomUp[ 1~20 ]

                });
            }
            /**
             * Set location data for BingMaps
             * @method setLocation
             * @param lat    (float)   [47.6149]
             * @param lon    (float)   [-122.1941]
             * @returns      (Object)  location Object
             */

        }, {
            key: "setLocation",
            value: function setLocation(lat, lon) {
                return new Microsoft.Maps.Location(lat, lon);
            }
            /**
             * Get Map center
             * @method getCenter
             * @returns  (Object) location Object
             */

        }, {
            key: "getCenter",
            value: function getCenter() {
                return this.map.getCenter();
            }
            /**
             * Get Mapcenter Latitude
             * @method getLat
             * @returns  (floot) latitude
             */

        }, {
            key: "getLat",
            value: function getLat() {
                return this.map.getCenter().latitude;
            }
            /**
             * Get Mapcenter longitude
             * @method getLon
             * @returns  (floot) longitude
             */

        }, {
            key: "getLon",
            value: function getLon() {
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

        }, {
            key: "changeMap",
            value: function changeMap(lat, lon, id, num) {
                //Param Check
                if (this.map == "" || lat == "" || lon == "" || id == "" || num == "") {
                    return false;
                } //MapObject


                var loc = new Microsoft.Maps.Location(lat, lon);
                this.map.setView({
                    mapTypeId: eval("Microsoft.Maps.MapTypeId." + id),
                    center: loc,
                    zoom: num,
                    bounds: loc.bestView
                });
            }
            /**
             * map:Event
             * @method onMap
             * @param event    (string)   ["click"...]
             * @param collback (function) [function(){...}]
             */

        }, {
            key: "onMap",
            value: function onMap(event, callback) {
                //Param Check
                if (_typeof(this.map) != "object" || event == "" || typeof callback != "function") {
                    return false;
                }

                if (event == "viewchangestart") Microsoft.Maps.Events.addHandler(this.map, 'viewchangestart', callback);
                if (event == "viewchange") Microsoft.Maps.Events.addHandler(this.map, 'viewchange', callback);
                if (event == "viewchangeend") Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', callback);
                if (event == "click") Microsoft.Maps.Events.addHandler(this.map, 'click', callback);
                if (event == "dblclick") Microsoft.Maps.Events.addHandler(this.map, 'dblclick', callback);
                if (event == "rightclick") Microsoft.Maps.Events.addHandler(this.map, 'rightclick', callback);
                if (event == "mousedown") Microsoft.Maps.Events.addHandler(this.map, 'mousedown', callback);
                if (event == "mouseout") Microsoft.Maps.Events.addHandler(this.map, 'mouseout', callback);
                if (event == "mouseover") Microsoft.Maps.Events.addHandler(this.map, 'mouseover', callback);
                if (event == "mouseup") Microsoft.Maps.Events.addHandler(this.map, 'mouseup', callback);
                if (event == "mousewheel") Microsoft.Maps.Events.addHandler(this.map, 'mousewheel', callback);
                if (event == "maptypechanged") Microsoft.Maps.Events.addHandler(this.map, 'maptypechanged', callback);
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

        }, {
            key: "pin",
            value: function pin(lat, lon, color) {
                //Param Check
                var drag, clicked, hover, visib;

                if (this.map == "" || lat == "" || lon == "" || color == "") {
                    return false;
                } //arguments[4...7]


                if (typeof arguments[3] == "undefined" || arguments[3] == false) {
                    drag = false;
                } else {
                    drag = true;
                }

                ;

                if (typeof arguments[4] == "undefined" || arguments[4] == false) {
                    clicked = false;
                } else {
                    clicked = true;
                }

                ;

                if (typeof arguments[5] == "undefined" || arguments[5] == false) {
                    hover = false;
                } else {
                    hover = true;
                }

                ;

                if (typeof arguments[6] == "undefined" || arguments[6] == true) {
                    visib = true;
                } else {
                    visib = false;
                }

                ;
                var location = new Microsoft.Maps.Location(lat, lon);
                var pin = new Microsoft.Maps.Pushpin(location, {
                    color: color,
                    //Color
                    draggable: drag,
                    //MouseDraggable
                    enableClickedStyle: clicked,
                    //Click
                    enableHoverStyle: hover,
                    //MouseOver
                    visible: visib //show/hide

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

        }, {
            key: "onPin",
            value: function onPin(pushpin, event, callback) {
                //Param Check
                if (_typeof(pushpin) !== "object" || event === "" || typeof callback !== "function") {
                    return false;
                }

                if (event == "click") Microsoft.Maps.Events.addHandler(pushpin, 'click', callback);
                if (event == "mousedown") Microsoft.Maps.Events.addHandler(pushpin, 'mousedown', callback);
                if (event == "mouseout") Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', callback);
                if (event == "mouseover") Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', callback);
                if (event == "mouseup") Microsoft.Maps.Events.addHandler(pushpin, 'mouseup', callback);
            }
            /**
             * pushpin:Delete
             * @method deletePin
             */

        }, {
            key: "deletePin",
            value: function deletePin() {
                var map = this.map;

                for (var i = map.entities.getLength() - 1; i >= 0; i--) {
                    var pushpin = map.entities.get(i);

                    if (_instanceof(pushpin, Microsoft.Maps.Pushpin)) {
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

        }, {
            key: "pinText",
            value: function pinText(lat, lon, title, subtitle, text) {
                //Param Check
                if (this.map == "" || lat == "" || lon == "" || title == "" || subtitle == "" || text == "") {
                    return false;
                }

                var location = new Microsoft.Maps.Location(lat, lon);
                var pin = new Microsoft.Maps.Pushpin(location, {
                    title: title,
                    subTitle: subtitle,
                    text: text
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

        }, {
            key: "pinIcon",
            value: function pinIcon(lat, lon, icon, scale, anchor1, anchor2) {
                //Param Check
                if (this.map == "" || lat == "" || lon == "" || icon == "" || scale == "") {
                    return false;
                }

                var map = this.map;
                var location = new Microsoft.Maps.Location(lat, lon);

                this._createScaledPushpin(location, icon, scale, anchor1, anchor2, function (pin) {
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

        }, {
            key: "pinLayer",
            value: function pinLayer(lat, lon, color) {
                var map = this.map; //Param Check

                var drag, clicked, hover, visib;

                if (this.map == "" || lat == "" || lon == "" || color == "") {
                    return false;
                } //arguments[4...7]


                if (typeof arguments[3] == "undefined" || arguments[3] == false) {
                    drag = false;
                } else {
                    drag = true;
                }

                ;

                if (typeof arguments[4] == "undefined" || arguments[4] == false) {
                    clicked = false;
                } else {
                    clicked = true;
                }

                ;

                if (typeof arguments[5] == "undefined" || arguments[5] == false) {
                    hover = false;
                } else {
                    hover = true;
                }

                ;

                if (typeof arguments[6] == "undefined" || arguments[6] == true) {
                    visib = true;
                } else {
                    visib = false;
                }

                ;
                var location = new Microsoft.Maps.Location(lat, lon);
                var pin = new Microsoft.Maps.Pushpin(location, {
                    color: color,
                    //Color
                    draggable: drag,
                    //MouseDraggable
                    enableClickedStyle: clicked,
                    //Click
                    enableHoverStyle: hover,
                    //MouseOver
                    visible: visib //show/hide

                }); //add Layer

                this.layer.add(pin);
                map.layers.insert(this.layer);
                return pin;
            }
            /**
             * pushpin Clear Layer
             * @method pinLayerClear
             * @return void
             */

        }, {
            key: "pinLayerClear",
            value: function pinLayerClear() {
                if (typeof arguments[0] == "undefined") {
                    this.layer.clear();
                } else {
                    this.layer.remove(arguments[0]);
                }
            }
            /**
             * polyline
             * @method polyline
             * @param locations    (array)    [47.6149]
             * @param lineColor    (string)   [-122.1941]
             * @param lineBold     (string)   ["#ff0000"]
             * @param arguments[3] (array)    [lineWidth, spaceWidth]
             */

        }, {
            key: "polyline",
            value: function polyline(locations, lineColor, lineBold) {
                var widths; //3.1 Get value arguments[3]

                if (_typeof(arguments[3]) == "object") {
                    //Auguments
                    widths = arguments[3];
                } else {
                    //Default
                    widths = [];
                } //3.2 option.


                var options = {
                    strokeColor: lineColor,
                    strokeThickness: lineBold,
                    strokeDashArray: widths //3.3 polyline create

                };
                var polyline = new Microsoft.Maps.Polyline(locations, options);
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

        }, {
            key: "_createScaledPushpin",
            value: function _createScaledPushpin(location, imgUrl, scale, anchor1, anchor2, callback) {
                var img = new Image();

                img.onload = function () {
                    var c = document.createElement('canvas');
                    c.width = img.width * scale; //scale

                    c.height = img.height * scale; //scale
                    //Draw scaled image

                    var context = c.getContext('2d');
                    context.drawImage(img, 0, 0, c.width, c.height);
                    var pin = new Microsoft.Maps.Pushpin(location, {
                        icon: c.toDataURL(),
                        anchor: new Microsoft.Maps.Point(anchor1, anchor2)
                    }); //callback

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

        }, {
            key: "infobox",
            value: function infobox(lat, lon, t, d) {
                //Param Check
                if (this.map == "" || lat == "" || lon == "" || t == "" || d == "") {
                    return false;
                } //Infobox


                var location = new Microsoft.Maps.Location(lat, lon);
                var infobox = new Microsoft.Maps.Infobox(location, {
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

        }, {
            key: "infoboxHtml",
            value: function infoboxHtml(lat, lon, html) {
                //Param Check
                if (this.map == "" || lat == "" || lon == "" || html == "") {
                    return false;
                } //Infobox


                var location = new Microsoft.Maps.Location(lat, lon);
                var infobox = new Microsoft.Maps.Infobox(location, {
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

        }, {
            key: "infoboxIframe",
            value: function infoboxIframe(center, width, height, title, description) {
                var infobox = new Microsoft.Maps.Infobox(center, {
                    maxHeight: width,
                    maxWidth: height,
                    title: title,
                    description: description
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

        }, {
            key: "getGeocode",
            value: async function getGeocode(query, callback) {
                var data = await this._geocodeQuery(query);
                callback(data);
            }
        }, {
            key: "_geocodeQuery",
            value: function _geocodeQuery(query) {
                var map = this.map;
                return new Promise(function (resolve) {
                    var searchManager;
                    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                        //searchManager Instance.
                        searchManager = new Microsoft.Maps.Search.SearchManager(map);

                        if (searchManager) {
                            searchManager.geocode({
                                where: query,
                                callback: function callback(r) {
                                    if (r && r.results && r.results.length > 0) {
                                        var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
                                        map.entities.push(pin);
                                        map.setView({
                                            bounds: r.results[0].bestView
                                        });
                                        return resolve(r.results[0].location);
                                    }
                                },
                                errorCallback: function errorCallback(e) {
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

        }, {
            key: "reverseGeocode",
            value: async function reverseGeocode(location, callback) {
                var data = await this._reverseGeocode(location);
                callback(data);
            }
        }, {
            key: "_reverseGeocode",
            value: function _reverseGeocode(location) {
                var map = this.map;
                return new Promise(function (resolve) {
                    var searchManager;

                    if (!searchManager) {
                        var searchRequest = {
                            location: location,
                            callback: function callback(r) {
                                return resolve(r.name);
                            },
                            errorCallback: function errorCallback(e) {
                                return resolve("Unable to reverse geocode location.");
                            }
                        }; //Create an instance of the search manager and call the reverseGeocode function again.

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

        }, {
            key: "onGeocode",
            value: function onGeocode(event, callback) {
                if (event !== "" && typeof event === "string" || typeof callback !== "function") {
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

        }, {
            key: "direction",
            value: function direction(details, mode, from, to) {
                var map = this.map;
                var directionsManager;
                var waypoints = arguments[4]; //Load the directions module.

                Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                    //Create an instance of the directions manager.
                    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map); //RouteMode

                    if (mode == "walking") {
                        directionsManager.setRequestOptions({
                            routeMode: Microsoft.Maps.Directions.RouteMode.walking
                        });
                    } else {
                        directionsManager.setRequestOptions({
                            routeMode: Microsoft.Maps.Directions.RouteMode.driving
                        });
                    } //Start waypoints to route between.


                    var start = new Microsoft.Maps.Directions.Waypoint({
                        address: from
                    });
                    directionsManager.addWaypoint(start); //Waypoints

                    if (typeof waypoints != "undefined") {
                        waypoints.forEach(function (waypoint) {
                            var way = new Microsoft.Maps.Directions.Waypoint({
                                address: waypoint
                            });
                            directionsManager.addWaypoint(way);
                        });
                    } //EndPoint


                    var end = new Microsoft.Maps.Directions.Waypoint({
                        address: to
                    });
                    directionsManager.addWaypoint(end); //Specify the element in which the itinerary will be rendered.

                    directionsManager.setRenderOptions({
                        itineraryContainer: details
                    }); //Add event handlers to directions manager.

                    Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function (e) {
                        alert('Error: ' + e.message + '\r\nResponse Code: ' + e.responseCode);
                    }); //Time and distance

                    Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (e) {
                        //Get the current route index.
                        var routeIdx = directionsManager.getRequestOptions().routeIndex; //Get the distance of the route, rounded to 2 decimal places.

                        var distance = Math.round(e.routeSummary[routeIdx].distance * 100) / 100; //Get the distance units used to calculate the route.

                        var units = directionsManager.getRequestOptions().distanceUnit;
                        var distanceUnits = '';

                        if (units == Microsoft.Maps.Directions.DistanceUnit.km) {
                            distanceUnits = 'km';
                        } else {
                            //Must be in miles
                            distanceUnits = 'miles';
                        } //Time is in seconds, convert to minutes and round off.
                        //var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);
                        //document.querySelector(panel).innerHTML = 'Distance: ' + distance + ' ' + distanceUnits + '<br/>Time with Traffic: ' + time + ' minutes';

                    }); //Calculate directions.

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

        }, {
            key: "selectedSuggestion",
            value: function selectedSuggestion(searchBox, searchBoxContainer) {
                //AutoSuggest
                var map = this.map;
                Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
                    var manager = new Microsoft.Maps.AutosuggestManager({
                        map: map
                    });
                    manager.attachAutosuggest(searchBox, searchBoxContainer, function (result) {
                        //Remove previously selected suggestions from the map.
                        map.entities.clear();
                        map.entities.push(new Microsoft.Maps.Pushpin(result.location));
                        map.setView({
                            bounds: result.bestView
                        });
                    });
                });
            }
            /**
             * Traffic
             * Coverage [ https://docs.microsoft.com/en-us/bingmaps/coverage/traffic-coverage ]
             * @method traffic
             */

        }, {
            key: "traffic",
            value: function traffic() {
                var map = this.map;
                Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', function () {
                    var manager = new Microsoft.Maps.Traffic.TrafficManager(map);
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

        }, {
            key: "getBoundary",
            value: function getBoundary(type) {
                var map = this.map;
                var geoDataRequestOptions = {
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

        }, {
            key: "getMultiBoundary",
            value: function getMultiBoundary(zipCodes) {
                var map = this.map; //Create an array of locations to get the boundaries of

                var geoDataRequestOptions = {
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

        }, {
            key: "getSearchBoundary",
            value: function getSearchBoundary(search, type) {
                var map = this.map; //Load the Bing Spatial Data Services module

                Microsoft.Maps.loadModule(['Microsoft.Maps.SpatialDataService', 'Microsoft.Maps.Search'], function () {
                    var searchManager = new Microsoft.Maps.Search.SearchManager(map);
                    var geocodeRequest = {
                        where: search,
                        callback: function callback(geocodeResult) {
                            if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
                                map.setView({
                                    bounds: geocodeResult.results[0].bestView
                                });
                                var geoDataRequestOptions = {
                                    entityType: type,
                                    getAllPolygons: true
                                }; //Use the GeoData API manager to get the boundary of New York City

                                Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(geocodeResult.results[0].location, geoDataRequestOptions, map, function (data) {
                                    if (data.results && data.results.length > 0) {
                                        map.entities.push(data.results[0].Polygons);
                                    }
                                }, null, function errCallback(networkStatus, statusMessage) {
                                    console.log(networkStatus);
                                    console.log(statusMessage);
                                });
                            }
                        }
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

        }, {
            key: "startTracking",
            value: function startTracking(chkFlg) {
                var map = this.map; //Add a pushpin to show the user's location.

                var userPin = new Microsoft.Maps.Pushpin(map.getCenter(), {
                    visible: false
                });
                map.entities.push(userPin); //Watch the users location.

                this.watchId = navigator.geolocation.watchPosition(function (position) {
                    //location now
                    var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);

                    if (chkFlg === true) {
                        console.log(position.coords);
                    } //Update the user pushpin.


                    userPin.setLocation(loc);
                    userPin.setOptions({
                        visible: true
                    }); //Center the map on the user's location.

                    map.setView({
                        center: loc
                    });
                });
            }
            /**
             * stopTracking
             * @method stopTracking
             * @return void
             */

        }, {
            key: "stopTracking",
            value: function stopTracking() {
                // Cancel the geolocation updates.
                navigator.geolocation.clearWatch(this.watchId); //Remove the user pushpin.

                this.map.entities.clear();
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

        }, {
            key: "circle",
            value: function circle(meter, style) {
                var map = this.map;
                var event = arguments[2];
                var callback = arguments[3]; //Load the spatial math module

                Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {
                    //Request the user's location
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude); //Center the map on the user's location.

                        map.setView({
                            center: loc
                        }); //Create an accuracy circle

                        var path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, meter, 36, Microsoft.Maps.SpatialMath.Meters);
                        var poly = new Microsoft.Maps.Polygon(path, {
                            fillColor: typeof style.fillColor === "undefined" ? "rgba(255,0,0,0.3)" : style.fillColor,
                            strokeThickness: typeof style.strokeWidth === "undefined" ? 0 : style.strokeWidth
                        });
                        map.entities.push(poly); //Event:add [click,mousedown,mouseout,mouseover,mouseup]

                        if ((event === "click" || event === "mousedown" || event === "mouseout" || event === "mouseover" || event === "mouseup") && typeof callback === "function") {
                            Microsoft.Maps.Events.addHandler(poly, event, callback);
                        } //Add a pushpin at the user's location.


                        var pin = new Microsoft.Maps.Pushpin(loc, {
                            color: typeof style.pinColor === "undefined" ? "#ff0000" : style.pinColor
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

        }, {
            key: "circleSet",
            value: function circleSet(lat, lon, meter, style) {
                var map = this.map;
                var event = arguments[4];
                var callback = arguments[5]; //Load the spatial math module

                Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {
                    //Request the user's location
                    var loc = new Microsoft.Maps.Location(lat, lon); //Create an accuracy circle

                    var path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, meter, 36, Microsoft.Maps.SpatialMath.Meters);
                    var poly = new Microsoft.Maps.Polygon(path, {
                        fillColor: typeof style.fillColor === "undefined" ? "rgba(255,0,0,0.3)" : style.fillColor,
                        strokeThickness: typeof style.strokeWidth === "undefined" ? 0 : style.strokeWidth
                    });
                    map.entities.push(poly); //Event:add [click,mousedown,mouseout,mouseover,mouseup]

                    if ((event === "click" || event === "mousedown" || event === "mouseout" || event === "mouseover" || event === "mouseup") && typeof callback === "function") {
                        Microsoft.Maps.Events.addHandler(poly, event, callback);
                    } //Add a pushpin at the user's location.


                    var pin = new Microsoft.Maps.Pushpin(loc, {
                        color: typeof style.pinColor === "undefined" ? "#ff0000" : style.pinColor
                    });
                    map.entities.push(pin);
                });
            }
        }]);

        return Bmap;
    }();