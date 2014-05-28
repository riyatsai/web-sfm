'use strict';


if (typeof SFM === 'undefined') {
    var SFM = {};
}


/*
self.onmessage = function(e) {
    console.log(e.data);
    self.postMessage('done');
};
*/

SFM.STEREO_WORKER = '/build/scripts/stereoworker.js';
SFM.SIFT_WORKER = '/build/scripts/siftworker.js';
SFM.MATCHING_WORKER = '/build/scripts/matchingworker.js';
SFM.WORKER = '/build/scripts/worker.js';

SFM.MSG_QUERY = 0;
SFM.MSG_CONTROLL = 1;

SFM.CONTROLL_START = 0;
SFM.CONTROLL_STOP = 1;

SFM.STAGE_BEFORE = 0;
SFM.STAGE_EXTRACTOR = 1;
SFM.STAGE_MATCHING = 2;
SFM.STAGE_TRACKING = 3;
SFM.STAGE_REGISTER = 4;
SFM.STAGE_STEREO = 5;
SFM.STAGE_MVS = 6;
SFM.STAGE_AFTER = 7;

SFM.STATE_RUNNING = 0;
SFM.STATE_STOPPED = 1;
SFM.STATE_DONE = 2;

SFM.TASK_SIFT = 0;
SFM.TASK_MATCHING = 1;
SFM.TASK_STEREO = 2;
SFM.TASK_TRACKING = 3;

SFM.PROJECT_TYPE_TEST = 0;
SFM.PROJECT_TYPE_DEMO = 1;
SFM.PROJECT_TYPE_NORMAL = 2;

SFM.RGB2GRAY_R = 0.2989;
SFM.RGB2GRAY_G = 0.5870;
SFM.RGB2GRAY_B = 0.1140;
