"use strict";

//********************************************************************
// Google Maps API Wrapper
// Class: Gmap (Conversion from Bmap)
// Auther: Converted by AI
//********************************************************************
class Gmap {
    /**
     * @param {string} target The CSS selector for the map container (e.g., "#map").
     */
    constructor(target) {
        this.target = target; // CSS selector for the map container, e.g., "#map"
        this.map = null;      // google.maps.Map object
        this.markers = [];    // Array to manage markers
        this.infoWindows = [];// Array to manage infoWindows
        this.directionsRenderer = null; // To display routes
        this.trafficLayer = null; // To display traffic
    }

    /**
     * Initializes and displays the map.
     * @param {number} lat Latitude for the map center.
     * @param {number} lon Longitude for the map center.
     * @param {string} typeid Map type: "roadmap", "satellite", "hybrid", or "terrain".
     * @param {number} size Zoom level [1-20].
     * @returns {boolean} Returns false if parameters are missing.
     */
    startMap(lat, lon, typeid, size) {
        if (!this.target || lat == "" || lon == "" || !typeid || size == "") {
            return false;
        }
        this.map = new google.maps.Map(document.querySelector(this.target), {
            center: { lat: lat, lng: lon },
            zoom: size,
            mapTypeId: typeid
        });
    }

    /**
     * Creates a LatLngLiteral object.
     * @param {number} lat Latitude.
     * @param {number} lon Longitude.
     * @returns {object} A LatLngLiteral object: {lat, lng}.
     */
    setLocation(lat, lon) {
        return { lat: lat, lng: lon };
    }

    /**
     * Returns the map's center.
     * @returns {google.maps.LatLng} The LatLng object of the center.
     */
    getCenter() {
        return this.map.getCenter();
    }

    /**
     * Returns the latitude of the map's center.
     * @returns {number} The latitude.
     */
    getLat() {
        return this.map.getCenter().lat();
    }

    /**
     * Returns the longitude of the map's center.
     * @returns {number} The longitude.
     */
    getLon() {
        return this.map.getCenter().lng();
    }

    /**
     * Changes the map's view.
     * @param {number} lat New latitude.
     * @param {number} lon New longitude.
     * @param {string} id New map type ID.
     * @param {number} [zoom] Optional new zoom level.
     * @returns {boolean} Returns false if parameters are missing.
     */
    changeMap(lat, lon, id, zoom) {
        if (!this.map || lat == "" || lon == "" || !id) {
            return false;
        }
        this.map.setCenter({ lat: lat, lng: lon });
        this.map.setMapTypeId(id);
        if (typeof zoom !== "undefined" && zoom !== "") {
            this.map.setZoom(zoom);
        }
    }

    /**
     * Adds an event listener to the map.
     * @param {string} event The name of the event (e.g., "click", "zoom_changed").
     * @param {function} callback The function to execute.
     */
    onMap(event, callback) {
        if (!this.map || !event || typeof callback !== "function") return;
        this.map.addListener(event, callback);
    }

    /**
     * Adds an event listener to a marker.
     * @param {google.maps.Marker} marker The marker object.
     * @param {string} event The name of the event (e.g., "click", "dragend").
     * @param {function} callback The function to execute.
     */
    onMarker(marker, event, callback) {
        if (!marker || !event || typeof callback !== "function") return;
        marker.addListener(event, callback);
    }

    /**
     * Adds a marker to the map.
     * @param {number} lat Latitude for the marker.
     * @param {number} lon Longitude for the marker.
     * @param {object} [options] Options for the marker (e.g., {title, draggable, label}).
     * @returns {google.maps.Marker|boolean} The marker object or false.
     */
    addMarker(lat, lon, options = {}) {
        if (!this.map || lat == "" || lon == "") return false;

        const marker = new google.maps.Marker({
            position: { lat: lat, lng: lon },
            map: this.map,
            ...options
        });
        this.markers.push(marker);
        return marker;
    }

    /**
     * Adds a marker with a custom icon to the map.
     * @param {number} lat Latitude for the marker.
     * @param {number} lon Longitude for the marker.
     * @param {string} iconUrl The URL of the icon image.
     * @param {object} [options] Icon options (e.g., {scaledSize, anchor}).
     * @returns {google.maps.Marker|boolean} The marker object or false.
     */
    addIconMarker(lat, lon, iconUrl, options = {}) {
        const iconOptions = { url: iconUrl, ...options };
        if (options.scaledSize) {
            iconOptions.scaledSize = new google.maps.Size(options.scaledSize.width, options.scaledSize.height);
        }
        if (options.anchor) {
            iconOptions.anchor = new google.maps.Point(options.anchor.x, options.anchor.y);
        }
        return this.addMarker(lat, lon, { icon: iconOptions });
    }
    
