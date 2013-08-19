/*========================================================================
 * FILE:    mapscrip.js
 * DATE:    24 Jan 2013
 * AUTHORS: Stephen W. Liddle and the ISys 542 Winter 2013 class
 *
 * Code for the Map/Scriptures project we're working on as the main
 * in-class running example Winter 2013 at BYU.
 */
/*jslint plusplus: true, regexp: true, white: true, browser: true,
  maxlen: 100 */
/*global $, console, google, GEarthExtensions, jQuery*/

/*------------------------------------------------------------------------
 *                      LIBRARY WRAPPER
 */
var MS = (function packageMapScriptures() {
    // Wrap the entire library in an anonymous function
    "use strict";   // And enable strict mode for this library

/*------------------------------------------------------------------------
 *                      MODULE-LEVEL VARIABLES
 */
var animationLeft,              // Are we supposed slide left/right?
    baseUrl = 'http://scriptures.byu.edu/mapscrip/',
    ge = null,                  // Google Earth instance
    gex = null,                 // Google Earth extensions library instance
    gePlacemarks = [],          // List of placemarks we're showing
    iconStyle = null,           // Style with custom icon for Google Earth
    libraryObject = null,       // This is the object we'll return at the
                                //     top level
    pendingRequest = null,      // Pending scripture request
    parseLatLon = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*)\)/,
    visibleId = '#scriptures';  // ID of the scriptures div that is visible

/*------------------------------------------------------------------------
 *                      FUNCTION DECLARATIONS
 */
// Settings management functions
var createSettingsPopup,

// Scriptures display functions
    addVerseSharing, getScriptureCallback, getScriptureFailed,
    hashFromParameters, navigateScriptures, parametersFromHash,
    transitionBreadcrumbs, transitionScripturesCrossDissolve,
    transitionScripturesSlideLeftRight,

// Google Earth plugin management functions
    clearOldAndLoadNewPlacemarks, clearPlacemarks,
    failureCallback, getIconStyle, initGoogleEarth, initEarthCallback,
    placemarkExists, setupPlacemarks, showEarth, showMapLocation,

// User management functions
    isLoggedIn;

/*------------------------------------------------------------------------
 *                      SETTINGS MANAGEMENT
 */
createSettingsPopup = function () {
    var settingsDiv = $('#settings-layers-content'),
        url;

    if (settingsDiv.text() === '') {
        // Need to populate the layers checklist
        url = baseUrl + 'getlayers';
        settingsDiv.html('<img src="loading.gif" />Loading...');

        $.getJSON(url, function (json) {
            settingsDiv.html('');
            $(json).each(function () {
                var layerId = this.Id;
                $('#settings-layers-content').append(
                    '<label class="checkbox"><input type="checkbox" name="layer' +
                    this.id + '"' +
                    (this.default === 'Y' ? 'checked' : '') +
                    '> ' + this.name + '</label>');
            });
        });
    }
};

/*------------------------------------------------------------------------
 *                      SCRIPTURES DISPLAY
 */
// Add verse sharing when user hovers over verse number
addVerseSharing = function () {
    // Following Bradford Law's general approach here
    $('.versesblock li').each(function () {
        var verseId = $(this).attr('id'),
            verseSpan = $('span.verse', this),
            verseText = $(this).text();

        verseSpan.mouseenter(function () {
            var divhtml, facebookShare, facebookUrl, twitterShare, twitterUrl, url;

            url = encodeURIComponent(window.location.origin + window.location.pathname + verseId);
            twitterUrl = 'http://twitter.com/share?text=' +
                         encodeURIComponent(verseText) + '&url=' + url;
            twitterShare = 'Share via Twitter';

            facebookUrl = 'http://facebook.com/sharer.php?u=' + url;
            facebookShare = 'Share via Facebook';

            divhtml = '<div class="share-popup"><div class="share-popup-point"></div>' +
                      '<div class="share-popup-point light"></div>' +
                      '<span class="share-text">Share:</span> ' +
                      '<span><img class="share-icon share-twitter" src="twitter.png" title="' +
                      twitterShare +
                      '"/></span><span><img class="share-icon share-facebook" ' +
                      'src="facebook.png" title="' +
                      facebookShare + '"/></span><div>';
            
            $(this).append(divhtml);

            $('.share-twitter', this).click(function() {
                window.open(twitterUrl, twitterShare, 'toolbar=0,status=0,width=550,height=325');
            });
            $('.share-facebook', this).click(function() {
                window.open(facebookUrl, facebookShare, 'toolbar=0,status=0,width=550,height=325');
            });
        });
        
        verseSpan.mouseleave(function() {
            $('div.share-popup').remove();
        });
    });
};

