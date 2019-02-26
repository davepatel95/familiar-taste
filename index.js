'use strict';

const API_KEY = '75ba502c93d914f57e4e196ace10f46f';
const shared_secret = '84d016400979c15a6b086b758cffab92';
const searchURL = 'https://ws.audioscrobbler.com/2.0/';

function formatQueryParams(params){
    const queryItems = Object.keys(params).map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );
    return queryItems.join('&');
        

}

function displayResults(data) {
    $('.results-list').empty();
    console.log(data);

    if (data.message === 'Track not found') {
        $('.error-message').append(
            `<p class="error">Sorry, Track Not Found!</p>`
        )
        
    }
    else if (data.similartracks.track.length === 0) {
        console.log(data);
        $('.error-message').append(
            `<p class="error">Sorry, No Related Tracks Found!</p>`
        )
     }
    

    else{  
        
        for (let i = 0; i < data.similartracks.track.length; i++){

        $('.results-list').append(
            `<li><h3>Track: <a href="${data.similartracks.track[i].url}">${data.similartracks.track[i].name}</a></h3></li>
            <li>Artist: ${data.similartracks.track[i].artist.name}</li>
            <li>Match: ${data.similartracks.track[i].match.toFixed(2) * 100}% </li>`
        )
        }

        $('.results-list').removeClass('hidden');
    }
}

function relatedMusicResults(artistName, trackName, maxResults = 10) {
    

    const params = {
        api_key: API_KEY,
        method: 'track.getSimilar',
        track: trackName,
        artist: artistName,
        format: 'json',
        limit: maxResults,
        autocorrect: 1
    };

    const queryString = formatQueryParams(params);
    const URL = searchURL + '?' + queryString;

    fetch(URL)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(data => displayResults(data))
        .catch(error => {
            $('.error-message').text(`Something went wrong: ${error.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        let artistName = $('.artist-name').val();
        let trackName = $('.track-name').val();
        let maxResults = $('.max-number-results').val();
        $('.results').empty;
        relatedMusicResults(artistName, trackName, maxResults);

        $('.artist-name').val('');
        $('.track-name').val('');
        $('.max-number-results').val('');
        $('.error-message').empty();
    })
}

$(function() {
    console.log('App loaded. Waiting on entry');
    watchForm();
})