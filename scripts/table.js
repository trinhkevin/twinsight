// Gets URL Query Variables
function getParameterByName(name, url) {
    if(!url) 
      url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if(!results) 
      return null;
    if(!results[2]) 
      return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var xhr = new XMLHttpRequest();
  

xhr.open("POST", "http://dsg1.crc.nd.edu:8000", true);

xhr.onreadystatechange = function() {
  if(xhr.readyState == 4 && xhr.status == 200) {
    var res = xhr.responseText;
    console.log(res)
  }
}

xhr.onerror = function(e) {
  console.log(e);
  console.error(xhr.statusText);
}

game = getParameterByName('game');

var data = {}

if(game == 'miami')
  data['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.userid = users2.userid;'
else if(game == 'navy')
  xhr.send(null);
else if(game == 'stanford')
  xhr.send(null);

xhr.send(JSON.stringify(data))
