const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

//retrieves the data from the API and runs the callback function
function getDataFromAPI(searchTerm, callback, tokenId){
    const settings = {
        url: YOUTUBE_SEARCH_URL,
        data: {
            key: 'AIzaSyDOszIaG1Ao6Yf66WAw2n83SUma7jnzRRA',
            q: searchTerm,  
            part: 'snippet',
            type: 'video',
            videoEmbeddable: 'true',
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    if (tokenId) settings.data.pageToken = tokenId;
    $.ajax(settings)
}

//puts each result into html string format
function renderResults(result){
    return `<div>
    <h3 class="result-title">${result.snippet.title}</h3>
    <a href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank" rel="noopener noreferrer" class="video-link">
    <img src="${result.snippet.thumbnails.medium.url}">
    </a>
    <a href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank" rel="noopener noreferrer" class="channel-link">
    More from ${result.snippet.channelTitle}</a>
</div>`
}

//renders the Previous and Next page buttons
function renderNavButtons(data){
    let nextPageString = '';
    let prevPageString = '';
    if (data.nextPageToken) nextPageString = `<li id="${data.nextPageToken}">Next >></li>`
    if (data.prevPageToken) prevPageString = `<li id="${data.prevPageToken}"><< Previous</li>`    
    return `<ul>
    ${prevPageString}
    ${nextPageString}
    </ul>`
};


function displayYoutubeSearch(data){
    console.log(data);
    //get the  HTML string array containing the results of the search
    let results = data.items.map(item => renderResults(item));
    //get the nextPage and previousPage tokens
    let navString = renderNavButtons(data);
    //put it into HTML
    $('.js-search-results').html(results);
    $('.js-navigation').html(navString);
}

function displaySearchTitle(searchString){
    searchTitleString = `<h2>Search Results for: <span>${searchString}</span></h2>`
    $('.js-search-title').html(searchTitleString);
}

function watchSubmit(){
    $('.js-search-form').submit(function(event){
        event.preventDefault();
        let queryTarget = $(this).find('.js-query');
        let query = queryTarget.val();
        queryTarget.val('');
        getDataFromAPI(query, displayYoutubeSearch);
        displaySearchTitle(query);
    });
}

function watchNavigation(){
    $('.js-navigation').on('click', 'li', function(event){
        let idToken = $(this).attr('id');
        console.log(idToken);
        let existingQuery = $('.js-search-title').find('span').text();
        getDataFromAPI(existingQuery, displayYoutubeSearch, idToken);
    });
}

$(watchSubmit);
$(watchNavigation);