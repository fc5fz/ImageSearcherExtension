//use your own google custom search api key and custom search engine
apikey = '';
cx = '';

//google image search for words user double clicks in browser
	document.body.addEventListener('dblclick',function(e) {
		var searchTerm = window.getSelection().toString();
		var target = e.target;
		
		if(searchTerm.length > 0) {
			getImageUrl(searchTerm, function(imageUrl, width, height) {
				
				var imageResult = document.createElement("img");
			
				console.log(searchTerm);
			  
				imageResult.width = width;
				imageResult.height = height;
				imageResult.src = imageUrl;
				
				//add the image to all instances of that word in element user clicked on
				// will need to ensure actual HTML not being changed if HTML is a search term
				var html = target.innerHTML;
				target.innerHTML = html.replace(new RegExp(searchTerm, 'g'), (searchTerm + ' ' + imageResult.outerHTML).toString());
				

			}, function(errorMessage) {
			  console.log('Cannot display image. ' + errorMessage);
			});
		}
	});

	
/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {

  var searchUrl = 'https://www.googleapis.com/customsearch/v1?searchType=image&cx=' + cx + '&key=' + apikey + '&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.items || response.items.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.items[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.link;
    var width = parseInt(firstResult.image.thumbnailWidth);
    var height = parseInt(firstResult.image.thumbnailHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}