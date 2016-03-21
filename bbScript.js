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
  $(document.body).on('change','.sm-user-email',function(){
    window.email = $('.sm-user-email').val();
    sendToRubyApp();
  });
}

function sendToRubyApp(){
  if (email !== "" || null || undefined){
    var accept = 'application/vnd.salemove.v1+json'
    var body =  {
                  'email': email,
                  "Authorization": requestHeadersAuth,
                  "Accept": accept,
                  "Session": requestHeadersSession
                }

    $.ajax({
      type: "GET",
      data: body,
      url: "http://localhost:3000/tickets",
      contentType: "application/json"
    })
  }
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