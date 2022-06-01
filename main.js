/*
* Source:
*   https://github.com/reflectivecode/cloudflare-worker-webp/
* Description:
*   Returns a webp image instead of a png/jpg image
*   when the client supports webp and the webp image exists.
* Prerequisites:
*   You will need to create webp versions of your images.
*   The webp image should have .webp added to the end of the url.
*   For example, the image https://example.com/path/image.png.web
*   is returned when https://example.com/path/image.png is requested.
* Limitations:
*   Query string parameters are not supported.
*   Only requests for PNG and JPG images are supported.
* WordPress:
*   You could use the EWWW Image Optimizer plugin (free)
*   to generate webp versions of your images.
*   Use this worker with the following route:
*   https://your-domain/wp-content/*
*/
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const acceptRegex = /image\/webp/;
const urlRegex = /\.jpg$|\.png$/;

async function handleRequest(request) {
  if (isGetRequest(request) && isImageRequest(request) && isWebPCompatible(request)) {
    const url = new URL(request.url + '.webp');
    var response = await fetch(url, request);
    if (response.status < 400) {
      return response;
    }
  }
  return fetch(request);
}

function isGetRequest(request) {
  return request.method === 'GET';
}

function isImageRequest(request) {
  return request.url.match(urlRegex);
}

function isWebPCompatible(request) {
  const accept = request.headers.get('Accept');
  return accept && accept.match(acceptRegex);
}