    /**
     * Removes all markers from the map.
     */
    deleteMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }

    /**
     * Adds an InfoWindow to the map.
     * @param {number} lat Latitude for the InfoWindow.
     * @param {number} lon Longitude for the InfoWindow.
     * @param {string} contentString The HTML content for the InfoWindow.
     * @param {google.maps.Marker} [anchor=null] The marker to anchor the InfoWindow to.
     * @returns {google.maps.InfoWindow|boolean} The InfoWindow object or false.
     */
    addInfoWindow(lat, lon, contentString, anchor = null) {
        if (!this.map || lat == "" || lon == "" || !contentString) return false;

        const infoWindow = new google.maps.InfoWindow({
            content: contentString,
            position: anchor ? undefined : { lat: lat, lng: lon }
        });
        infoWindow.open({ map: this.map, anchor: anchor });
        this.infoWindows.push(infoWindow);
        return infoWindow;
    }

    /**
     * Closes and removes all InfoWindows.
     */
    clearInfoWindows() {
        this.infoWindows.forEach(infoWindow => infoWindow.close());
        this.infoWindows = [];
    }

    /**
     * Creates multiple markers, each with an InfoWindow that appears on click.
     * @param {Array<object>} options Array of marker options. Each object needs {lat, lon, title, description}.
     * @param {boolean} [singleInfoWindow=true] If true, one InfoWindow is shared by all markers.
     */
    createMarkersWithInfoWindows(options, singleInfoWindow = true) {
        if (!this.map || !Array.isArray(options) || options.length === 0) return;

        const infoWindow = singleInfoWindow ? new google.maps.InfoWindow() : null;

        options.forEach(opt => {
            const marker = this.addMarker(opt.lat, opt.lon, { title: opt.title });
            const content = `<h3>${opt.title}</h3><div>${opt.description}</div>`;

            marker.addListener('click', () => {
                const currentIW = singleInfoWindow ? infoWindow : new google.maps.InfoWindow();
                currentIW.setContent(content);
                currentIW.open({ map: this.map, anchor: marker });
            });
        });
    }

    /**
     * Converts an address to coordinates (geocoding).
     * @param {string} query The address or place to search for.
     * @param {boolean} [setView=true] If true, fits the map to the result's viewport.
     * @returns {Promise<object|boolean>} A Promise that resolves with the Geocoder result object or false.
     */
    async getGeocode(query, setView = true) {
        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ address: query });
            if (response.results && response.results.length > 0) {
                const result = response.results[0];
                if (setView && result.geometry.viewport) {
                    this.map.fitBounds(result.geometry.viewport);
                } else if(setView) {
                    this.map.setCenter(result.geometry.location);
                }
                return result;
            }
            return false;
        } catch (e) {
            console.error("Geocode failed: " + e);
            return false;
        }
    }

    /**
     * Converts coordinates to an address (reverse geocoding).
     * @param {object} location A LatLngLiteral object {lat, lng}.
     * @returns {Promise<string>} A Promise that resolves with the formatted address.
     */
    async reverseGeocode(location) {
        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ location });
            if (response.results && response.results.length > 0) {
                return response.results[0].formatted_address;
            }
            return "No address found";
        } catch (e) {
            console.error("Reverse geocode failed: " + e);
            return "Reverse geocode failed";
        }
    }
    
    /**
     * Calculates and displays a route on the map.
     * @param {string} detailsElId The ID of the HTML element to display turn-by-turn directions.
     * @param {string} mode Travel mode: "DRIVING", "WALKING", "BICYCLING", "TRANSIT".
     * @param {string|object} from The starting point (address or {lat, lng}).
     * @param {string|object} to The destination (address or {lat, lng}).
     * @param {Array<object>} [waypoints=[]] An array of waypoints, e.g., [{location: "Shinjuku"}].
     */
    direction(detailsElId, mode, from, to, waypoints = []) {
        const directionsService = new google.maps.DirectionsService();
        if (this.directionsRenderer) {
            this.directionsRenderer.setMap(null);
            this.directionsRenderer.setPanel(null);
        }
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map);
        if (detailsElId) {
            this.directionsRenderer.setPanel(document.getElementById(detailsElId));
        }

        const request = {
            origin: from,
            destination: to,
            travelMode: google.maps.TravelMode[mode.toUpperCase()] || 'DRIVING',
            waypoints: waypoints,
        };

        directionsService.route(request, (result, status) => {
            if (status == 'OK') {
                this.directionsRenderer.setDirections(result);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    /**
     * Toggles the traffic layer on and off.
     * @param {boolean} show True to show the layer, false to hide.
     */
    toggleTraffic(show) {
        if (!this.trafficLayer) {
            this.trafficLayer = new google.maps.TrafficLayer();
        }
        this.trafficLayer.setMap(show ? this.map : null);
    }
    
    /**
     * Sets up the Places Autocomplete feature on a text input.
     * @param {string} inputId The ID of the input element.
     */
    setupAutocomplete(inputId) {
        const input = document.getElementById(inputId);
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', this.map);

        autocomplete.addListener('place_changed', () => {
            this.deleteMarkers();
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                return;
            }
            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(17);
            }
            this.addMarker(place.geometry.location.lat(), place.geometry.location.lng(), {title: place.name});
        });
    }

    /**
     * Loads and displays boundary data from a GeoJSON source.
     * @param {string|object} geoJsonUrl The URL to a GeoJSON file or a GeoJSON object.
     */
    loadBoundaryFromJson(geoJsonUrl) {
        this.map.data.loadGeoJson(geoJsonUrl);
        // Example style for the boundary polygon
        this.map.data.setStyle({
            fillColor: 'blue',
            fillOpacity: 0.2,
            strokeColor: 'blue',
            strokeWeight: 1
        });
    }
}