// Display the new scripture content to the user
getScriptureCallback = function (html) {
    var offscreenDiv, offscreenId, onscreenDiv, pos, scripturesWidth;

    pendingRequest = null;

    if (visibleId === '#scriptures') {
        offscreenId = '#scriptures2';
    } else {
        offscreenId = '#scriptures';
    }

    offscreenDiv = $(offscreenId);
    onscreenDiv = $(visibleId);
    pos = offscreenDiv.offset();
    scripturesWidth = offscreenDiv.outerWidth();

    offscreenDiv.html(html);
    visibleId = offscreenId;
    // Move title from content div to the page
    $('title').text($(offscreenId + ' .scripturecontent').attr('title'));
    $(offscreenId + ' .scripturecontent').attr('title', '');
    transitionBreadcrumbs($(offscreenId + ' #scripcrumb'));

    if (animationLeft !== undefined) {
        transitionScripturesSlideLeftRight(pos, offscreenDiv,
                                           onscreenDiv, scripturesWidth);
    } else {
        transitionScripturesCrossDissolve(pos, offscreenDiv, onscreenDiv);
    }

    animationLeft = undefined;

    if ($(window).width() > 600) {
        $('#earthWrapper').show();
    } else {
        $('#earthWrapper').hide();
    }
};

// Handle a failure to receive scriptures data
getScriptureFailed = function () {
    pendingRequest = null;
    animationLeft = undefined;
    $('div#loadingleft').remove();
    $('div#loadingright').remove();
};

// Convert parameters to hash form (user-visible)
hashFromParameters = function (parameters) {
    var components, hash, i, parts;

    if (!parameters || parameters.charAt(0) !== '?') {
        // If there are no parameters, point to the root
        return '';
    }

    // Parse the parameters into a JavaScript object
    parts = parameters.substring(1).split('&');
    parameters = {};

    for (i = 0; i < parts.length; i++) {
        components = parts[i].split('=');

        if (components.length === 2) {
            parameters[components[0]] = components[1];
        }
    }

    // Now emit a hash string that represents what the user wants
    hash = '';

    if (parameters.parent) {
        // Is form parent=
        hash = parameters.parent;
    } else {
        if (parameters.book) {
            // Is form book=&chap=&verses=&jst=
            hash = parameters.book;

            if (parameters.jst) {
                hash += '/jst';
            }

            if (parameters.chap) {
                hash += '/' + parameters.chap;
            }

            if (parameters.verses) {
                hash += '.' + parameters.verses;
            }
        }
    }

    return hash;
};

// Respond to hash change event
navigateScriptures = function () {
    var hash = parametersFromHash(window.location.hash);
    var url = baseUrl + 'mapgetscrip' + hash;

    // Remember sharing URL
    // addthis_share.url = 'http://scriptures.byu.edu/mapscrip/' +
    //                     window.location.hash.substring(1);
    pendingRequest = $.get(url)
                        .success(getScriptureCallback)
                        .error(getScriptureFailed);
};

// Convert hash form (user visible) to form we send to API endpoint
parametersFromHash = function (hash) {
    var dotIndex, ix, jst, parameters, parts;

    if (!hash) {
        return '';
    }

    parts = hash.substring(1).split('/');

    if (parts.length <= 0) {
        return '';
    }

    if ( parts.length === 1 &&
         ( parts[0] === 'ot' || parts[0] === 'nt' || parts[0] === 'bm' ||
           parts[0] === 'dc' || parts[0] === 'pgp' ) ) {
        return '?parent=' + parts[0];
    }

    parameters = '?book=' + parts[0];
    ix = 1;

    if (parts.length > ix) {
        jst = '&jst=';

        if (parts[ix] === 'jst') {
            jst += 'JST';
            ++ix;
        }

        if (parts.length > ix) {
            dotIndex = parts[ix].indexOf('.');

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
};

// Perform animated breadcrumbs transition using cross-dissolve effect
transitionBreadcrumbs = function (newCrumbs) {
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
};

// Perform animated scriptures transition using cross-dissolve effect
transitionScripturesCrossDissolve = function (pos, offscreenDiv, onscreenDiv) {
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
            addVerseSharing();
        }
    });

    offscreenDiv.animate({
        opacity: 1  // Fade in the off-screen div
    }, {
        queue: false
    });
};

