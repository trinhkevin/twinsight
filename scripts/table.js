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

// Text Sanitizer
var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}

$(document).ready(function() {

  // Edit Localizations of BootStrap Table
  $('#table').bootstrapTable({
    formatNoMatches: function() { 
      return "Fetching tweets, please wait...";
    },
    formatSearch: function() {
      return "Search tweets";
    }
  });

  // POST Request
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
        if(data[i][0] != null) {
          data[i][0] = removeTags(data[i][0].toString());
        }
        if(data[i][1] != null) {
          data[i][1] = removeTags(data[i][1].toString());
        }
        if(data[i][2] != null) {
          data[i][2] = removeTags(data[i][2].toString());
        }
        if(data[i][3] != null) {
          data[i][3] = removeTags(data[i][3].toString());
        }

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

    console.log('Table loaded.')
  }

  xhr.onerror = function(e) {
    console.log(e);
    console.error(xhr.statusText);
  }

  // Get Game
  game = getParameterByName('game');

  var data = {}

  if(game == 'miami')
    data['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-10 00:00:00" AND tweets2.timestamp <= "2017-11-12 23:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY RAND() limit 100;'
  else if(game == 'navy')
    data['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-17 00:00:00" AND tweets2.timestamp <= "2017-11-19 23:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY RAND() limit 100;'
  else if(game == 'stanford')
    data['query'] = 'SELECT tweets2.text, users2.name, tweets2.sentiment, users2.location FROM tweets2, users2 WHERE tweets2.timestamp >= "2017-11-24 00:00:00" AND tweets2.timestamp <= "2017-11-26 23:59:59" AND tweets2.userid = users2.userid AND tweets2.sentiment IS NOT NULL ORDER BY RAND() limit 100;'

  // Send Reqest
  xhr.send(JSON.stringify(data));

});
