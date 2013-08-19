/*========================================================================
 * FILE:    mapscrip.js
 * DATE:    24 Jan 2013
 * AUTHORS: Stephen W. Liddle and the ISys 542 Winter 2013 class
 *
 * Code for the Map/Scriptures project we're working on as the main
 * in-class running example Winter 2013 at BYU.
 */
/*------------------------------------------------------------------------
 *                      GLOBAL VARIABLES
 */
var MS = {
    animationLeft: null,
    ge: null,                   // Google Earth instance
    gex: null,                  // Google Earth extensions library instance
    gePlacemarks: [],           // List of placemarks we're showing
    iconStyle: null,            // Style with custom icon for Google Earth
    pendingRequest: null,       // Pending scripture request
    parse_latlon1: /\((.*),'(.*)',(.*),(.*)\)/,
    parse_latlon2: /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*)\)/,
    visibleId: '#scriptures'    // ID of the scriptures div that is visible
}

/*------------------------------------------------------------------------
 *                      TOP-LEVEL CODE
 */
// jQuery function that gets called when the page finishes loading
$(function() {
    // Load the scriptures div with content as soon as possible
    navigateScriptures();
});

// Google Earth top-level initialization code
google.load("earth", "1");
google.setOnLoadCallback(initGoogleEarth);

// Intercept back/forward button events via hashChange event
$(window).bind('hashchange', navigateScriptures);

/*------------------------------------------------------------------------
 *                      SCRIPTURES DISPLAY
 */
// Handle click on scripture link
function getScripture(parameters, directionLeft) {
    if (MS.pendingRequest != null) {
        // Abort any in-process request
        MS.pendingRequest.abort();
        MS.pendingRequest = null;
    }

    // Show the user we're responding to the request
    $('<div id="loadingleft"><img src="loading.gif"></div>').appendTo('div.scripturecontent');
    $('<div id="loadingright"><img src="loading.gif"></div>').appendTo('div.scripturecontent');

    MS.animationLeft = directionLeft;
    window.location.hash = hashFromParameters(parameters);
}

// Display the new scripture content to the user
function getScriptureCallback(html) {
    MS.pendingRequest = null;

    var offscreenId;

    if (MS.visibleId == '#scriptures') {
        offscreenId = '#scriptures2';
    } else {
        offscreenId = '#scriptures';
    }

    var offscreenDiv = $(offscreenId);
    var onscreenDiv = $(MS.visibleId);
    var pos = offscreenDiv.offset();
    var scripturesWidth = offscreenDiv.outerWidth();

    offscreenDiv.html(html);
    MS.visibleId = offscreenId;
    transitionBreadcrumbs($(offscreenId + ' #scripcrumb'));

    if (MS.animationLeft == undefined) {
        transitionScripturesCrossDissolve(pos, offscreenDiv, onscreenDiv);
    } else {
        transitionScripturesSlideLeftRight(pos, offscreenDiv, onscreenDiv, scripturesWidth);
    }
}

// Handle a failure to receive scriptures data
function getScriptureFailed() {
    MS.pendingRequest = null;
    $('div#loadingleft').remove();
    $('div#loadingright').remove();
}

// Convert parameters to hash form (user-visible)
function hashFromParameters(parameters) {
    if ( parameters == undefined || parameters == null ||
         parameters.charAt(0) != '?' ) {
        // If there are no parameters, point to the root
        return '';
    }

    // Parse the parameters into a JavaScript object
    var parts = parameters.substring(1).split('&');
    var parameters = {};

    for (var i = 0; i < parts.length; i++) {
        var components = parts[i].split('=');

        if (components.length == 2) {
            parameters[components[0]] = components[1];
        }
    }

    // Now emit a hash string that represents what the user wants
    var hash = '';

    if (isEmpty(parameters.parent)) {
        if (!isEmpty(parameters.book)) {
            // Is form book=&chap=&verses=&jst=
            hash = parameters.book;

            if (!isEmpty(parameters.jst)) {
                hash += '/jst';
            }

            if (!isEmpty(parameters.chap)) {
                hash += '/' + parameters.chap;
            }

            if (!isEmpty(parameters.verses)) {
                hash += '.' + parameters.verses;
            }
        }
    } else {
        // Is form parent=
        hash = parameters.parent;
    }

    return hash;
}