// Perform animated scriptures transition using slide left/right effect
transitionScripturesSlideLeftRight = function (pos, offscreenDiv,
                                               onscreenDiv, scripturesWidth) {
    /*
     * Recipe for slide left/right transition:
     *
     * Load content into offscreenId div.
     * Position offscreenId at the correct location.
     * Animate slide of both divs to the left/right.
     */
    pos.left = animationLeft ? scripturesWidth : -scripturesWidth;
    offscreenDiv.offset(pos);
    offscreenDiv.css("opacity: 0");
    onscreenDiv.css("opacity: 1");

    if (animationLeft) {
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
                addVerseSharing();
            }
        });

        offscreenDiv.animate({
            left: 0,
            opacity: 1
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
                addVerseSharing();
            }
        });

        offscreenDiv.animate({
            left: 0
        }, {
            queue: false
        });
    }
};

/*------------------------------------------------------------------------
 *                      GOOGLE EARTH PLUGIN MANAGEMENT
 */
// Clear the old content and load new placemarks into Google Earth
clearOldAndLoadNewPlacemarks = function (oldDiv) {
    $(oldDiv).html('Loading...');
    $(window).scrollTop(0);

    if (ge) {
        setupPlacemarks();
    }
};

// Remove all placemarks from Google Earth
clearPlacemarks = function () {
    var feature, features;

    features = ge.getFeatures();
    feature = features.getFirstChild();

    while (feature) {
        features.removeChild(feature);
        feature = features.getFirstChild();
    }

    // Clear array of current placemarks
    gePlacemarks = [];
};

// Callback for failure to init Google Earth
failureCallback = function (errorCode) {
    // For now, we just ignore this
    console.log('Google Earth failure: ' + errorCode);
    ge = null;
};

// Lazy-load custom icon style
getIconStyle = function () {
    var icon, style;

    if (!iconStyle) {
        icon = ge.createIcon('');
        style = ge.createStyle('');
        icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
        style.getIconStyle().setIcon(icon);

        iconStyle = style;
    }

    return iconStyle;
};

// Initialize the Google Earth plugin
initGoogleEarth = function () {
    google.earth.createInstance("earth", initEarthCallback, failureCallback);
};

// Callback for successful initialization of Google Earth
initEarthCallback = function (instance) {
    ge = instance;

    // Load the extensions library
    gex = new GEarthExtensions(ge);

    // Make the window visible with navigation controls
    ge.getWindow().setVisibility(true);
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);

    // Show several of the possible informational layers
    ge.getOptions().setOverviewMapVisibility(true);
    ge.getOptions().setScaleLegendVisibility(true);
    ge.getOptions().setStatusBarVisibility(true);

    // Show borders
    ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
};

// Test whether placemark is already in our array
placemarkExists = function (placename, latitude, longitude) {
    var i, placemark;

    for (i = 0; i < gePlacemarks.length; i++) {
        placemark = gePlacemarks[i];

        if (placemark.getName() === placename &&
            placemark.getGeometry().getLatitude() - latitude < 0.0001 &&
            placemark.getGeometry().getLongitude() - longitude < 0.0001) {
            return true;
        }
    }

    return false;
};

// Place this chapter's placemarks into Google Earth and zoom to show all
setupPlacemarks = function () {
    var bounds, folder, geotagId, latitude, longitude,
        matches, placemark, placename, point, value;

    if (gePlacemarks.length > 0) {
        clearPlacemarks();
    }

    $(visibleId + ' a[onclick^="showLocation("]').each(function() {
        value = this.getAttribute('onclick');

        matches = parseLatLon.exec(value);

        if (matches) {
            geotagId = matches[1];
            placename = matches[2];
            latitude = parseFloat(matches[3]);
            longitude = parseFloat(matches[4]);

            if (!placemarkExists(placename, latitude, longitude)) {
                // Create the placemark.
                placemark = ge.createPlacemark('');

                // Set the placemark's location.  
                point = ge.createPoint('');
                point.setLatitude(latitude);
                point.setLongitude(longitude);
                placemark.setGeometry(point);
                placemark.setName(placename);
                placemark.setStyleSelector(getIconStyle());

                // Cache the placemark in our placemarks list
                gePlacemarks.push(placemark);
            }
        }
    });

    if (gePlacemarks.length > 0) {
        if (gePlacemarks.length === 1 && matches) {
            // When there's exactly one placemark, add it and zoom to it
            ge.getFeatures().appendChild(gePlacemarks[0]);

            libraryObject.showLocation(matches[1], matches[2], matches[3],
                                       matches[4], matches[5], matches[6],
                                       matches[7], matches[8], matches[9],
                                       matches[10]);
        } else {
            folder = gex.dom.addFolder(gePlacemarks);
            bounds = gex.dom.computeBounds(folder);

            gex.view.setToBoundsView(bounds, {aspectRatio: 1.0});
        }
    }
};

