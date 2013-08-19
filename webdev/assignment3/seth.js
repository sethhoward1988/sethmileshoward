/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function triggerLogin() {
    $('.overlay').fadeToggle();
    $('.login-pane').fadeToggle();
}

function openLogin () {
    
}

function login () {
    var username = $('.username-input').val(),
        password = $('.password-input').val()
        
    if(username == '' || password == ''){
        alert('Please enter a username or password to login');
        return;
    }
    
    setCookie('scripturesLoginCookie', username + '**' + password);
    
    checkLogin();
    triggerLogin();
}

function logout() {
    clearCookie('scripturesLoginCookie');
    $('.signin').text('Login').on('click', triggerLogin);
    $('.logout').remove();
}

function checkLogin () {
    var cookie = getCookie('scripturesLoginCookie');
    if(cookie){
        var accountInfo = cookie.split('**');
        $('.signin').text("Welcome, " + accountInfo[0] + '!').off('click');
        $('<div class="logout"></div>').text('Logout').appendTo('.login-options').on('click', logout);
    } else {
        logout();
    }
}

$(function(){
    $('.fb-login').on('click', fblogin);
    $('.google-login').on('click', handleAuthClick);
    $('.cancel, .overlay, .signin').on('click', triggerLogin);
    $('.close-earth').on('click', function(){
        $('#earth').fadeOut();
        $('#scriptures').fadeIn();
        $('.close-earth').fadeOut();
    })
//    $('.login').on('click', login);
//    checkLogin();
});


