module.exports.stringToBase64 = (data) => Buffer.from (data).toString('base64');
module.exports.baseToString64 = (data) => Buffer.from (data,'base64').toString ('ascii'); 