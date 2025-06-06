"use strict";

//********************************************************************
// Azure Maps SDK
// AzureMapQuery: v1.0.0 ( Converted from BingMaps v8 )
// Author: Converted Library
// MIT License.
//
// [import files. ]
// <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css">
// <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
//********************************************************************

class AzureMap {
    //Init
    constructor(target, subscriptionKey) {
        this.target = target; // #id
        this.subscriptionKey = subscriptionKey; // Azure Maps subscription key
        this.map = null; // mapObject
        this.size = 10; // Zoom value
        this.style = "road"; // Map style
        this.loc = null; // Current location
        this.datasource = null; // Data source for shapes
        this.watchId = null;
        this.tracker = []; // tracking Array
        this.time = []; // watchPosition time
        this.popups = []; // Popup array
        this.layers = []; // Custom layers
        this.symbols = []; // Symbol layers
        this.lines = []; // Line layers
        this.polygons = []; // Polygon layers
    }

    /**
     * MapView
     * @method startMap
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param style (string) ["road", "satellite", "grayscale_dark", "grayscale_light", "night", "high_contrast_dark"]
     * @param zoom (int) [1...22]
     * @returns {boolean|Object} Map object or false
     */
    startMap(lat, lon, style = "road", zoom = 10) {
        // Parameter Check
        if (!this.target || lat === "" || lon === "" || !this.subscriptionKey) {
            console.error("Missing required parameters");
            return false;
        }

        // Set authentication
        atlas.setAuthenticationOptions({
            authType: 'subscriptionKey',
            subscriptionKey: this.subscriptionKey
        });

        // Initialize map
        this.map = new atlas.Map(this.target, {
            center: [lon, lat], // Azure Maps uses [longitude, latitude]
            zoom: zoom,
            style: style,
            language: 'en-US',
            view: 'Auto'
        });

        // Wait for map to be ready
        this.map.events.add('ready', () => {
            // Initialize data source
            this.datasource = new atlas.source.DataSource();
            this.map.sources.add(this.datasource);
            
            console.log("Azure Map initialized successfully");
        });

        this.size = zoom;
        this.style = style;
        return this.map;
    }

    /**
     * Set location data for Azure Maps
     * @method setLocation
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @returns {Array} [longitude, latitude]
     */
    setLocation(lat, lon) {
        return [lon, lat]; // Azure Maps uses [longitude, latitude]
    }

    /**
     * Get Map center
     * @method getCenter
     * @returns {Array} [longitude, latitude]
     */
    getCenter() {
        if (!this.map) return null;
        return this.map.getCamera().center;
    }

    /**
     * Get Map center Latitude
     * @method getLat
     * @returns {number} latitude
     */
    getLat() {
        const center = this.getCenter();
        return center ? center[1] : null;
    }

    /**
     * Get Map center Longitude
     * @method getLon
     * @returns {number} longitude
     */
    getLon() {
        const center = this.getCenter();
        return center ? center[0] : null;
    }

    /**
     * Change Map View
     * @method changeMap
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param style (string) ["road", "satellite", "grayscale_dark"]
     * @param zoom (int) [1...22]
     * @returns {boolean}
     */
    changeMap(lat, lon, style, zoom) {
        if (!this.map || lat === "" || lon === "" || !style) {
            return false;
        }

        const options = {
            center: [lon, lat],
            type: 'ease',
            duration: 1000
        };

        if (zoom !== undefined && zoom !== "") {
            options.zoom = zoom;
            this.size = zoom;
        }

        this.map.setCamera(options);
        
        if (style !== this.style) {
            this.map.setStyle({ style: style });
            this.style = style;
        }

        return true;
    }

    /**
     * Map Event Handler
     * @method onMap
     * @param event (string) ["click", "dblclick", "mousedown", "mouseup", "mousemove", "zoom", "move"]
     * @param callback (function) callback function
     */
    onMap(event, callback) {
        if (!this.map || !event || typeof callback !== "function") {
            return false;
        }

        this.map.events.add(event, callback);
        return true;
    }

