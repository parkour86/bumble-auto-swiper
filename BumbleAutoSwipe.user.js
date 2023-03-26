// ==UserScript==
// @name         BumbleAutoSwipe
// @namespace    BumbleAutoSwipe
// @version      0.1
// @description  Auto Swipe Right
// @match        https://bumble.com/app*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bumble.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    setTimeout(function() {
        // Body Click Functions
        $('body').unbind().on('click', function(e) {
            setTimeout(function() {
                var cnt = 0;
                if ($('#Start').length == 0){
                    $('main.page__content .page__header').after("<div id='Start'><a href='#'>Start</strong></a>");
                    $('main.page__content .page__header').after("<div id='Stop' style='display:none'><a href='#'>Stop</a></div>");
                    $('main.page__content .page__header').after(`<div id='Counter'>Swipes: ${cnt}</div>`);
                }

                $('#Start').unbind().on('click', function(e) {
                    $('#Start').hide();
                    $('#Stop').show();
                    var storeTimeInterval = setInterval(function(){
                        if ($('#Start').is(":visible") || $('.encounters-user__blocker').length > 0){
                            clearInterval(storeTimeInterval);
                            $('#Start').show();
                            $('#Stop').hide();
                            console.log('stopped')
                            return false;
                        }
                        // Create a click element
                        var clickEvent = document.createEvent("HTMLEvents");
                        clickEvent.initEvent("click", true, true);
                        $('div[data-qa-role="encounters-action-like"]')[0].dispatchEvent(clickEvent);
                        console.log('running')
                        cnt+=1;
                        $('#Counter').text(cnt);
                    }, 1000);
                });

                $('#Stop').unbind().on('click', function(e) {
                    $('#Start').show();
                    $('#Stop').hide();
                    
                });
            }, 1000);
        });
    }, 10000);
})();


