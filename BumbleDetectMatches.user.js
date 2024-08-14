// ==UserScript==
// @name         BumbleDetectMatch
// @namespace    BumbleDetectMatch
// @version      0.1
// @description  This script will color the Like button Green if the person likes you.
// @match        https://bumble.com/app*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bumble.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define variables to store matches and the current match index
    let current_matches = [];
    let current_match_index = 0;

    // Handler for processing matches data
    const matches_handler = (data) => {
        // Extract matches from the data
        current_matches = data.body[0].client_encounters.results;
        console.log(current_matches);  // Log the matches to the console for debugging

        // Iterate over each match and print the user names, age and height
        current_matches.forEach(match => {
            if (match.user && match.user.name) {  // Ensure user and name exist
                const name = match.user.name;
                const age = match.user.age;

                // Find the lifestyle_height in the profile fields
                const profileFields = match.user.profile_fields || [];  // Adjust property name if necessary
                const heightField = profileFields.find(field => field.id === 'lifestyle_height');
                const lifestyleHeight = heightField ? heightField.display_value : 'Not Available';  // Get height value

                console.log(`Name: ${name}, Age ${age}, Height: ${lifestyleHeight}`);
            }
        });

        return data;  // Return the data as is
    };

    // Handler for processing a specific match
    const match_handler = () => {
        // Get the current match based on the index
        const match = current_matches[current_match_index];

        // Determine if the match is a "like" or "nope"
        const is_match = match.user.their_vote === 2;
        console.log("their_vote", is_match)

        try {
            // Find the like button using jQuery and set its color based on the vote
            const v_icon = $('.encounters-action.tooltip-activator.encounters-action--like').first();
            v_icon.find('svg').attr('fill', is_match ? 'green' : 'red');
            // Remove the path tag coloring
            v_icon.find('path').attr('fill', '');
        } catch (e) {
            console.log(e);  // Log any errors that occur
        }

        // Check if the match has voted or not
        if (match?.user?.their_vote === 1) {
            console.log(`${match.user.name} haven't voted yet`);  // Log if the match hasn't voted
            return;
        }
    };

    // Store the original JSON.parse function
    const originalJSONParse = JSON.parse;

    // Override JSON.parse to intercept JSON data
    JSON.parse = function (text) {
        // Log the raw JSON text to the console
        console.log('Intercepted JSON text:', text);

        // Check if the JSON contains a specific identifier to handle client vote responses
        if (text.includes('badoo.bma.ClientVoteResponse')) {
            current_match_index++;
            console.log(`current_match_index: ${current_match_index}`);
            match_handler();  // Process the match data
        }

        // Call the original JSON.parse to parse the JSON string
        const data = originalJSONParse(text);

        // Log the parsed JSON data to the console
        //console.log('Parsed JSON data:', data);

        // Check if the data contains encounter results
        if (data?.body?.[0]?.client_encounters?.results) {
            current_match_index = 0;  // Reset the match index
            return matches_handler(data);  // Process the matches data
        }

        // Return the parsed data so the website can use it
        return data;
    };

})();