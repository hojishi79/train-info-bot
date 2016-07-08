"use strict";

var client = require("cheerio-httpcli");
var rp = require("request-promise");

var statusColorMap = {
    "平常運転": "#2BED1A",
    "列車遅延": "#FFA630",
    "運転見合わせ": "#E30000",
    "交通障害情報": "#FFCF59",
    "その他": "#C224E0"
};

exports.handler = function(event, context) {
    client.fetch("http://transit.yahoo.co.jp/traininfo/area/4/")
        .then(function(result) {
            var $ = result.$;
            var tr = $("#mdStatusTroubleLine .elmTblLstLine.trouble table tr");
            var details = [];
            tr.each(function() {
                var url = $(this).find("a").attr("href");
                if (url != null) {
                    details.push(client.fetch(url));
                }
            });
            return Promise.all(details);
        })
        .then(function(results) {
            var trainInfos = [];
            results.forEach(function(result) {
                var $ = result.$;
                var trainInfo = {
                    url: $("link[rel='canonical']").attr("href"),
                    line: $("h1.title").text(),
                    update: $("h1+span.subText").text(),
                    status: $("#mdServiceStatus dt").text().slice(4),
                    body: $("#mdServiceStatus dd p").text()
                }
                trainInfos.push(trainInfo);
            });

            var attachments = [];
            trainInfos.forEach(function(info) {
                var attachment = {
                    "fallback": "<" + info.url + "|" + info.line + " [" + info.status + "]>",
                    "title": info.line,
                    "title_link": info.url,
                    "color": statusColorMap[info.status] == null ? "#9626F5" : statusColorMap[info.status],
                    "fields": [{
                        "title": info.status,
                        "value": info.body,
                        "short": false
                    }]
                }
                attachments.push(attachment);
            });

            var option = {
                method: "POST",
                uri: "https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/ZZZZZZZZZZZZZZZZZZZZZZZZ",
                body: {
                    "username": "train-info-bot",
                    "icon_emoji": ":train:",
                    "text": "列車情報をお届けするぜーぃ！",
                    "attachments": attachments
                },
                json: true
            };
            return rp(option);
        })
        .then(function(res) {
            context.succeed(res);
        })
        .catch(function(err) {
            context.fail(err);
        });
};
