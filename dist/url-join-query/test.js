var urlJoinQuery = require('./index');
var url1 = "http://google.com?a=1&b=2&c=3#hash";
var url2 = "http://google.com";
var url3 = "http://baidu.com/node/?"
var r1 = urlJoinQuery(url1,"d=4&e=5");
console.log(r1);//http://google.com/?a=1&b=2&c=3&d=4&e=5#hash


var r2 =urlJoinQuery(url1,{d:4,e:5,f:[6,7,8]});
console.log(r2);//http://google.com/?a=1&b=2&c=3&d=4&e=5&f=6&f=7&f=8#hash


var r3 = urlJoinQuery(url2,"d=4&e=5");
console.log(r3);//http://google.com/?d=4&e=5


var r4 =urlJoinQuery(url2,{d:4,e:5,f:[6,7,8]});
console.log(r4);//http://google.com/?d=4&e=5&f=6&f=7&f=8


var r5 = urlJoinQuery(url3,{
    xx3:3
},"#xx=22")
console.log('r5',r5);