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

// Creates table
function initTable(type) {

  // type 0 random
  // type 1 highest
  // type -1 lowest

  $('#table').bootstrapTable('showLoading');

  // Clear table
  $('#table').bootstrapTable('removeAll');

  var xhr = new XMLHttpRequest();

  xhr.open("POST", "http://dsg1.crc.nd.edu:8000", true);

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);
      for(var i = 0; i < data.length; ++i) {
        // res[i][0] tweet
        // res[i][1] name
        // res[i][2] sentiment
        // res[i][3] location

        // String conversion
        if(data[i][0] != null)
          data[i][0] = removeTags(data[i][0].toString());
        if(data[i][1] != null)
          data[i][1] = removeTags(data[i][1].toString());
        if(data[i][2] != null)
          data[i][2] = removeTags(data[i][2].toString());
        if(data[i][3] != null)
          data[i][3] = removeTags(data[i][3].toString());

        // Insert into table
        $('#table').bootstrapTable('insertRow', {
          index: 0,
          row: {
            tweet: data[i][0],
            name: data[i][1],
            sentiment: data[i][2],
            location: data[i][3]
          }
        });
      }
    }

    $('#table').bootstrapTable('hideLoading');
  }

  xhr.onerror = function(e) {
    console.log(e);
    console.error(xhr.statusText);
  }

  // Get game option
  game = getParameterByName('game');

  var req = {}

  setImage(game);

  // Change POST request based on game
  if(game == 'miami') {
    if(type == 0)
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-11 00:05:00" AND tweets2.timestamp <= "2017-11-12 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY RAND() limit 100;'
    else if(type == -1)
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-11 00:05:00" AND tweets2.timestamp <= "2017-11-12 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY tweets2.sentiment ASC limit 100;'
    else
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-11 00:05:00" AND tweets2.timestamp <= "2017-11-12 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY tweets2.sentiment DESC limit 100;'
  }
  else if(game == 'navy') {
    if(type == 0)
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-18 00:05:00" AND tweets2.timestamp <= "2017-11-19 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY RAND() limit 100;'
    else if(type == -1)
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-18 00:05:00" AND tweets2.timestamp <= "2017-11-19 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY tweets2.sentiment ASC limit 100;'
    else
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-18 00:05:00" AND tweets2.timestamp <= "2017-11-19 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY tweets2.sentiment DESC limit 100;'
  }
  else if(game == 'stanford') {
    if(type == 0)
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-25 00:05:00" AND tweets2.timestamp <= "2017-11-26 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY RAND() limit 100;'
    else if(type == -1)
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-25 00:05:00" AND tweets2.timestamp <= "2017-11-26 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY tweets2.sentiment ASC limit 100;'
    else
      req['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-25 00:05:00" AND tweets2.timestamp <= "2017-11-26 04:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY tweets2.sentiment DESC limit 100;'
  }

  // Send request
  xhr.send(JSON.stringify(req));
}

$(function() {
  initTable(0);
  $('[data-toggle="tooltip"]').tooltip();
});
