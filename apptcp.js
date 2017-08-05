var net = require('net');

var server = net.createServer(handleConnection);

var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'tcp-info',
            filename: 'tcp-info.log',
            level: 'info'
        })
    ]
});


//server.on('connection', handleConnection);



server.listen(9111, function () {
    console.log('server listening to %j', server.address());
});

function handleConnection(conn) {
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
    console.log('new client connection from %s', remoteAddress);

    console.log(conn.bytesRead);


    console.log(conn.allowHalfOpen);
//    console.log(conn);

    conn.setEncoding('utf8');
    //conn.setNoDelay(true);
    conn.setKeepAlive(true);
    
    //conn.pipe(conn);


    
   //conn.on('connect', onConnStart);
    conn.on('data', onConnData);
    conn.once('close', onConnClose);
    conn.on('error', onConnError);


    conn.on('connect', onConnStart);
     function onConnStart() {
        console.log('connection from start %s ', remoteAddress);

        logger.log('info', 'connection from start %s ', remoteAddress);
    }

    function onConnData(d) {
        console.log('connection data from %s: %j', remoteAddress, d);

        logger.log('info', 'connection data from %s: %j', remoteAddress, d);


//        conn.write("received");
    }

    function onConnClose() {
        console.log('connection from closed %s', remoteAddress);

        logger.log('info', 'connection from closed %s', remoteAddress);
        conn.destroy();
    }

    function onConnError(err) {
        console.log('Connection error: %s message: %s', remoteAddress, err.message);

        logger.log('info', 'Connection error: %s message: %s', remoteAddress, err.message);
    }
}