showEarth = function () {
    $('#earthWrapper').show();

    if ($(window).width() <= 600) {
        $('#earth-close').show();
    } else {
        $('#earth-close').hide();
    }
};

// Show Google Maps version of placename
showMapLocation = function (placename, latitude, longitude) {
    /*
     * NEEDSWORK: this is a work in progress; I intend for this
     * eventually to supplement the GE plugin for devices or
     * browsers that can't run the GE plugin (e.g. iPads).
     */
    var height, width;

    width = $('#earth').outerWidth();
    height = $(window).height();

    $('#earth').html("<iframe width=\"" + width +
                     "\" height=\"" + height +
                     "\" frameborder=\"0\" scrolling=\"no\" " +
                     "marginheight=\"0\" marginwidth=\"0\" " +
                     "src=\"https://maps.google.com/maps?f=q" +
                     "&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=" + placename +
                     "&amp;aq=0&amp;oq=" + placename +
                     "&amp;sll=" +
                     latitude + "," + longitude +
                     "&amp;sspn=8.859086,10.546875&amp;t=h&amp;ie=UTF8&amp;hq=&amp;hnear=" +
                     placename + "&amp;ll=" +
                     latitude + "," + longitude +
                     "&amp;spn=0.09245,0.146255&amp;z=12&amp;iwloc=A&amp;output=embed\"></iframe>");
    // http://maps.google.com/?ll=%3.6f,%3.6f&spn=0.005,0.005&t=h&z=18&vpsrc=6
};

/*------------------------------------------------------------------------
 *                      USER MANAGEMENT FUNCTIONS
 */
isLoggedIn = function () {
    return (MS.googleResponse && MS.googleResponse.access_token) ||
           (MS.facebookResponse && MS.facebookResponse.id);
};

