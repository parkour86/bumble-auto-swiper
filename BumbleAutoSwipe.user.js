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
    clickAction();
    // Bind a body click for when the USER moves to another page
    $('body').unbind().on('click', function(event) {
        clickAction();
    });
})();

function clickAction() {
    // Keep trying to add the Start/Stop button after the page loads
    var AddButtonInterval = setInterval(function(){
        if ($('#Start').length > 0){
            clearInterval(AddBu\ttonInterval);
            return false;
        }else{
            $('main.page__content .page__header').after("<div id='Start'><a href='#'>Start</a></div>");
            $('main.page__content .page__header').after("<div id='Stop' style='display:none'><a href='#'>Stop</a></div>");
            $('main.page__content .page__header').after(`<div id='Counter'>Swipes: 0</div>`);
            var cnt = 0;
            // Set click action on the Start button
            $('#Start').unbind().on('click', function(e) {
                $('#Start').hide();
                $('#Stop').show();
                // Click the Continue Searching button
                var clickEvent = document.createEvent("HTMLEvents");
                clickEvent.initEvent("click", true, true);
                // Loop until the USER clicks Stop or the USER runs out of likes
                var storeTimeInterval = setInterval(function(){
                    if ($('#Start').is(":visible") || $('.encounters-user__blocker').length > 0){
                        clearInterval(storeTimeInterval);
                        $('#Start').show();
                        $('#Stop').hide();
                        console.log('stopped');
                        return false;
                    }
                    // If a Match was found then click continue and keep running
                    if ($('article[data-qa-role="encounters-match"]').length > 0){
                        // Two buttons are displayed, click the second one
                        $('div[data-qa-role="button"]')[1].dispatchEvent(clickEvent);
                        console.log("Match Detected")
                    }
                    // Verify the Like button is visible on the page
                    if ($('div[data-qa-role="encounters-action-like"]').length > 0){
                        // Click the Like button
                        $('div[data-qa-role="encounters-action-like"]')[0].dispatchEvent(clickEvent);
                        console.log('running');
                        cnt+=1;
                        $('#Counter').text(cnt);
                    }
                }, 1000);
            });
            // Set click action on the Stop button
            $('#Stop').unbind().on('click', function(e) {
                $('#Start').show();
                $('#Stop').hide();
            });
        }
    }, 2000);
}