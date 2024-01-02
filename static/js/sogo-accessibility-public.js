(function ($) {
    'use strict';

    $(document).ready(function () {

        var body = $('body');
        if (readCookie('sogo_accessibility')) {
            body.addClass('sogo_accessibility');
            $('.accessibility_menu').setup_navigation();
        }

        if (readCookie('sogo_bnc')) {
            body.addClass('sogo_blank_white');
        }

        if (readCookie('sogo_sogo_readable_font')) {
            body.addClass('sogo_readable_font');
        }

        if (readCookie('sogo_underline_links')) {
            body.addClass('sogo_underline_links');
        }

        if (readCookie('sogo_contrasts')) {
            body.addClass('sogo_contrasts');
            var file = $('#contrasts').data('css');
            loadjscssfile(file, 'css', 'sogo_contrasts_css');
        }

        if (readCookie('sogo_contrasts_white')) {
            body.addClass('sogo_contrasts_white');
            var file = $('#contrasts_white').data('css');
            loadjscssfile(file, 'css','sogo_contrasts_css_white');
        }

        if (readCookie('sogo_font_2')) {
            body.addClass('sogo_font_2');
        }

        if (readCookie('sogo_font_3')) {
            body.addClass('sogo_font_3');
        }

        sogo_change_fonts();

        // open socgoacc
        $('.toggle_sogoacc').click(function () {
            $('#sogoacc').slideToggle();
            body.addClass('sogo_accessibility');
           setTimeout(function(){  $('#b_n_c').focus(); }, 500);
        });

        $('a[href="#sogo_access_statement"]').click(function(e){
            $('#sogo_access_statement').show();
            $('#sogo_overlay').show();
        });
        $('#close_sogo_access_statement').click(function(){
            $('#sogo_access_statement').hide();
            $('#sogo_overlay').hide();
        });

        $('#sogo_accessibility').click(function () {
            if (body.hasClass('sogo_accessibility')) {
                eraseSogoCookie();

                location.reload();
                return false;
            } else {
                //createCookie('sogo_accessibility', 'true', 365);
                //sogo_set_accessibility();
            }
            //body.addClass('sogo_accessibility');

        });

        $('#b_n_c').click(function () {
            if (body.hasClass('sogo_blank_white')) {
                eraseCookie('sogo_bnc');
            } else {
                createCookie('sogo_bnc', 'true', 365);
            }
            body.toggleClass('sogo_blank_white');
            $('#sogoacc').slideUp();

        });



        $('#contrasts').click(function () {
            var id = $('#sogo_contrasts_css');
            if (id.length > 0) {
                eraseCookie('sogo_contrasts');
                id.remove();
            } else {
                createCookie('sogo_contrasts', 'true', 365);
                var file = $(this).data('css');
                loadjscssfile(file, 'css','sogo_contrasts_css');
            }
            body.toggleClass('sogo_contrasts');
            $('#sogoacc').slideUp();
        });

        $('#contrasts_white').click(function () {
            var id = $('#sogo_contrasts_css_white');
            if (id.length > 0) {
                eraseCookie('sogo_contrasts_white');
                id.remove();
            } else {
                createCookie('sogo_contrasts_white', 'true', 365);
                var file = $(this).data('css');
                loadjscssfile(file, 'css','sogo_contrasts_css_white');
            }
            body.toggleClass('sogo_contrasts_white');
            $('#sogoacc').slideUp();
        });
        $('#animation_off').click(function () {
            if (body.hasClass('sogo_blank_white')) {
                eraseCookie('sogo_animation_off');
            } else {
                createCookie('sogo_animation_off', 'true', 365);
            }
            body.toggleClass('sogo_animation_off');
            $('#sogoacc').slideUp();
        });

        $('#readable_font').click(function () {
            if (body.hasClass('sogo_readable_font')) {
                eraseCookie('sogo_readable_font');
            } else {
                createCookie('sogo_readable_font', 'true', 365);
            }
            body.toggleClass('sogo_readable_font');
            $('#sogoacc').slideUp();
        });
        $('#underline_links').click(function () {
            if (body.hasClass('sogo_underline_links')) {
                eraseCookie('sogo_underline_links');
            } else {
                createCookie('sogo_underline_links', 'true', 365);
            }
            body.toggleClass('sogo_underline_links');
            $('#sogoacc').slideUp();
        });




        $('#sogo_a1').click(function () {
            eraseCookie('sogo_font_increase');
            eraseCookie('sogo_font_2');
            eraseCookie('sogo_font_3');
            location.reload();
        });

        $('#sogo_a2').click(function () {
            createCookie('sogo_font_2', 'true', 365);
            eraseCookie('sogo_font_3');
            sogo_change_font_cookie($(this).data('size'));

        });

        $('#sogo_a3').click(function () {
            createCookie('sogo_font_3', 'true', 365);
            eraseCookie('sogo_font_2');
            sogo_change_font_cookie($(this).data('size'));
        });

        function sogo_change_font_cookie(increase){
            var storeVal = readCookie('sogo_font_increase');
            if (storeVal && storeVal == increase) {
                return false;
            }
            createCookie('sogo_font_increase', increase, 365);
            location.reload();
        }

        function sogo_change_fonts() {
            var increase = readCookie('sogo_font_increase');
            if(increase){
                $('p,span,a,h1,h2,h3,h4,h5,h6').each(function () {
                    var fontsize;
                    fontsize = parseInt($(this).css('font-size')) * increase;
                    $(this).css({
                        'font-size': fontsize + "px"
                    });
                });
            }
        }

        function sogo_set_accessibility(){


            // Thanks to WebAIM.org
            if (document.location.hash && document.location.hash != '#') {
                var anchorUponArrival = document.location.hash;
                setTimeout(function () {
                    $(anchorUponArrival).scrollTo({duration: 1500});
                    $(anchorUponArrival).focus();
                }, 100);
            }
        }






    });
    $(window).load(function(){
        // set image alt
        $("img").each(function () {
            var img = $(this);
            if (!img.attr("alt") )
                img.attr("alt", "");
        });

    });

})(jQuery);


// load file js/css via js
function loadjscssfile(filename, filetype, id ) {
    if (filetype == "js") { //if filename is a external JavaScript file
        // alert('called');
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("id", id)
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseSogoCookie( ) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        if(c.indexOf('sogo') > 0){
            var e = c.indexOf('=');
            eraseCookie(c.substring(0,e));
        }
    }
    return null;
}
function eraseCookie(name) {
    // createCookie(name, "", -1);
    createCookie(name, "");
}
