// Gets URL query variables
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

// Set opposing team image / date
function setImage(game) {

  // Change image based on game / set date
  if(game == 'miami') {
    $('#opposing-team').attr('src', 'images/miami.png');

    $('#date').text("November 11th, 2017 8:00 PM");
  }
  else if(game == 'navy') {
    // Navy logo is sized weird so we had to change some css / date
    $('#opposing-team').attr('src', 'images/navy.png');
    $('#opposing-team').css('height', '8vh');
    $('#opposing-team').css('width', '8vh');
    $('#opposing-team').css('margin', '0');

    $('#date').text("November 18th, 2017 3:30 PM");
  } 
  else if(game == 'stanford') {
    $('#opposing-team').attr('src', 'images/stanford.png');

    $('#date').text("November 25th, 2017 8:00 PM");
  }
}

// Fetches dataset
function initDataset(game) {
  var xhr = new XMLHttpRequest();

  xhr.open("POST", "http://dsg1.crc.nd.edu:8000", true);

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText);
      drawGraph(data);
      console.log(data);
    }
  }

  xhr.onerror = function(e) {
    console.log(e);
    console.error(xhr.statusText);
  }

  var req = {}

  // Change POST request based on game / time
  if(game == 'miami') {
    req['query'] = 'SELECT UNIX_TIMESTAMP(tweets2.timestamp) * 1000 as time, AVG(tweets2.sentiment) AS avg_sent FROM tweets2 WHERE tweets2.timestamp >= "2017-11-11 00:00:00" AND tweets2.timestamp <= "2017-11-11 23:59:59" AND tweets2.sentiment IS NOT NULL AND tweets2.timestamp IS NOT NULL GROUP BY UNIX_TIMESTAMP(tweets2.timestamp) DIV 60 ORDER BY time ASC;'
  }
  else if(game == 'navy') {
    req['query'] = 'SELECT UNIX_TIMESTAMP(tweets2.timestamp) * 1000 as time, AVG(tweets2.sentiment) AS avg_sent FROM tweets2 WHERE tweets2.timestamp >= "2017-11-18 00:00:00" AND tweets2.timestamp <= "2017-11-18 23:59:59" AND tweets2.sentiment IS NOT NULL AND tweets2.timestamp IS NOT NULL GROUP BY UNIX_TIMESTAMP(tweets2.timestamp) DIV 60 ORDER BY time ASC;'
  }
  else if(game == 'stanford') {
    req['query'] = 'SELECT UNIX_TIMESTAMP(tweets2.timestamp) * 1000 as time, AVG(tweets2.sentiment) AS avg_sent FROM tweets2 WHERE tweets2.timestamp >= "2017-11-25 00:00:00" AND tweets2.timestamp <= "2017-11-25 23:59:59" AND tweets2.sentiment IS NOT NULL AND tweets2.timestamp IS NOT NULL GROUP BY UNIX_TIMESTAMP(tweets2.timestamp) DIV 60 ORDER BY time ASC;'
  }

  // Send request
  xhr.send(JSON.stringify(req));
}

// Graph plot
function drawGraph(data) {
  var options = {
    xaxis: {
      mode: "time",
      timezone: "browser",
      timeformat: "%I:%M:%S %P",
    }
  }

  var dataset = [
    {
      label: "Time vs. Sentiment",
      data: data,
      color: "#4CAF50"
    }
  ];
  $.plot("#graph", dataset, options);
}

$(function() {
  game = getParameterByName('game');
  setImage(game);
  initDataset(game);
});
