var winston = require('winston');
var env = process.env.NODE_ENV;

function getLogger(module){
  var endPath = module.filename.split('\\').slice(-2);
  var path = endPath.join('\\');
  var moduleName = endPath.join('_');

  return new winston.Logger({
    transports:[
    new winston.transports.Console({
      colorize: true,
      level: env == 'development' ? 'debug' : 'error',
      label: path
    }),
    new winston.transports.File({
      level: env == 'development' ? 'debug' : 'error',
      filename: '..\\logs\\'+moduleName+'.log'
    })
    ]
  });
}

module.exports = getLogger;
