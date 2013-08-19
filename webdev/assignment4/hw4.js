
(function app() {

    var myCar = {
        description: ' 1957 Chevy, cherry red with black and silver ghost flames on the hood   ',
        gear: 'm1',
        nickname: 'Bob',
        speed: 0
    };

    var vehicle = (function () {
        return {
            forward: function (newForwardGear) {
                myCar.gear =  newForwardGear ? newForwardGear : myCar.gear;
            },

            reverse: function () {
                myCar.gear = 'reverse';
            },

            speed: function (newSpeedMph) {
                myCar.speed = typeof newSpeedMph === 'number' ? newSpeedMph : myCar.speed
            }   
        };
    }());

    document.write('myCar is in gear <b>' + myCar.gear + '</b> and is going ' + myCar.speed + ' mph<br />');

    vehicle.forward('d');
    vehicle.speed(42);
    document.write('myCar is now in gear <b>' + myCar.gear + '</b> and is going ' + myCar.speed + ' mph<br />');

    vehicle.reverse();
    vehicle.speed(5);
    document.write('myCar is in gear <b>' + myCar.gear + '</b> and is going ' + myCar.speed + ' mph<br />');

    myCar.description = myCar.description.trim();
    document.write('myCar is a ' + myCar.description + '<br />');

    document.write('myCar\'s nickname is ' + myCar.nickname +
                   ', which backwards is ' + myCar.nickname.reverse() + '<br />');

    if (myCar.description.startsWith('1957')) {
        document.write('myCar\'s description starts with 1957<br />');
    } else {
        document.write('myCar\'s description does NOT start with 1957<br />');
    }

    if (myCar.description.startsWith('1965')) {
        document.write('myCar\'s description starts with 1965<br />');
    } else {
        document.write('myCar\'s description does NOT start with 1965<br />');
    }

    if (myCar.nickname.endsWith('b')) {
        document.write('myCar\'s nickname ends with \'b\'<br />');
    } else {
        document.write('myCar\'s nickname does NOT end with \'b\'<br />');
    }

    if (myCar.nickname.endsWith('B')) {
        document.write('myCar\'s nickname ends with \'B\'<br />');
    } else {
        document.write('myCar\'s nickname does NOT end with \'B\'<br />');
    }
    
})();