    /**
     * Add Pin/Marker
     * @method pin
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param color (string) ["#ff0000"]
     * @param draggable (boolean) [true/false]
     * @param options (object) additional options
     * @returns {object} symbol layer
     */
    pin(lat, lon, color = "#ff0000", draggable = false, options = {}) {
        if (!this.map || lat === "" || lon === "" || !this.datasource) {
            return false;
        }

        // Create point geometry
        const point = new atlas.data.Point([lon, lat]);
        
        // Create feature
        const pointFeature = new atlas.data.Feature(point, {
            color: color,
            draggable: draggable,
            ...options
        });

        // Add to data source
        this.datasource.add(pointFeature);

        // Create symbol layer if not exists
        if (!this.map.layers.getLayerById('pin-layer')) {
            const symbolLayer = new atlas.layer.SymbolLayer(this.datasource, 'pin-layer', {
                iconOptions: {
                    allowOverlap: true,
                    anchor: 'bottom'
                }
            });
            this.map.layers.add(symbolLayer);
            this.symbols.push(symbolLayer);
        }

        return pointFeature;
    }

    /**
     * Add Pin with Text
     * @method pinText
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param title (string) ["Tokyo Tower"]
     * @param subtitle (string) ["A symbol of Tokyo"]
     * @param text (string) ["T"]
     * @returns {object} feature
     */
    pinText(lat, lon, title, subtitle, text) {
        if (!this.map || lat === "" || lon === "" || !title) {
            return false;
        }

        const point = new atlas.data.Point([lon, lat]);
        const pointFeature = new atlas.data.Feature(point, {
            title: title,
            subtitle: subtitle,
            text: text
        });

        this.datasource.add(pointFeature);

        // Create symbol layer with text
        const textLayer = new atlas.layer.SymbolLayer(this.datasource, null, {
            textOptions: {
                textField: ['get', 'text'],
                color: '#000000',
                size: 12,
                offset: [0, -2]
            }
        });
        this.map.layers.add(textLayer);

        return pointFeature;
    }

    /**
     * Add Pin with Custom Icon
     * @method pinIcon
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param iconUrl (string) ["path/to/icon.png"]
     * @param scale (float) [1.0]
     * @param anchor (Array) [0.5, 1] // [x, y] where 0.5, 1 is bottom center
     * @returns {object} feature
     */
    pinIcon(lat, lon, iconUrl, scale = 1.0, anchor = [0.5, 1]) {
        if (!this.map || lat === "" || lon === "" || !iconUrl) {
            return false;
        }

        // Add image to map
        this.map.imageSprite.add('custom-icon', iconUrl).then(() => {
            const point = new atlas.data.Point([lon, lat]);
            const pointFeature = new atlas.data.Feature(point);
            
            this.datasource.add(pointFeature);

            const symbolLayer = new atlas.layer.SymbolLayer(this.datasource, null, {
                iconOptions: {
                    image: 'custom-icon',
                    size: scale,
                    anchor: 'bottom'
                }
            });
            this.map.layers.add(symbolLayer);
        });
    }

    /**
     * Delete all pins
     * @method deletePin
     */
    deletePin() {
        if (this.datasource) {
            this.datasource.clear();
        }
    }

    /**
     * Add Polyline
     * @method polyline
     * @param locations (Array) [[lon, lat], [lon, lat], ...]
     * @param strokeColor (string) ["#ff0000"]
     * @param strokeWidth (number) [2]
     * @param options (object) additional options
     */
    polyline(locations, strokeColor = "#ff0000", strokeWidth = 2, options = {}) {
        if (!this.map || !locations || locations.length < 2) {
            return false;
        }

        const line = new atlas.data.LineString(locations);
        const lineFeature = new atlas.data.Feature(line);
        
        this.datasource.add(lineFeature);

        const lineLayer = new atlas.layer.LineLayer(this.datasource, null, {
            strokeColor: strokeColor,
            strokeWidth: strokeWidth,
            ...options
        });
        
        this.map.layers.add(lineLayer);
        this.lines.push(lineLayer);
        
        return lineFeature;
    }

