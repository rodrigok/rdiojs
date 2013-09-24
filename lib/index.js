var pkg = require('../package.json'),
	sh = require('shelljs'),
	request = require('request'),
	rdioNames = ['Rdio', 'Oi Rdio'],
	rdioName,
	track;

console.log(pkg.name, pkg.version);

rdioNames.every(function(name) {
	track = sh.exec('osascript -e \'tell app "' + name + '" to get the name of the current track\'', {silent: true});
	if (track.code === 0) {
		rdioName = name;
		return false
	}
	return true;
});

if (rdioName === undefined) {
	console.log('Unable to find Rdio or Oi Rdio');
	process.exit(1);
}

track = track.output;
var artist = sh.exec('osascript -e \'tell app "' + rdioName + '" to get the artist of the current track\'', {silent: true}).output;

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