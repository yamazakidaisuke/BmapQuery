BmapQuery
==========

Copyright (c) 2018-2019, BingMapsGO! - daisuke yamazaki. All rights reserved.
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

For example:
[html]
  ...
  <!-- Load BingMapsControl api [callback=GetMap] -->
  <script src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=[***Your My Key***]' async defer></script>
  <!-- Load BingMapQuery -->
  <script src="js/BmapQuery.js"></script>
   ...
   
[script]   
===================================================================================================
//Basic Sample (Show Map)  
  let map; //mapObject
  function GetMap() {
      map = mapStart("#myMap", 47.6149, -122.1941, "load", 16);  //Initialization processing
  }
===================================================================================================    
//Pushpin
  let map; //mapObject
  function GetMap() {
      map = mapStart("#myMap", 47.6149, -122.1941, "load", 16); //Initialization processing
      mapPushpin(map, 47.6149, -122.1941, "#ff0000");           //pushpin1
  }
===================================================================================================
//Infobox
  let map; //mapObject
  function GetMap() {
      map = mapStart("#myMap", 47.6149, -122.1941, "load", 16); //Initialization processing
      mapPushpin(map, 47.6149, -122.1941, "#ff0000");           //pushpin1
      mapInfobox(map, 47.6149, -122.1941, "1 step", "Start");   //infobox1
  }
===================================================================================================
//Pushpin&Text
  let map; //mapObject
  function GetMap() {
      map = mapStart("#myMap", 47.6149, -122.1941, "load", 16); //Initialization processing
      mapPushpinText(map, 47.6149, -122.1941, "title","subtitle","A"); //PushpinText
  }
===================================================================================================
//Pushpin&Image
  let map; //mapObject
  const pin = "img/poi_custom.png";
  function GetMap() {
      map = mapStart("#myMap", 47.6149, -122.1941, "load", 16); //Initialization processing
      mapPushpinIcon(map, 47.6149, -122.1941, pin, 1.0, 0, 0);  //PushpinIcon
  }
===================================================================================================
//Infobox&HTML
  let map; //mapObject
  const html = '<div style="background:red;">Hello,world</div>';
  function GetMap() {
      map = mapStart("#myMap", 47.6149, -122.1941, "load", 16); //Initialization processing
      mapInfoboxHtml(map, 47.6149, -122.1941, html);            //infoboxHTML
  }
===================================================================================================


