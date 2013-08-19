window.gaGetProfile = function () {
    $.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' +
          MS.googleResponse.access_token).success(function (data) {
        console.log('Received Google account profile');
    });
};

window.gaLogin = function () {
    var hashtag = window.location.hash.substring(1);

    window.location = 'https://accounts.google.com/o/oauth2/auth?scope=' +
        encodeURI('https://www.googleapis.com/auth/userinfo.email') + '+' +
        encodeURI('https://www.googleapis.com/auth/userinfo.profile') +
    '&state=' + encodeURI(hashtag) +
    '&redirect_uri=' + encodeURI('http://scriptures.byu.edu/mapscrip/') +
    '&response_type=token' +
    '&client_id=520534591418.apps.googleusercontent.com';
};
