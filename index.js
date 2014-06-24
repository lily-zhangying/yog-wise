var macpack = require('mcpack');
var nshead = require('nshead');
var wise = 'http://tc-wise-adaptdb00.tc.baidu.com:7777';
var provider = 'Mildx';
var request = require('request');
var http = require('http');
var getInstance = require('./lib/socket.js').getInstance;
// var url = '';


http.createServer(function(req, res){
    
    // console.log(req);
    //把req组装发到
    
    var socket = getInstance();
    socket.get("", "", "")
    .then(function(data){
        console.log(data);
    })
    .fail(function(err){
        console.log(err);
    });



}).listen(8878);
