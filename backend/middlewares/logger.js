const morgan = require('morgan');
var rfs = require('rotating-file-stream');
const path = require("path");

let date = new Date()
let logFile = `access${date.toISOString().split('T')[0]}.log`;

const accessLogStream  = rfs.createStream((logFile),{
interval: '1d', // rotate daily
path: path.join(__dirname, '../logs')
});

morgan.token('userId', function (req, res) { return JSON.stringify(req.userId||"visitor") })
const logger =  morgan(':userId [:date[clf]] :method :url :status :response-time ":user-agent"',{stream:accessLogStream});

module.exports = logger