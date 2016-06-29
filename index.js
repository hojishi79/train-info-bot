"use strict";

var client = require("cheerio-httpcli");

console.log("start");


client.fetch("http://transit.yahoo.co.jp/traininfo/area/4/")
    .then(function(result) {
        var $ = result.$;
        var tr = result.$("#mdStatusTroubleLine .elmTblLstLine.trouble table tr");
        var detailUrls = [];
        tr.each(function() {
            var url = $(this).find("a").attr("href");
            if (url != null) {
                detailUrls.push(url);
            }
        });
        return detailUrls;
    })
    .then(function(detailUrls) {
        console.log(detailUrls);
    })
    .catch(function(err) {
        console.log(err);
    });
