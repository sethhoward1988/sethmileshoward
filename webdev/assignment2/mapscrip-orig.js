// jQuery function that gets called when the page finishes loading
$(function() {
    // Start by displaying the table of contents for the scriptures
    var request = $.get('http://scriptures.byu.edu/mapgetscrip.php');

    request.success(function(result) {
        $('#scriptures').html(result);
    });
});

// Google Earth code (executes right away because it's not in a function)
var ge;

google.load("earth", "1");
google.setOnLoadCallback(initGoogleEarth);

// Callback for failure to init GE
function failureCB(errorCode) {
}

// Handle click on scripture link
function getScripture(parameters) {
    var url = 'http://scriptures.byu.edu/mapgetscrip.php';

    if (parameters != '') {
        url += parameters;
    }

    var request = $.get(url);

    request.success(function(result) {
        $('#scriptures').html(result);
    });
}

// Initialize the Google Earth plugin
function initGoogleEarth() {
    google.earth.createInstance("earth", initCB, failureCB);
}

// Callback for successful initialization of GE
function initCB(instance) {
    ge = instance;
    ge.getWindow().setVisibility(true);
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);

    // ge.getOptions().setAtmosphereVisibility(true);
    // ge.getOptions().setGridVisibility(true);
    ge.getOptions().setOverviewMapVisibility(true);
    ge.getOptions().setScaleLegendVisibility(true);
    ge.getOptions().setStatusBarVisibility(true);
}

// Handle click on place-name link
function showLocation(placename, latitude, longitude) {
    // Create the placemark.
    var placemark = ge.createPlacemark('');

    // Define a custom icon.
    /*
    var icon = ge.createIcon('');
    icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
    var style = ge.createStyle(''); //create a new style
    style.getIconStyle().setIcon(icon); //apply the icon to the style
    placemark.setStyleSelector(style); //apply the style to the placemark
    */

    // Set the placemark's location.  
    var point = ge.createPoint('');
    point.setLatitude(longitude);
    point.setLongitude(latitude);
    placemark.setGeometry(point);
    placemark.setName(placename);

    // Add the placemark to Earth.
    ge.getFeatures().appendChild(placemark);

    // Get the current view.
    var lookAt = ge.createLookAt('');

    // Set new latitude and longitude values.
    lookAt.setLatitude(longitude);
    lookAt.setLongitude(latitude);
    lookAt.setRange(5000);

    // Update the view in Google Earth.
    ge.getView().setAbstractView(lookAt);
}
