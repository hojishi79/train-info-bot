"use strict";

var client = require("cheerio-httpcli");

console.log("start");


client.fetch("http://transit.yahoo.co.jp/traininfo/area/4/")
    .then(function(result) {
        var $ = result.$;
        var tr = $("#mdStatusTroubleLine .elmTblLstLine.trouble table tr");
        var details = [];
        //details.push(client.fetch("http://transit.yahoo.co.jp/traininfo/detail/40/0/"));
        tr.each(function() {
            var url = $(this).find("a").attr("href");
            if (url != null) {
                details.push(client.fetch(url));
            }
        });
        return Promise.all(details);
    })
    .then(function(results) {
        results.forEach(function(result) {
            var $ = result.$;
            var trainInfo = {
                url: $("link[rel='canonical']").attr("href"),
                line: $("h1.title").text(),
                update: $("h1+span.subText").text(),
                status: $("#mdServiceStatus dt").text().slice(4),
                body: $("#mdServiceStatus dd p").text()
            }
            console.log(trainInfo);
        });
    })
    .catch(function(err) {
        console.log(err);
    });
