
$(function(){
    $('.pane_header').on('click',function(evt){
        var target = $(evt.target);
        var from = $('.selected').text();
        positionTitles(target);
        expandSelected(target,from);
    })
})

function positionTitles(target){
    $('.pane_header').removeClass('selected');
    target.addClass('selected');
    $('.pane_header').each(function(){
        if(!$(this).hasClass('selected')){
            $(this).addClass('reduced');
        }
    })
}

function expandSelected(target,from){
    var page = target.text();
    if(page == from){return}
    if(page == 'Philosophy'){
        clearAttribute();
        animate('350px','-406px',from, page);
    } else if(page == 'Portfolio'){
        clearAttribute();
        toFixed();
        animate('1960px','-816px',from, page);
    } else if(page == 'Design'){
        scrollToTop();
        clearAttribute();
        toAbsolute();
        animate('1465px','-2865px',from, page);
    } else if(page == 'Me'){
        clearAttribute();
        animate('350px','-4395px',from, page);
    } else {
        clearAttribute();
        animate('350px','-4830px',from, page);
        
    }
}

function animate(container, column, from, page){
    from = getNumber(from);
    page = getNumber(page);
    if(page == 3){
        if(from < 3){
            $('.toggle_art').css('margin-left','0px');
            $('#container').animate({
                'height':container
            },'slow','easeInOutCubic');
            $('.col_right').animate({
                'margin-top':column
            },'slow','easeInOutCubic')
        } else {
            $('#container').animate({
                'height':container
            },'slow','easeInOutCubic');
            $('.col_right').animate({
                'margin-top':column
            },'slow','easeInOutCubic',function(){
                $('.toggle_art').animate({
                    'margin-left':'0px'
                })
            });
        }
    } else if(from == 3){
        if(page < 3){
            $('#container').animate({
                'height':container
            },'slow','easeInOutCubic');
            $('.col_right').animate({
                'margin-top':column
            },'slow','easeInOutCubic',function(){
                $('.toggle_art').css('margin-left','300px');
            })
        } else {
            $('.toggle_art').animate({
                'margin-left':'300px'
            },'fast',function(){
                $('#container').animate({
                    'height':container
                },'slow','easeInOutCubic');
                $('.col_right').animate({
                    'margin-top':column
                },'slow','easeInOutCubic');
            })
        }
    } else {
        animation(container, column)
    }
}

function animation(container, column){
    $('#container').animate({
        'height':container
    },'slow','easeInOutCubic');
    $('.col_right').animate({
        'margin-top':column
    },'slow','easeInOutCubic');
}

function getNumber(page){
    if(page == 'Philosophy'){
        return 1;
    } else if(page == 'Portfolio'){
        return 2;
    } else if(page =='Design'){
        return 3;
    } else if(page == 'Me'){
        return 4;
    } else {
        return 5;
    }
}

function clearAttribute(){
    $('.col_left').removeAttr('style');
    $('.col_left').css('position','fixed');
}

function scrollToTop(){
    $("html, body").animate({scrollTop: 0}, "slow");
}

function toFixed(){
    var el = $('.col_left');
        
    el.css({
        visibility:'none',
        position:'fixed'
    })

    // Get the static position
    var end = el.position();

    // Turn it back to absolute
    el.css({
        visibility:'visible',
        position:'absolute'
    })
    
    // Animate to the static position
    el.animate({ 
        top: end.top - 175
    },function(){
        el.removeAttr('style');
        el.css({
            position:'fixed'
        })
    });
}

function toAbsolute(){
    var el = $('.col_left');

    // Get the static position
    var end = el.position();

    el.css({
        top:end.top - 175,
        position:'absolute'
    })
    // Turn it back to absolute
    el.animate({ // Animate to the static position
        top: 0
    });
}