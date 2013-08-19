

$(function(){
    window.clientId = '461597086668.apps.googleusercontent.com';
    window.apiKey = 'AIzaSyDWZo_nHhEQZ4_b06FCb6z2i6UUR7FzTqM';
    window.scopes = 'https://www.googleapis.com/auth/userinfo.profile';
});

function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {   
        makeApiCall(authResult.access_token);
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}

function makeApiCall(token) {
  // First, parse the query string
  $.ajax({
      url:'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token,
      success: function(resp){
          if(resp){
              $('.signin').text("Welcome, " + resp.name + '!').off('click');
          }
          triggerLogin();
      }
  })
}