/*!
 * jquery.customSelect() - v0.3.3
 * http://adam.co/lab/jquery/customselect/
 * 2013-03-04
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 */
(function(a){a.fn.extend({customSelect:function(b){var c={customClass:null,mapClass:true,mapStyle:true},d=function(f,i){var e=f.find(":selected"),h=i.children(":first"),g=e.html()||"&nbsp;";h.html(g);setTimeout(function(){i.removeClass("customSelectOpen")},60)};if(typeof document.body.style.maxHeight==="undefined"){return this}b=a.extend(c,b);return this.each(function(){var e=a(this),g=a('<span class="customSelectInner" />'),f=a('<span class="customSelect" />');f.append(g);e.after(f);if(b.customClass){f.addClass(b.customClass)}if(b.mapClass){f.addClass(e.attr("class"))}if(b.mapStyle){f.attr("style",e.attr("style"))}e.addClass("hasCustomSelect").on("update",function(){d(e,f);var i=parseInt(e.outerWidth(),10)-(parseInt(f.outerWidth(),10)-parseInt(f.width(),10));f.css({display:"inline-block"});var h=f.outerHeight();if(e.attr("disabled")){f.addClass("customSelectDisabled")}else{f.removeClass("customSelectDisabled")}g.css({width:i,display:"inline-block"});e.css({"-webkit-appearance":"menulist-button",width:f.outerWidth(),position:"absolute",opacity:0,height:h,fontSize:f.css("font-size")})}).on("change",function(){f.addClass("customSelectChanged");d(e,f)}).on("keyup",function(){e.blur();e.focus()}).on("mousedown",function(){f.removeClass("customSelectChanged").addClass("customSelectOpen")}).focus(function(){f.removeClass("customSelectChanged").addClass("customSelectFocus")}).blur(function(){f.removeClass("customSelectFocus customSelectOpen")}).hover(function(){f.addClass("customSelectHover")},function(){f.removeClass("customSelectHover")}).trigger("update")})}})})(jQuery);