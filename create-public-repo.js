#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var yargs = require("yargs");
var child_process_1 = require("child_process");
var MESSAGES = require("./messages");
var argv = yargs
    .alias('o', 'origin')
    .alias('d', 'destination')
    .alias('e', 'exclude')
    .demandOption(['o', 'd', 'e'])
    .argv;
var folderOrigin = argv.origin.split('/')[argv.origin.split('/').length - 1];
console.log(MESSAGES.copyingTo(argv.destination));
var rsync = child_process_1.spawn('rsync', [
    '--progress',
    '-a',
    "--exclude-from=" + argv.exclude,
    "" + argv.origin,
    './temp-copy-repo'
]);
rsync.on('error', function (err) {
    console.log(err);
});
rsync.stdout.on('data', function (data) {
    console.log(data.toString());
});
rsync.stderr.on('data', function (data) {
    console.log("rsync stderr: " + data);
});
var mv;
rsync.on('close', function (code) {
    if (code !== 0) {
        console.log("ps process exited with code " + code);
    }
    console.log('moving files to right folder name');
    mv = child_process_1.spawn('mv', ["./temp-copy-repo/" + folderOrigin, "" + argv.destination]);
    mv.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    mv.stderr.on('data', function (data) {
        console.log("mv stderr: " + data);
    });
    mv.on('close', function (code) {
        console.log('removing temporary files');
        var rm = child_process_1.spawn('rm', ['-rf', './temp-copy-repo']);
        rm.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        rm.stderr.on('data', function (data) {
            console.log("rm stderr: " + data);
        });
    });
});
