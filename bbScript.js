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
  },
  function(err){ 
    console.log("An error occured: ", err
  )}
);

function addListener(){
  $('sm-user-email').on('change',function(){
    window.email = $(this).value
    sendToRubyApp();
  });
}


function checkEmail(string){
 var re = /\S+@\S+[\.][0-9a-z]+/
 return re.test(string)
}

function sendToRubyApp(){
  result = checkEmail(email)
  if (result === true){
    var accept = 'application/vnd.salemove.v1+json'
    var body =  {
                  'email': email,
                  "authorization": requestHeadersAuth,
                  "accept": accept,
                  "session": requestHeadersSession
                }

    // $.ajax({
    //   type: "GET",
    //   data: body,
    //   url: "https://baublebar-server.herokuapp.com/tickets",
    //   contentType: "application/json"
    // })

    var xhr = new XMLHttpRequest()
    xhr.open("GET", "https://baublebar-server.herokuapp.com/tickets");
    xhr.send(body)
  }
}

function currentVisitorRequest(api){

  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.salemove.com/visitor');

  window.requestHeadersAuth = salemoveApi.getRequestHeaders()['Authorization']
  window.requestHeadersSession = salemoveApi.getRequestHeaders()['X-Salemove-Visit-Session-Id']
  console.log(requestHeadersSession)
  console.log(requestHeadersAuth)
  
  request.setRequestHeader('Authorization',
                            requestHeadersAuth)
  request.setRequestHeader('Accept',
                            'application/vnd.salemove.v1+json');
  request.setRequestHeader('X-Salemove-Visit-Session-Id',
                            requestHeadersSession)

  request.onreadystatechange = function(){
    if (this.readyState === 4){

      var parsedResponse = JSON.parse(this.responseText);

      if(parsedResponse.email === null || "" || undefined){
        addListener();
      } else {
        window.email = parsedResponse.email
        sendToRubyApp()
      }
    }
  };
  request.send();
}