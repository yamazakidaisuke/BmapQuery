BmapQuery
==========

Copyright (c) 2018-2019, BingMapsGO! - DaisukeYamazaki. All rights reserved.
https://mapapi.org - See LICENSE.md for license information.

BmapQuery is a Microsoft BingMaps V8 functions. to be used inside web pages.
component to be used as part of web applications and websites.

## Documentation

The full BmapQuery documentation is available online at the following address:
https://mapapi.org

## Installation

Installing BmapQuery is an easy task. Just follow these simple steps:

 1. **Download** the latest version from the Github website:
    https://github.com/yamazakidaisuke/BmapQuery. 
    You should have already completed this step, but be sure you have the very latest version.


**Note:** BmapQuery is by default installed in the `js` folder. You can
place the files in whichever you want though.

## Checking Your Installation

To test your installation, just call the following page at your website:

	https://mapapi.org/open.php?file=example_funcs_infobox

## For example
**[html]**

    <!-- Load BingMapsControl api [callback=GetMap] -->
    <script src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=[***Your My Key***]' async defer></script>
    <!-- Load BingMapQuery -->
    <script src="js/BmapQuery.js"></script>
   
**[script]**   

    //*Sample
    function GetMap() {
    
        // Instance...
        let map = new Bmap("#myMap");
        
       // MapStart
       // * startMap(lat, lon, "MapType", Zoom[1~20]){
        map.startMap(47.6149, -122.1941, "load", 16);//MapType[load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
    
        // Map:Add event
        // * eventMap("event", callback);
        // * [event:click,dblclick,rightclick,mousedown,mouseout,mouseover,mouseup,mousewheel,maptypechanged,viewchangestart,viewchange,viewchangeend]
        map.eventMap("click",function(){ 
            alert("MapEvent!");
        });

        // Pushpin
        // * pin(lat, lon, "color", [drag:true|false], [click:true|false], [hover:true|false], [visible:true|false]);
        let pin1 = map.pin(47.6149, -122.1941, "#ff0000");

        // Pushpin:Text
        // * pinText(lat, lon, "title", "subtitle", "text");
        let pin2 = map.pinText(47.6160, -122.1950, "title","subtitle","A");

        // Pushpin:Icon
        // * pinIcon(lat, lon, icon, scale, anchor_x, anchor_y);
        let pin3 = map.pinIcon(47.6130, -122.1945, "img/poi_custom.png", 1.0, 0, 0);

        // pushpin:Event
        // * eventPin(pushpin, "event", callback);
        // * [event: click,mousedown,mouseout,mouseover,mouseup]
        map.eventPin(pin1, "click", function(){
            alert("PinEvent1");
        });

        // Infobox
        // * infobox(lat, lon, "title", "description");
        map.infobox(47.6149, -122.1941, "1 step", "Start");

        // Infobox:html
        // * infoboxHtml(lat, lon, html);
        map.infoboxHtml(47.6160, -122.1950, '<div style="background:red;">Hello,world</div>');
        
        // MapChangeView(after 2 seconds.)
        // * changeMap(lat, lon, "MapType", Zoom[1~20]);
        setTimeout(function(){
            map.changeMap(47.6150, -122.1950, "load", 17);
        },2000);

        // GeocodeJson(after 4 seconds.)
        // * getGeocode("searchQuery",callback);
        setTimeout(function () {
            map.getGeocode("Seattle", function(data){
                document.querySelector("#geocode").innerHTML=data;
            });
        },6000);
        
    }