/*------------------------------------------------------------------------
 *                      TOP-LEVEL CODE
 */
    // Define an object that contains any members we want to be public
    libraryObject = {
        // Handle click on scripture link
        getScripture: function (parameters, directionLeft) {
            if (pendingRequest) {
                // Abort any in-process request
                pendingRequest.abort();
                pendingRequest = null;
            }

            // Show the user we're responding to the request
            $('<div id="loadingleft"><img src="loading.gif"></div>')
                .appendTo('div.scripturecontent');
            $('<div id="loadingright"><img src="loading.gif"></div>')
                .appendTo('div.scripturecontent');

            animationLeft = directionLeft;
            window.location.hash = hashFromParameters(parameters);
        },

        // Clear any popup elements in the page
        removePopup: function () {
            $('#alphacover').hide();
            $('#signinpopup').hide();
            $('#signoutpopup').hide();
            $('#settingspopup').hide();
        },

        // Handle click on place-name link: zoom to perspective
        showLocation: function (geotagId, placename, latitude, longitude,
                                viewLatitude, viewLongitude, viewTilt,
                                viewRoll, viewAltitude, viewHeading) {
            var camera, lookAt;

            MS.currentLocation = arguments;

            if (!ge) {
                showMapLocation(placename, parseFloat(latitude), parseFloat(longitude));
            }

            showEarth();

            if (viewLatitude === undefined) {
                // Just show the requested point from 5000m
                lookAt = ge.createLookAt('');

                // Set new latitude and longitude values.
                lookAt.setLatitude(parseFloat(latitude));
                lookAt.setLongitude(parseFloat(longitude));
                lookAt.setRange(5000);

                // Update the view in Google Earth.
                ge.getView().setAbstractView(lookAt);
            } else {
                // Show the point from a given perspective
                camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);

                // Set new latitude and longitude values.
                camera.setLatitude(parseFloat(viewLatitude));
                camera.setLongitude(parseFloat(viewLongitude));
                camera.setTilt(parseFloat(viewTilt));
                camera.setRoll(parseFloat(viewRoll));
                camera.setAltitude(parseFloat(viewAltitude));
                camera.setHeading(parseFloat(viewHeading));

                // Update the view in Google Earth.
                ge.getView().setAbstractView(camera);
            }
        },

        // Show settings dialog
        showSettings: function () {
            var x_position;

            createSettingsPopup();
            $('#alphacover').show();
            $('#settingspopup').show();

            // Place point up in middle of Settings link
            x_position = $('#settings').width() / 2 + $('#signin').width();
            $('#settingspopup .pointup').css('right', x_position + 'px');
            $('#settingspopup .pointuplight').css('right', x_position + 'px');
        },

        // Sign in using a given service
        signIn: function (service) {
            $('#alphacover').hide();
            $('#signinpopup').hide();

            if (service === 'facebook') {
                window.fbLogin();
            } else if (service === 'google') {
                window.gaLogin();
            }
        },

        // Sign out of a given service
        signOut: function () {
            delete MS.googleResponse;
            delete MS.facebookResponse;

            $('#alphacover').hide();
            $('#signoutpopup').hide();
            $('#signinlink').text('Sign In');
        },

        // If logged out, display the sign-in dialog, else display the
        // sign-out dialog
        toggleSignIn: function () {
            $('#alphacover').show();

            if (isLoggedIn()) {
                $('#signoutpopup').show();
            } else {
                $('#signinpopup').show();
            }
        }

    };

    // jQuery function that gets called when the DOM tree finishes loading
    $(function() {
        var authResponse,
            match,
            queryString = location.hash.substring(1),
            regex;
        
        $(window).unload(function(){
            if($('.rememberInput:checked').val()){
                var hash = window.location.hash;
                if(hash){
                    setCookie('LDSScripturesPlaceMarker', hash);
                } else {
                    clearCookie('LDSScripturesPlaceMarker');
                }
            } else {
                clearCookie('LDSScripturesPlaceMarker');
            }
        });

        $(window).resize(function () {
            if ($(window).width() > 600) {
                $('#earthWrapper').show();
                $('#earth-close').hide();
            } else {
                if ($('#earthWrapper').is(':visible')) {
                    $('#earth-close').show();
                }
            }
        });

        $.getJSON('getlayers', function(layers) {
            var items = [],
                layer;

            while (layers.length) {
                layer = layers.shift();
                items.push('<label class="checkbox"><input type="checkbox" name="l' + layer.id + '"' +
                           (layer.default === 'Y' ? ' checked' : '') +
                           '>' + layer.name + '</label><br />');
            }

            /*
            $('<ul />', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('body');
            */
        });

        // Set up handler for Google Earth close button used in narrow mode
        $('#earth-close').click(function () {
            $('#earthWrapper').hide();
        });

        // If current hash is Google Accounts response, parse and handle it
        if (queryString.indexOf('access_token') >= 0 ||
            queryString.indexOf('error') >= 0) {

            authResponse = {};
            regex = /([^&=]+)=([^&]*)/g;
            match = regex.exec(queryString);

            while (match) {
                authResponse[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
                match = regex.exec(queryString);
            }

            // NEEDSWORK: do we need to save the authResponse to the server?

            // NOTE: this makes a property labeled "googleReponse" on our
            // returned library object
            libraryObject.googleResponse = authResponse;

            window.location.hash = authResponse.state || '';
        } else {
            // Load the scriptures div with content as soon as possible
            if(getCookie('LDSScripturesPlaceMarker')){
                window.location = '/webdev/assignment5/' + getCookie('LDSScripturesPlaceMarker');
            } else {
                navigateScriptures();
            }
        }
    });

    // Google Earth top-level initialization code
    google.load("earth", "1");
    google.setOnLoadCallback(initGoogleEarth);

    // Intercept back/forward button events via hashChange event
    $(window).bind('hashchange', navigateScriptures);

    // Demonstrate reading/writing of cookies
    document.write('<!-- sample cookie: ' + docCookies.getItem('sample') + ' --><br />');

    if (docCookies.getItem('sample') === 'raisin-cookie') {
        docCookies.setItem('sample', 'sugar-cookie', 24 * 60 * 60, '/mapscrip', 'scriptures.byu.edu');
    } else {
        docCookies.setItem('sample', 'raisin-cookie', 24 * 60 * 60, '/mapscrip', 'scriptures.byu.edu');
    }

    return libraryObject;

}()); // End of package wrapper

/*------------------------------------------------------------------------
 *                      PUBLIC FUNCTIONS
 */
function getScripture(parameters, directionLeft) {
    "use strict";

    // Pass through to library
    MS.getScripture(parameters, directionLeft);
}

function showLocation(geotagId, placename, latitude, longitude,
                      viewLatitude, viewLongitude, viewTilt,
                      viewRoll, viewAltitude, viewHeading) {
    "use strict";

    // Pass through to library
    MS.showLocation(geotagId, placename, latitude, longitude,
                    viewLatitude, viewLongitude, viewTilt,
                    viewRoll, viewAltitude, viewHeading);
}

/*========================================================================
 *                      END OF FILE mapscrip.js
 */
