"use strict";

//YOUR DATA TO BE PASSED TO LAMBDA FUNCTION.
var event = {
};

//BUILD STAB OF context OBJECT.
var context = {
    succeed: function(message){
        console.info(message);
        return;
    },
    fail: function(message){
        console.info(message);
        return;
    }
};

//RUN YOUR HANDLER
var lambda = require("../train-info-bot");
lambda.handler(event, context);
