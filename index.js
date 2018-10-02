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
    return `<div class="search-result">
    <h3 class="result-title">${result.snippet.title}</h3>
    <button class="trigger" id="${result.id.videoId}">
    <img src="${result.snippet.thumbnails.medium.url}" alt="${result.snippet.title}"></button>
    <a href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank" rel="noopener noreferrer" class="channel-link">
    More from ${result.snippet.channelTitle}</a>
</div>`
}

//renders the Previous and Next page buttons
function renderNavButtons(data){
    let nextPageString = '';
    let prevPageString = '';
    if (data.nextPageToken) nextPageString = `<button class="nav-button" id="${data.nextPageToken}">Next >></button>`
    if (data.prevPageToken) prevPageString = `<button class="nav-button" id="${data.prevPageToken}"><< Previous</button>`    
    return `${prevPageString} ${nextPageString}`
};


function displayYoutubeSearch(data){
    console.log(data);
    //get the  HTML string array containing the results of the search
    let results = data.items.map(item => renderResults(item));
    //get the nextPage and previousPage tokens
    let navString = renderNavButtons(data);
    //put it into HTML
    $('.js-search-results').prop('hidden', false).html(results);
    $('.js-navigation').prop('hidden', false).html(navString);
}

// shows the search keyword(s) entered
function displaySearchTitle(searchString){
    searchTitleString = `<h2>Search Results for: <span>${searchString}</span></h2>`
    $('.js-search-title').prop('hidden', false).html(searchTitleString);
}

//gets search results upon submit
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

//pulls the next or previous page
function watchNavigation(){
    $('.js-navigation').on('click', 'button', function(event){
        let idToken = $(this).attr('id');
        let existingQuery = $('.js-search-title').find('span').text();
        getDataFromAPI(existingQuery, displayYoutubeSearch, idToken);
    });
}

//makes the html code for the embedded video link using iframe
function renderEmbedLink(videoCode){
    return `<iframe width="560" height="315" 
    src="https://www.youtube.com/embed/${videoCode}" frameborder="0" 
    allow="autoplay; encrypted-media" allowfullscreen></iframe>`
}

//makes modal visible or invisible
function toggleModal(){
    $('.modal').toggleClass('show-modal');
}

function watchModal(){
    $('.js-search-results').on('click', '.trigger', function(event){
        //passes the video id into renderEmbedLink
        let embedLink = renderEmbedLink($(this).attr('id'));
        //insert the embedded link into the modal paragraph 
        $('.video-player').html(embedLink);
        //make the modal visible
        toggleModal();
    });

    $('.close-button').click(event => {
        //make the modal hidden
        toggleModal();
    });
}

$(watchSubmit);
$(watchNavigation);
$(watchModal);