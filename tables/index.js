var nconf = require('nconf');
var path = require('path');

nconf.argv().env().file('combs', {file: path.join(__dirname, 'combinations.json')});
nconf.file('pushes', {file: path.join(__dirname, 'PushFoldChart.json')});


module.exports = nconf;
