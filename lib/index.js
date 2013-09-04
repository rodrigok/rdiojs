var sh = require('shelljs');
var request = require('request');

var track = sh.exec('osascript -e \'tell app "Oi Rdio" to get the name of the current track\'', {silent: true}).output;
var artist = sh.exec('osascript -e \'tell app "Oi Rdio" to get the artist of the current track\'', {silent: true}).output;

track = track.replace('\n', '');
artist = artist.replace('\n', '');

console.log('');
console.log(track + ',', artist);
console.log('');

request("http://www.vagalume.com.br/api/search.php" + "?art=" + artist + "&mus=" + track, function (err, response) {
	var data = JSON.parse(response.body);
	if(data.mus && data.mus.length > 0) {
		console.log(data.mus[0].text)
		if(data.mus[0].translate && data.mus[0].translate.length > 0) {
			console.log('')
			console.log('---')
			console.log('')
			console.log(data.mus[0].translate[0].text)
		}
	}
});