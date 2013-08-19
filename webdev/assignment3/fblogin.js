// Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '472987686096490', // App ID
      channelUrl : '//www.sethmileshoward.com/webdev/assignment3/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    // Additional init code here
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
        // connected
            console.log('connected')
            testAPI();
        } else if (response.status === 'not_authorized') {
        // not_authorized
            console.log('not auth')
        } else {
        // not_logged_in
            console.log('not lgoged int')
        }
    });
  };
  
    function fblogin() {
        FB.login(function(response) {
            if (response.authResponse) {
                testAPI();
            } else {
                alert('We were unable to log you in, please try again.');
            }
        });
    }
 
    function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
            $('.signin').text("Welcome, " + response.name + '!').off('click');
        });
    }

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));