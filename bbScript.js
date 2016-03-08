salemoveApi.addEventListener(
  salemoveApi.EVENTS.ENGAGEMENT_START,
    function(engagement){
      console.log("the engagement with id " + engagement.engagementId + " has begun!")
    }
);
salemoveApi.addEventListener(
  salemoveApi.EVENTS.ENGAGEMENT_START,
  checkEmail);

function checkEmail(){
  var email = $('.sm-user-email').val()
  console.log(email)
  if (email ===  undefined || "" || null) {
    addListener();
  }
}

salemoveApi.addEventListener(
  salemoveApi.EVENTS.ENGAGEMENT_END,
    function(engagement){ 
      console.log('the engagement with id ' + engagement.engagementId + ' ended!');
    }
);


function addListener(){
  $(document.body).on('change','.sm-user-email',function(){
    alert('Change Happened, look for new info.');
    postToRubyApp();
});
}

function postToRubyApp(){
  var email = $('.sm-user-email').val()
  console.log(email + " this is inside rubyfunction")
  $.ajax({
    type: "POST",
    data: JSON.stringify(email),
    url: "http://localhost:3000/",
    contentType: "application/json"
  })
  console.log("Ajax Request success?")
}

sm.getApi({version:'v1'}).then(

  function(api){
    console.log("I got the api!", api);
    window.salemoveApi = api;
  },
  function(err){ console.log("An error occured: ", err)}
);


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

var xhr = createCORSRequest('GET', "https://tranquil-temple-7492.herokuapp.com");
if (!xhr) {
  throw new Error('CORS not supported');
}

xhr.onload = function() {
 var responseText = xhr.responseText;

 console.log(responseText);
 // process the response.
};

xhr.onerror = function() {
  console.log(xhr.err)
  console.log('There was an error!');
};


xhr.send()
