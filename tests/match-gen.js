'use strict';

var _ = require('underscore'),
    Promise = require('promise'),
    blur = require('ndarray-gaussian-filter'),
    pool = require('ndarray-scratch'),
    ndarray = require('ndarray');

var shortcut = require('../src/utils/shortcuts.js'),
    demoloader = require('../src/utils/demo-loader.js'),
    cometdemo = demoloader.cometdemo,
    halldemo = demoloader.halldemo,
    cityhalldemo = demoloader.cityhalldemo,
    testUtils = require('../src/utils/test-utils.js'),
    estF = require('../src/webregister/estimate-fmatrix.js'),
    sift = require('../src/websift/websift.js'),
    match = require('../src/webmatcher/matcher.js');


/**
 *
 * @param {DemoLoader} demo
 * @param i1
 * @param i2
 */
function matchpair(demo, i1, i2){

    if (i1 >= i2) { throw 'index error'; }

    var matchpath = demo.dirroot + '/dev/' + i1 + 'to' + i2 + '.json';

    Promise.all([
        demo.promiseVectorBuffer(i1),
        demo.promiseVectorBuffer(i2)
    ]).then(function(results){
        var vs1 = results[0],
            vs2 = results[1];
        var matches = match.match(vs1, vs2);
        return testUtils.promiseSaveJson(matchpath, matches);
    });

}

var pairs = [
    [0,1],
    [1,2],
    [2,3],
    [3,4],
    [4,5],
    [5,6],

    [4,6],
    [3,6],
    [2,6],

    [3,5],
    [2,5],
    [1,5]
];

var hallpairs = _.range(10, halldemo.images.length-1).map(function(base){
    return [base, base+1];
});


var cometpairs = [

    [2,10],
    [3, 10],

    [6,8],

    [7, 21],
    [7, 13],
    [7, 25],

    [10, 20],
    [10, 21],

    [15, 23],
    [15, 16],

    [25, 26]

];

var cgroups = [

    [4, 7, 13, 24, 25],

    [0, 6, 8]

];

var group1 = [4, 7, 13, 15, 16, 17, 18, 24, 15];

shortcut.iterPairs(group1, function(from, to){
    matchpair(cometdemo, from, to);
});


/*
var table = [];

pairs.forEach(function(pair){
 var i1 = pair[0], i2 = pair[1];
    var matchpath = cityhalldemo.dirroot + '/dev/' + i1 + 'to' + i2 + '.json';
    table.push({
        from: i1, to: i2,
        matches: require(matchpath)
    });
});
*/
//cityhalldemo.promiseSaveRawMatchTable(table);


function genRobust(demo){
    var robust = [];

    demo.promiseFullPointTable()
        .then(function(ptable){
            demo.loadRawMatches()
                .forEach(function(entry){
                    console.log(entry.from + ' to ' +entry.to + ' has ' + entry.matches.length);
                    var i1 = entry.from, i2 = entry.to;
                    var points1 = ptable[i1];
                    var points2 = ptable[i2];
                    try {
                        var rob = estF(entry.matches, {
                            cam1: demo.sDict[i1],
                            cam2: demo.sDict[i2],
                            features1: points1,
                            features2: points2
                        });
                        robust.push({
                            from: i1, to: i2,
                            matches: rob.dataset,
                            F: rob.F.elements
                        });
                        //testUtils.visMatches(visbase+i1+'to'+i2+'.png', demo.getImagePath(i1), demo.getImagePath(i2), points1, points2, rob.dataset);
                    }
                    catch (e) { console.log('failed'); }
                });
            testUtils.promiseSaveJson('/home/sheep/Code/Project/web-sfm/demo/Leuven-City-Hall-Demo/matches/matches.robust.json', robust);
        });

}

//genRobust(halldemo);
/*
hallpairs.forEach(function(pair){
 matchpair(halldemo, pair[0], pair[1]);
});
    */