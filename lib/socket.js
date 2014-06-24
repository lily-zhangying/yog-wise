/***************************************************************************
 *
 * Copyright (C) 2014 Baidu.com, Inc. All Rights Reserved
 *
 ***************************************************************************/

/**
 * @file Engine.js ~ 2014-05-20 11:16
 * @author sekiyika (px.pengxing@gmail.com)
 * @description
 *  建立socket连接，获取数据
 */


var mcpack = require('mcpack');
var nshead = require('nshead');
var Deferred = require('underscore.deferred').Deferred;
var net = require('net');

// var Conf = require('./Conf');
// var Log = require('./Log');
// var Util = require('./Util');


var NSHEAD_LEN = 36;

function Socket() {
}

Socket.prototype.get = function(server, method, params) {
    var me = this;

    var dfd = new Deferred();
    var server = this._getServer(server, method);

    if(!server) {
        console.log('getServer failed', -1);
        dfd.reject(false);
    }

    var str2Send = this._serialize(params);
    if(str2Send === false) {
        console.log('pack input failed', -1);
        dfd.reject(false);
    }


    var soc = new net.Socket();
    var bodyBuffer = new Buffer(0);

    soc.on('close', function() {
        if(bodyBuffer.length < NSHEAD_LEN) {
            dfd.reject(false);
            return;
        }

        var nh = bodyBuffer.slice(0, NSHEAD_LEN);
        var bodyLen = nh.body_len;

        var mp = bodyBuffer.slice(NSHEAD_LEN);
        mp = mcpack.decode(mp);
        if(!mp) {
            dfd.reject(false);
        } else {
            dfd.resolve(mp);
        }
        
    });

    soc.on('data', function(stream) {
        bodyBuffer = Buffer.concat([bodyBuffer, stream]);
    });

    soc.on('timeout', function() {
        console.log('timeout ' + server.ip + ':' + server.port);
        dfd.reject(false);
    });

    soc.on('error', function(err) {
        console.log(err.toString());
        dfd.reject(false);
    });
    soc.on('end', function() {
        soc.end();
    });

    soc.connect(server.port, server.ip);
    soc.write(str2Send);

    return dfd;
};

Socket.prototype._getServer = function(server, method) {
    // var serverConf = Conf.getConf('server');

    // TODO 识别IDC
    // var curIDC;
    // if(serverConf && serverConf.cur_idc) {
    //     curIDC = serverConf.cur_idc;
    // } else {
    //     console.log('cur_idc not exists', -1);
    //     return false;
    // }

    // if(serverConf[server]) {
    //     var port = serverConf[server].service_port;
    //     var timeout_c = serverConf[server].service_ctimeout;
    //     var timeout_r = serverConf[server].service_rtimeout;
    //     var timeout_w = serverConf[server].service_wtimeout;
    // }

    // var ip_cnt = serverConf[server][curIDC].length;
    // var ip_idx = Math.floor(Math.random() * 100 + 1) % ip_cnt;
    // var ip = serverConf[server][curIDC][ip_idx]['ip'];

    var result = {
        ip: "10.40.21.41",
        port: "9920"
        // timeout_c: timeout_c,
        // timeout_w: timeout_w,
        // timeout_r: timeout_r
    };

    // var value;
    // for(var key in result) {
    //     value = result[key];
    //     if(!value) {
    //         console.log(key + ' not exists', -1);
    //         return false;
    //     }
    // }

    return result;
};

Socket.prototype._serialize = function(input) {
    var mp = mcpack.encode(input);
    var nh = this._packNshead(mp.length);

    return Buffer.concat([nh, mp]);
};

Socket.prototype._deserialize = function(output) {
    return mcpack.decode(output);
};

Socket.prototype._packNshead = function(bodyLen) {
    // var logId = Util.getLogId();

    var data = {
        'id': 0,
        'version': 1,
        // 'log_id': logId,
        'magic_num': 0xfb709394,
        'reserved': 0,
        'provider': 'Mildx',
        'body_len': bodyLen
    };

    return nshead.pack(data);
};

Socket.prototype._unpackNshead = function(strNshead) {
    return nshead.unpack(strNshead);
};


function getInstance() {
    return new Socket();
}


module.exports = {
    getInstance: getInstance
};