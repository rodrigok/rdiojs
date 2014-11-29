var pkg = require('../package.json'),
	sh = require('shelljs'),
	request = require('request'),
	appNames = ['Rdio', 'Oi Rdio', 'Spotify', 'iTunes'],
	appName,
	track;

console.log(pkg.name, pkg.version);

appNames.every(function(name) {
	track = sh.exec('osascript -e \'tell app "' + name + '" to get the name of the current track\'', {silent: true});
	if (track.code === 0) {
		appName = name;
		return false;
	}
	return true;
});

if (appName === undefined) {
	console.log('Unable to find Rdio, Oi Rdio, Spotify or iTunes');
	process.exit(1);
}

console.log('');
console.log('(' + appName + ' encontrado)');
console.log('');
console.log('---');

track = track.output;
var artist = sh.exec('osascript -e \'tell app "' + appName + '" to get the artist of the current track\'', {silent: true}).output;

track = track.replace('\n', '');
artist = artist.replace('\n', '');

console.log('');
console.log(track + ',', artist);
console.log('');

request("http://www.vagalume.com.br/api/search.php" + "?art=" + artist + "&mus=" + track, function (err, response) {
	var data = JSON.parse(response.body);
	if(data.mus && data.mus.length > 0) {
		console.log(data.mus[0].text);
		if(data.mus[0].translate && data.mus[0].translate.length > 0) {
			console.log('');
			console.log('---');
			console.log('');
			console.log(data.mus[0].translate[0].text);
		}
	}
});