// jQuery function that gets called when the page finishes loading
$(function() {
    // Start by displaying the table of contents for the scriptures
    var request = $.get('http://scriptures.byu.edu/mapgetscrip2.php');
    request.success(function(html) {
        $('#scriptures').html(html);
    });
    $('.expand').on('click', expandScriptures);
});

// Google Earth global variables and top-level initialization code
var ge;
var gex;
var gePlacemarks = [];
var googleEarthLoaded = false;

google.load("earth", "1");
google.setOnLoadCallback(initGoogleEarth);

// Remove all placemarks from Google Earth
function clearPlacemarks() {
    var features = ge.getFeatures();
    var feature;

    while ( (feature = features.getFirstChild()) ) {
        features.removeChild(feature);
    }

    // Clear global array of current placemarks
    gePlacemarks = [];
}

// Callback for failure to init Google Earth
function failureCallback(errorCode) {
    // For now, we just ignore this
}

// Handle click on scripture link
function getScripture(parameters) {
    var url = 'http://scriptures.byu.edu/mapgetscrip2.php';

    if (parameters != '') {
        url += parameters;
    }

    var request = $.get(url);

    request.success(getScriptureCallback);
}

// Display the new scripture content to the user
function getScriptureCallback(html) {
    $('#scriptures').html(html);
    var aGroup = $(html).find('a');
    var plotPoints = [];
    aGroup.each(function(index, a){
        if($(a).attr('onclick').indexOf('showLocation') == 0){
            plotPoints.push(a);
        }
    })
    
    if (googleEarthLoaded) {
        setupPlacemarks(plotPoints);
    }
}

// Initialize the Google Earth plugin
function initGoogleEarth() {
    google.earth.createInstance("earth", initEarthCallback, failureCallback);
}

// Callback for successful initialization of Google Earth
function initEarthCallback(instance) {
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

    googleEarthLoaded = true;
}

// Test whether placemark is already in our global array
function placemarkExists(placename, latitude, longitude) {
    for (var i = 0; i < gePlacemarks.length; i++) {
        if (gePlacemarks[i].getName() == placename &&
            gePlacemarks[i].getGeometry().getLatitude() - latitude < .0001 &&
            gePlacemarks[i].getGeometry().getLongitude() - longitude < .0001) {
            return true;
        }
    }

    return false;
}

// Place this chapter's placemarks on Google Earth and zoom to show all
function setupPlacemarks(placemarks) {
    if (gePlacemarks.length > 0) {
        clearPlacemarks();
    }
    
    // TODO:
    // Use jQuery to find all hyperlinks dealing with geocoded places.
    // Then parse out the parameters (placename, latitude, longitude).
    // If the placename is already in the global list, skip it.
    // Otherwise, create a placemark and add it to Google Earth.
    // Also be sure to add the placemark to the global list.
    
    $.each(placemarks, function(index, placemark){
       var text = $(placemark).attr('onclick');
       var location = text.match(/'(.*?)'/)[1];
       var latLong = text.match(/,(.*?)\)/)[1].split(',');
       console.log(location, latLong);
       if(!placemarkExists(location, latLong[0], latLong[1])){
           //add globally and create
           // Create the placemark.
           var placemark = ge.createPlacemark('');
           placemark.setName(location);
           
           // Define a custom icon.
            var icon = ge.createIcon('');
            icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
            var style = ge.createStyle(''); //create a new style
            style.getIconStyle().setIcon(icon); //apply the icon to the style
            placemark.setStyleSelector(style); //apply the style to the placemark

           // Set the placemark's location.  
           var point = ge.createPoint('');
           point.setLatitude(parseFloat(latLong[0]));
           point.setLongitude(parseFloat(latLong[1]));
           placemark.setGeometry(point);

           // Add the placemark to Earth.
           ge.getFeatures().appendChild(placemark);
           gePlacemarks.push(placemark);
       }
    });
    

    if (gePlacemarks.length > 0) {
        var folder = gex.dom.addFolder(gePlacemarks);
        var bounds = gex.dom.computeBounds(folder);
        gex.view.setToBoundsView(bounds, {aspectRatio: 1.0});
    }
}

// Handle click on place-name link
function showLocation(placename, latitude, longitude) {
    if (!googleEarthLoaded) {
        return;
    }

    // Get the current view.
    var lookAt = ge.createLookAt('');

    // Set new latitude and longitude values.
    lookAt.setLatitude(latitude);
    lookAt.setLongitude(longitude);
    lookAt.setRange(5000);

    // Update the view in Google Earth.
    ge.getView().setAbstractView(lookAt);
}

function expandScriptures() {
    var scripWidth, earthWidth;
    if($('.expand').text() == 'Expand Scriptures'){
        $('.expand').text('Collapse Scriptures');
        scripWidth = '100%';
    } else {
        $('.expand').text('Expand Scriptures');
        scripWidth = '33%';
    }
    $('#scriptures').animate({
        width:scripWidth
    });
}
