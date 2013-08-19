window.fbLogin = function () {
    FB.login(function (response) {
        MS.facebookResponse = response;

        if (response.authResponse) {
            // connected
            testFacebookAPI();
        } else {
            // cancelled
        }
    });
};

function testFacebookAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
        MS.userName = response.name;
        MS.facebookResponse = response;
        $('#signinlink').text(MS.userName);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId      : '336584449790945', // App ID
        channelUrl : '//scriptures.byu.edu/mapscrip/channel.html',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });

    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            // already connected
            testFacebookAPI();
        } else if (response.status === 'not_authorized') {
            // not_authorized
            window.fbLogin();
        } else {
            // not_logged_in
            window.fbLogin();
        }
    });
};

// Load the SDK asynchronously
(function (d){
    var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];

    if (!d.getElementById(id)) {
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }
}(document));