// Test whether value is an "empty" variable
function isEmpty(value) {
    return (value == undefined || value == null || value == '');
}

// Respond to hash change event
function navigateScriptures() {
    var url = 'http://scriptures.byu.edu/mapgetscrip.php' +
              parametersFromHash(window.location.hash);

    MS.pendingRequest = $.get(url).success(getScriptureCallback).error(getScriptureFailed);
    MS.directionLeft = null;
}

// Convert hash form (user visible) to form we send to API endpoint
function parametersFromHash(hash) {
    if (hash == undefined || hash == null || hash == '') {
        return '';
    }

    var parts = hash.substring(1).split('/');

    if (parts.length <= 0) {
        return '';
    }

    if ( parts.length == 1 &&
         ( parts[0] == 'ot' || parts[0] == 'nt' || parts[0] == 'bm' ||
           parts[0] == 'dc' || parts[0] == 'pgp' ) ) {
        return '?parent=' + parts[0];
    }

    var parameters = '?book=' + parts[0];
    var ix = 1;

    if (parts.length > ix) {
        var jst = '&jst=';

        if (parts[ix] == 'jst') {
            jst += 'JST';
            ++ix;
        }

        if (parts.length > ix) {
            var dotIndex = parts[ix].indexOf('.');

            if (dotIndex >= 0) {
                parameters += '&chap=' + parts[ix].substring(0, dotIndex) +
                              '&verses=' + parts[ix].substring(dotIndex + 1);
            } else {
                parameters += '&chap=' + parts[ix] + '&verses=';
            }
        }

        parameters += jst;
    } else {
        parameters += '&chap=&verses=&jst=';
    }

    return parameters;
}

// Perform animated breadcrumbs transition using cross-dissolve effect
function transitionBreadcrumbs(newCrumbs) {
    // Use cross-dissolve transition, non-directional

    $('#header #scripcrumb').animate({
        opacity: 0  // Fade out the current breadcrumbs
    }, {
        queue: false,
        duration: 1000,
        complete: function() {
            $(this).remove();
        }
    });

    $(newCrumbs).css({ opacity: 0 }).prependTo('#header');
    $(newCrumbs).animate({
        opacity: 1  // Fade in the new breadcrumbs
    }, {
        queue: false
    });
}

// Perform animated scriptures transition using cross-dissolve effect
function transitionScripturesCrossDissolve(pos, offscreenDiv, onscreenDiv) {
    // Use cross-dissolve transition, non-directional
    pos.left = 0;
    offscreenDiv.offset(pos);
    offscreenDiv.css({opacity: 0});

    // Ensure stacking order we need -- offscreen on top
    offscreenDiv.css({"z-index": 2});
    onscreenDiv.css({"z-index": 1});

    onscreenDiv.animate({
        opacity: 0  // Fade out the on-screen div
    }, {
        queue: false,
        complete: function() {
            $(this).css({left: 5000, opacity: 1});
            clearOldAndLoadNewPlacemarks(this);
        }
    });

    offscreenDiv.animate({
        opacity: 1  // Fade in the off-screen div
    }, {
        queue: false
    });
}

// Perform animated scriptures transition using slide left/right effect
function transitionScripturesSlideLeftRight(pos, offscreenDiv, onscreenDiv, scripturesWidth) {
    /*
     * Recipe for slide left/right transition:
     *
     * Load content into offscreenId div.
     * Position offscreenId at the correct location.
     * Animate slide of both divs to the left/right.
     */
    pos.left = (MS.animationLeft) ? scripturesWidth : -scripturesWidth;
    offscreenDiv.offset(pos);
    offscreenDiv.css("opacity: 1");
    onscreenDiv.css("opacity: 1");

    if (MS.animationLeft) {
        // Ensure stacking order we need -- offscreen on top
        offscreenDiv.css("z-index: 2");
        onscreenDiv.css("z-index: 1");

        // Now animate both divs sliding left
        onscreenDiv.animate({
            left: -scripturesWidth
        }, {
            queue: false,
            complete: function() {
                clearOldAndLoadNewPlacemarks(this);
            }
        });

        offscreenDiv.animate({
            left: 0
        }, {
            queue: false
        });
    } else {
        // Ensure stacking order we need -- offscreen on bottom
        offscreenDiv.css("z-index: 1");
        onscreenDiv.css("z-index: 2");

        // Now animate both divs sliding right
        onscreenDiv.animate({
            left: scripturesWidth
        }, {
            queue: false,
            complete: function() {
                clearOldAndLoadNewPlacemarks(this);
            }
        });

        offscreenDiv.animate({
            left: 0
        }, {
            queue: false
        });
    }
}

