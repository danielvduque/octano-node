exports.port = process.env.APP_PORT || 3002;
exports.env = process.env.ENV || 'dev';
exports.database = 'mongodb://localhost:27017/game';
exports.secret = process.env.SECRET || 'G4m3!,.fPZjoL7zGd6ec3YV-s3Mvu76Tg$JrZiXpVGkw2617WNFfPZjoLVe$@nt1';
exports.appVersion = process.env.APP_VERSION || 1;
exports.apiPath = '/api';
exports.saltRounds = 10;
exports.CONSTANTS = {
    timezone: 'America/Santiago',
    moves: [
        {type:'rock', kills:'scissor'},
        {type:'paper', kills:'rock'},
        {type:'scissor', kills:'paper'}
    ]
};