    /**
     * Add Popup/InfoWindow
     * @method popup
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param title (string) ["Title"]
     * @param description (string) ["Description"]
     * @returns {object} popup
     */
    popup(lat, lon, title, description) {
        if (!this.map || lat === "" || lon === "" || !title) {
            return false;
        }

        const popup = new atlas.Popup({
            content: `<div style="padding:10px;"><h3>${title}</h3><p>${description}</p></div>`,
            position: [lon, lat],
            pixelOffset: [0, -18]
        });

        popup.open(this.map);
        this.popups.push(popup);
        
        return popup;
    }

    /**
     * Add HTML Popup
     * @method popupHtml
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param html (string) ["<div>Custom HTML</div>"]
     * @returns {object} popup
     */
    popupHtml(lat, lon, html) {
        if (!this.map || lat === "" || lon === "" || !html) {
            return false;
        }

        const popup = new atlas.Popup({
            content: html,
            position: [lon, lat],
            pixelOffset: [0, -18]
        });

        popup.open(this.map);
        this.popups.push(popup);
        
        return popup;
    }

    /**
     * Clear all popups
     * @method clearPopups
     */
    clearPopups() {
        this.popups.forEach(popup => popup.close());
        this.popups = [];
    }

    /**
     * Search/Geocoding
     * @method search
     * @param query (string) ["Tokyo Tower"]
     * @param callback (function) callback function
     * @param setView (boolean) [true] whether to set map view to result
     */
    async search(query, callback, setView = true) {
        if (!query || typeof callback !== "function") {
            return false;
        }

        try {
            const searchURL = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${this.subscriptionKey}&query=${encodeURIComponent(query)}`;
            
            const response = await fetch(searchURL);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                
                if (setView) {
                    this.map.setCamera({
                        center: [result.position.lon, result.position.lat],
                        zoom: 15
                    });
                }
                
                callback(result);
            } else {
                callback(null);
            }
        } catch (error) {
            console.error("Search error:", error);
            callback(false);
        }
    }

    /**
     * Reverse Geocoding
     * @method reverseGeocode
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param callback (function) callback function
     */
    async reverseGeocode(lat, lon, callback) {
        if (!lat || !lon || typeof callback !== "function") {
            return false;
        }

        try {
            const reverseURL = `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key=${this.subscriptionKey}&query=${lat},${lon}`;
            
            const response = await fetch(reverseURL);
            const data = await response.json();
            
            if (data.addresses && data.addresses.length > 0) {
                callback(data.addresses[0]);
            } else {
                callback(null);
            }
        } catch (error) {
            console.error("Reverse geocode error:", error);
            callback(false);
        }
    }

    /**
     * Get user's current location
     * @method getCurrentLocation
     * @param callback (function) callback function
     * @param showOnMap (boolean) [true] whether to show location on map
     */
    getCurrentLocation(callback, showOnMap = true) {
        if (typeof callback !== "function") {
            return false;
        }

        if (!navigator.geolocation) {
            callback(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                if (showOnMap) {
                    this.map.setCamera({
                        center: [lon, lat],
                        zoom: 15
                    });
                    
                    // Add user location pin
                    this.pin(lat, lon, "#0066cc", false, { type: "user-location" });
                }
                
                callback({ lat, lon, accuracy: position.coords.accuracy });
            },
            (error) => {
                console.error("Geolocation error:", error);
                callback(false);
            }
        );
    }

    /**
     * Start tracking user location
     * @method startTracking
     * @param callback (function) callback function called on each position update
     * @param showPath (boolean) [false] whether to show tracking path
     */
    startTracking(callback, showPath = false) {
        if (typeof callback !== "function") {
            return false;
        }

        if (!navigator.geolocation) {
            callback(false);
            return;
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const timestamp = new Date(position.timestamp);
                
                // Update tracking arrays
                this.tracker.push([lon, lat]);
                this.time.push(timestamp.toLocaleString());
                
                // Update map center
                this.map.setCamera({
                    center: [lon, lat]
                });
                
                // Show tracking path
                if (showPath && this.tracker.length > 1) {
                    this.polyline(this.tracker, "#ff0000", 3);
                }
                
                callback({ lat, lon, timestamp, accuracy: position.coords.accuracy });
            },
            (error) => {
                console.error("Tracking error:", error);
                callback(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    /**
     * Stop tracking user location
     * @method stopTracking
     */
    stopTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    /**
     * Get tracking data
     * @method getTrackingData
     * @returns {Array} tracking coordinates
     */
    getTrackingData() {
        return this.tracker;
    }

    /**
     * Get tracking time data
     * @method getTrackingTime
     * @returns {Array} tracking timestamps
     */
    getTrackingTime() {
        return this.time;
    }

    /**
     * Clear tracking data
     * @method clearTrackingData
     */
    clearTrackingData() {
        this.tracker = [];
        this.time = [];
    }

    /**
     * Add circle overlay
     * @method circle
     * @param lat (float) [35.6762]
     * @param lon (float) [139.6503]
     * @param radius (number) [1000] radius in meters
     * @param options (object) {fillColor, strokeColor, strokeWidth}
     * @returns {object} circle feature
     */
    circle(lat, lon, radius, options = {}) {
        if (!this.map || lat === "" || lon === "" || !radius) {
            return false;
        }

        // Create circle using turf.js or custom implementation
        const center = [lon, lat];
        const circle = this._createCircle(center, radius);
        
        const circleFeature = new atlas.data.Feature(circle);
        this.datasource.add(circleFeature);
        
        const polygonLayer = new atlas.layer.PolygonLayer(this.datasource, null, {
            fillColor: options.fillColor || 'rgba(255, 0, 0, 0.3)',
            strokeColor: options.strokeColor || '#ff0000',
            strokeWidth: options.strokeWidth || 1
        });
        
        this.map.layers.add(polygonLayer);
        this.polygons.push(polygonLayer);
        
        return circleFeature;
    }

    /**
     * Create circle geometry (simplified implementation)
     * @method _createCircle
     * @param center (Array) [lon, lat]
     * @param radius (number) radius in meters
     * @returns {object} Polygon geometry
     */
    _createCircle(center, radius) {
        const points = [];
        const earthRadius = 6371000; // Earth's radius in meters
        
        for (let i = 0; i < 64; i++) {
            const angle = (i * 360 / 64) * Math.PI / 180;
            const dx = radius * Math.cos(angle);
            const dy = radius * Math.sin(angle);
            
            const lon = center[0] + (dx / earthRadius) * (180 / Math.PI) / Math.cos(center[1] * Math.PI / 180);
            const lat = center[1] + (dy / earthRadius) * (180 / Math.PI);
            
            points.push([lon, lat]);
        }
        
        points.push(points[0]); // Close the polygon
        
        return new atlas.data.Polygon([points]);
    }

    /**
     * Clear all map entities
     * @method clearMap
     */
    clearMap() {
        if (this.datasource) {
            this.datasource.clear();
        }
        this.clearPopups();
        this.tracker = [];
        this.time = [];
    }

    /**
     * Add traffic layer
     * @method showTraffic
     */
    showTraffic() {
        if (!this.map) return false;
        
        this.map.setTraffic({
            incidents: true,
            flow: 'relative'
        });
    }

    /**
     * Hide traffic layer
     * @method hideTraffic
     */
    hideTraffic() {
        if (!this.map) return false;
        
        this.map.setTraffic({
            incidents: false,
            flow: 'none'
        });
    }

    /**
     * Dispose map and cleanup
     * @method dispose
     */
    dispose() {
        if (this.watchId) {
            this.stopTracking();
        }
        
        this.clearPopups();
        
        if (this.map) {
            this.map.dispose();
            this.map = null;
        }
        
        this.datasource = null;
        this.tracker = [];
        this.time = [];
        this.popups = [];
        this.layers = [];
        this.symbols = [];
        this.lines = [];
        this.polygons = [];
    }
}