/*------------------------------------------------------------------------
 *                      GOOGLE EARTH PLUGIN MANAGEMENT
 */
// Clear the old content and load new placemarks into Google Earth
function clearOldAndLoadNewPlacemarks(oldDiv) {
    $(oldDiv).html('Loading...');
    $(window).scrollTop(0);

    if (MS.ge != null) {
        setupPlacemarks();
    }
}

// Remove all placemarks from Google Earth
function clearPlacemarks() {
    var features = MS.ge.getFeatures();
    var feature;

    while ( (feature = features.getFirstChild()) ) {
        features.removeChild(feature);
    }

    // Clear global array of current placemarks
    MS.gePlacemarks = [];
}

// Callback for failure to init Google Earth
function failureCallback(errorCode) {
    // For now, we just ignore this
    MS.ge = null;
}

// Lazy-load custom icon style
function getIconStyle() {
    if (MS.iconStyle == null) {
        var icon = MS.ge.createIcon('');
        var style = MS.ge.createStyle('');

        icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
        style.getIconStyle().setIcon(icon);

        MS.iconStyle = style;
    }

    return MS.iconStyle;
}

// Initialize the Google Earth plugin
function initGoogleEarth() {
    google.earth.createInstance("earth", initEarthCallback, failureCallback);
}

// Callback for successful initialization of Google Earth
function initEarthCallback(instance) {
    MS.ge = instance;

    // Load the extensions library
    MS.gex = new GEarthExtensions(MS.ge);

    // Make the window visible with navigation controls
    MS.ge.getWindow().setVisibility(true);
    MS.ge.getNavigationControl().setVisibility(MS.ge.VISIBILITY_AUTO);

    // Show several of the possible informational layers
    MS.ge.getOptions().setOverviewMapVisibility(true);
    MS.ge.getOptions().setScaleLegendVisibility(true);
    MS.ge.getOptions().setStatusBarVisibility(true);

    // Show borders
    MS.ge.getLayerRoot().enableLayerById(MS.ge.LAYER_BORDERS, true);
}

// Test whether placemark is already in our global array
function placemarkExists(placename, latitude, longitude) {
    for (var i = 0; i < MS.gePlacemarks.length; i++) {
        if (MS.gePlacemarks[i].getName() == placename &&
            MS.gePlacemarks[i].getGeometry().getLatitude() - latitude < .0001 &&
            MS.gePlacemarks[i].getGeometry().getLongitude() - longitude < .0001) {
            return true;
        }
    }

    return false;
}

// Place this chapter's placemarks into Google Earth and zoom to show all
function setupPlacemarks() {
    if (MS.gePlacemarks.length > 0) {
        clearPlacemarks();
    }

    var matches;

    $(MS.visibleId + ' a[onclick^="showLocation("]').each(function() {
        var value = this.getAttribute('onclick');

        // Try the richer regular expression first
        matches = MS.parse_latlon2.exec(value);

        if (matches == null) {
            // If that fails, try the simpler expression
            matches = MS.parse_latlon1.exec(value);
        }

        if (matches != null) {
            var geotagId = matches[1];
            var placename = matches[2];
            var latitude = parseFloat(matches[3]);
            var longitude = parseFloat(matches[4]);

            if (!placemarkExists(placename, latitude, longitude)) {
                // Create the placemark.
                var placemark = MS.ge.createPlacemark('');

                // Set the placemark's location.  
                var point = MS.ge.createPoint('');
                point.setLatitude(latitude);
                point.setLongitude(longitude);
                placemark.setGeometry(point);
                placemark.setName(placename);
                placemark.setStyleSelector(getIconStyle());

                // Cache the placemark in our placemarks list
                MS.gePlacemarks.push(placemark);
            }
        }
    });

    if (MS.gePlacemarks.length > 0) {
        if (MS.gePlacemarks.length == 1 && matches != null) {
            // When there's exactly one placemark, add it and zoom to it
            MS.ge.getFeatures().appendChild(MS.gePlacemarks[0]);

            showLocation(matches[1], matches[2], matches[3], matches[4],
                         matches[5], matches[6], matches[7], matches[8],
                         matches[9], matches[10]);
        } else {
            var folder = MS.gex.dom.addFolder(MS.gePlacemarks);
            var bounds = MS.gex.dom.computeBounds(folder);

            MS.gex.view.setToBoundsView(bounds, {aspectRatio: 1.0});
        }
    }
}

