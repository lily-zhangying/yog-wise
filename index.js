var macpack = require('mcpack');
var nshead = require('nshead');
var provider = 'Mildx';
var getInstance = require('./lib/socket.js').getInstance;
var log;
// var url = '';


// http.createServer(function(req, res){
    
//     // console.log(req);
//     //把req组装发到
    
//     var socket = getInstance();
//     socket.get("", "", "")
//     .then(function(data){
//         console.log(data);
//     })
//     .fail(function(err){
//         console.log(err);
//     });



// }).listen(8878);

module.exports = function(server, provider){
    console.log(server);
    console.log(provider);

    return function(req, res, next){
        var socket = getInstance();
        socket.get("", "", "")
        .then(function(data){
            console.log(data);
            res.wise = data;
        }) 
        .fail(function(err){
            console.log(err);
        })
        .done(function(){
            console.log('done');
            next();
        });
    }
}


