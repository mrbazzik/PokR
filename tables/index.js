var nconf = require('nconf');
var path = require('path');

nconf.argv().env().file('combs', {file: path.join(__dirname, 'combinations.json')});
nconf.file('chartTAG', {file: path.join(__dirname, 'chartTAG.json')});

module.exports = nconf;