// Handle click on place-name link: zoom to perspective
function showLocation(geotagId, placename, latitude, longitude, viewLatitude,
                      viewLongitude, viewTilt, viewRoll, viewElevation, viewHeading) {
                          
    if($(document).width() <= 600){
        $('#scriptures').fadeOut();
        $('.close-earth').fadeIn();
        $('#earth').fadeIn()
    }
        showLocationNow(geotagId, placename, latitude, longitude, viewLatitude,
                    viewLongitude, viewTilt, viewRoll, viewElevation, viewHeading)
}
    
function showLocationNow(geotagId, placename, latitude, longitude, viewLatitude,
                    viewLongitude, viewTilt, viewRoll, viewElevation, viewHeading){
                          
                          
    if (MS.ge == null) {
        showMapLocation(placename, parseFloat(latitude), parseFloat(longitude));
    }

    if (viewLatitude == undefined) {
        var camera = MS.ge.getView().copyAsCamera(MS.ge.ALTITUDE_RELATIVE_TO_GROUND);

        // Just show the requested point from 5000m
        var lookAt = MS.ge.createLookAt('');

        // Set new latitude and longitude values.
        lookAt.setLatitude(parseFloat(latitude));
        lookAt.setLongitude(parseFloat(longitude));
        lookAt.setRange(5000);

        // Update the view in Google Earth.
        MS.ge.getView().setAbstractView(lookAt);
    } else {
        // Show the point from a given perspective
        var camera = MS.ge.getView().copyAsCamera(MS.ge.ALTITUDE_RELATIVE_TO_GROUND);

        // Set new latitude and longitude values.
        camera.setLatitude(parseFloat(viewLatitude));
        camera.setLongitude(parseFloat(viewLongitude));
        camera.setTilt(parseFloat(viewTilt));
        camera.setRoll(parseFloat(viewRoll));
        camera.setAltitude(parseFloat(viewElevation));
        camera.setHeading(parseFloat(viewHeading));

        // Update the view in Google Earth.
        MS.ge.getView().setAbstractView(camera);
    }
}

// Show Google Maps version of placename
function showMapLocation(placename, latitude, longitude) {
    /*
     * NEEDSWORK: this is a work in progress; I intend for this
     * eventually to supplement the GE plugin for devices or
     * browsers that can't run the GE plugin (e.g. iPads).
     */
    var width = $('#earth').outerWidth();
    var height = $(window).height();

    $('#earth').html("<iframe width=\"" + width +
                     "\" height=\"" + height +
                     "\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" " +
                     "src=\"https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=" + placename +
                     "&amp;aq=0&amp;oq=" + placename +
                     "&amp;sll=" +
                     latitude + "," + longitude +
                     "&amp;sspn=8.859086,10.546875&amp;t=h&amp;ie=UTF8&amp;hq=&amp;hnear=" +
                     placename + "&amp;ll=" +
                     latitude + "," + longitude +
                     "&amp;spn=0.09245,0.146255&amp;z=12&amp;iwloc=A&amp;output=embed\"></iframe>");
    // http://maps.google.com/?ll=%3.6f,%3.6f&spn=0.005,0.005&t=h&z=18&vpsrc=6
}

/*========================================================================
 *                      END OF FILE mapscrip.js
 */
