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

// Text sanitizer
function removeTags(html) {
  var tagBody       = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
  var tagOrComment  = new RegExp('<(?:!--(?:(?:-*[^->])*--+|-?)|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*|/?[a-z]' + tagBody + ')>', 'gi');
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}

// Set opposing team image / date
function setInfo(game) {

  // Change image based on game / set date
  if(game == 'miami') {
    $('#opposing-team').attr('src', 'images/miami.png');

    $('#date').text("November 11th, 2017");
  }
  else if(game == 'navy') {
    // Navy logo is sized weird so we had to change some css / date
    $('#opposing-team').attr('src', 'images/navy.png');
    $('#opposing-team').css('height', '8vh');
    $('#opposing-team').css('width', '8vh');
    $('#opposing-team').css('margin', '0');

    $('#date').text("November 18th, 2017");
  } 
  else if(game == 'stanford') {
    $('#opposing-team').attr('src', 'images/stanford.png');

    $('#date').text("November 25th, 2017");
  }
}

// Fetches dataset
function initDataset(game) {
  var xhr = new XMLHttpRequest();

  xhr.open("POST", "http://dsg1.crc.nd.edu:8000", true);

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText);
      
      // Enable run button once data is loaded
      $('#status button').prop('disabled', false);
    }
  }

  xhr.onerror = function(e) {
    console.log(e);
    console.error(xhr.statusText);
  }

  var req = {}

  // Change POST request based on game
  if(game == 'miami')
    req['query'] = 'SELECT DATE_FORMAT(tweets2.timestamp, "%H:%i:%s") as time, users2.latitude, users2.longitude, tweets2.sentiment, tweets2.text FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-11 00:00:00" AND tweets2.timestamp <= "2017-11-11 23:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL AND users2.latitude IS NOT NULL AND users2.longitude IS NOT NULL AND tweets2.timestamp IS NOT NULL ORDER BY time ASC;'
  else if(game == 'navy')
    req['query'] = 'SELECT DATE_FORMAT(tweets2.timestamp, "%H:%i:%s") as time, users2.latitude, users2.longitude, tweets2.sentiment, tweets2.text FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-18 00:00:00" AND tweets2.timestamp <= "2017-11-18 23:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL AND users2.latitude IS NOT NULL AND users2.longitude IS NOT NULL AND tweets2.timestamp IS NOT NULL ORDER BY time ASC;'
  else if(game == 'stanford')
    req['query'] = 'SELECT DATE_FORMAT(tweets2.timestamp, "%H:%i:%s") as time, users2.latitude, users2.longitude, tweets2.sentiment, tweets2.text FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-25 00:00:00" AND tweets2.timestamp <= "2017-11-25 23:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL AND users2.latitude IS NOT NULL AND users2.longitude IS NOT NULL AND tweets2.timestamp IS NOT NULL ORDER BY time ASC;'

  // Send request
  xhr.send(JSON.stringify(req));
}

// Initialize empty heatmap
function initHeatmap() {

  // Data points (array of [Latitude, Longitude] objects)
  var heatmapData = [];

  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(0, 0),
    zoom: 2,
    mapTypeId: 'roadmap'
  });

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData
  });

  heatmap.setMap(map);
}

// Sleep function for animated heatmap
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Converts 24 hour time to 12 hour
function convertTo12Hour(date) {
  var hours = date.split(":")[0];
  var minutes = date.split(":")[1];
  var seconds = date.split(":")[2];

  if(hours <= 12) {
    var period = " AM";
  }
  else {
    var period = " PM";
  }

  hours = ((hours + 11) % 12 + 1);

  return hours + ":" + minutes + ":" + seconds + period;
}

// Runs animated heatmap
async function runHeatmap() {

  // Data points (array of [Latitude, Longitude] objects)
  var heatmapData = []; 


  for(var i = 0; i < data.length; ++i) {

    // data[i][0] timestamp
    // data[i][1] latitude
    // data[i][2] longitude
    // data[i][3] sentiment
    // data[i][4] tweet text

    // Hide the alerts
    $('.alert-danger').hide()
    $('.alert-success').hide()

    // Set time
    $('#time span').text(convertTo12Hour(data[i][0]));

    heatmapData.push(new google.maps.LatLng(data[i][1], data[i][2]));

    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData
    });

    heatmap.setMap(map);

    // Alert with tweet text / show
    if(data[i][3] < 0) {
      console.log(data[i][3]);
      $('.alert-danger').text(removeTags(data[i][4]));
      $('.alert-danger').show();
    }
    else if(data[i][3] > 0) {
      console.log(data[i][3]);
      $('.alert-success').text(removeTags(data[i][4]));
      $('.alert-success').show();
    }

    await sleep($('#status select').val() * 10);
  }
}

// Data is global
var data;

$(function() {

  // Get game option
  game = getParameterByName('game');
  
  setInfo(game);

  initDataset(game);

  initHeatmap();
});
