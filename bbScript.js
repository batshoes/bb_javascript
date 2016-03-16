var cbAfterSaleMoveIsReady = function(salemoveApi){
  salemoveApi.addEventListener(
    salemoveApi.EVENTS.ENGAGEMENT_START,
      function(engagement){
        console.log("the engagement with id " + engagement.engagementId + " has begun!")
      }
  );
  salemoveApi.addEventListener(
    salemoveApi.EVENTS.ENGAGEMENT_START,
      currentVisitorRequest
  );
  salemoveApi.addEventListener(
    salemoveApi.EVENTS.ENGAGEMENT_END,
      function(engagement){ 
        console.log('the engagement with id ' + engagement.engagementId + ' ended!');
      }
  );
}

sm.getApi({version:'v1'}).then(
  function(api){
    window.salemoveApi = api;
    cbAfterSaleMoveIsReady(api);
    console.log("got the API" + api)
  },
  function(err){ 
    console.log("An error occured: ", err
  )}
);

function checkEmail(){
  var email = $('.sm-user-email').val()
  console.log(email)
  if (email ===  undefined || "" || null) {
    addListener();
  }
}

function addListener(){
    alert('Listener added')
  $(document.body).on('change','.sm-user-email',function(){
    alert('Change Happened, look for new info.');
    postToRubyApp();
  });
}

function postToRubyApp(){
  var email = $('.sm-user-email').val();
  var accept = 'application/vnd.salemove.v1+json'
  var body =  {
                'email': email,
                "Authorization": requestHeadersAuth,
                "Accept": accept,
                "X-Salemove-Visit-Session-Id": requestHeadersSession
              }

  $.ajax({
    type: "GET",
    data: body,
    url: "http://localhost:3000/tickets",
    contentType: "application/json"
  })
      console.log("Ajax Request success?")
}

function currentVisitorRequest(api){

  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.salemove.com/visitor');

  window.requestHeadersAuth = salemoveApi.getRequestHeaders()['Authorization']
  window.requestHeadersSession = salemoveApi.getRequestHeaders()['X-Salemove-Visit-Session-Id']

  request.setRequestHeader('Authorization',
                            requestHeadersAuth)
  request.setRequestHeader('Accept',
                            'application/vnd.salemove.v1+json');
  request.setRequestHeader('X-Salemove-Visit-Session-Id',
                            requestHeadersSession)

  request.onreadystatechange = function(){
    if (this.readyState === 4){
      var body = this.responseText
      console.log('Status:', this.status);
      console.log('Headers:', this.getAllResponseHeaders() );
      console.log('Body:', this.responseText);
      console.log(this);

      window.parsed = JSON.parse(body);

      if(parsed.email === null || "" || undefined){
        addListener();
      } else {
        // requestZenDesk(parsed.email)
        console.log("we got an email, yo")
      }
    }
  };
  request.send();
}

// function createCORSRequest(method, url) {
//   var xhr = new XMLHttpRequest();
//   xhr.withCredentials = true;
//   if ("withCredentials" in xhr) {

//     // Check if the XMLHttpRequest object has a "withCredentials" property.
//     // "withCredentials" only exists on XMLHTTPRequest2 objects.
//     xhr.open(method, url, true);

//   } else if (typeof XDomainRequest != "undefined") {

//     // Otherwise, check if XDomainRequest.
//     // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
//     xhr = new XDomainRequest();
//     xhr.open(method, url);

//   } else {

//     // Otherwise, CORS is not supported by the browser.
//     xhr = null;

//   }
//   return xhr;
// }

// var xhr = createCORSRequest('GET', "http://localhost:3000/tickets");
// if (!xhr) {
//   throw new Error('CORS not supported');
// }
// xhr.onloadstart = function() {
//   data = {
//     payload: "hello world",
//     contentType: "application/json"
//   }
// }
// xhr.onload = function() {
//  var responseText = xhr.responseText;

//  console.log(responseText);
//  // process the response.
// };

// xhr.onerror = function() {
//   console.log(xhr.err)
//   console.log('There was an error!');
// };


// xhr.send()


