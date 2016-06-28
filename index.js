var client = require("cheerio-httpcli");

console.log("start");

client.fetch("http://transit.yahoo.co.jp/traininfo/area/4/")
    .then(function(result) {
        var $ = result.$;
        var tr = result.$("#mdStatusTroubleLine .elmTblLstLine.trouble table tr");
        tr.each(function() {
            var url = $(this).find("a").attr("href");
            if (url != null) {
                console.log(url);
            }
        })
    })
    .catch(function(err) {
        console.log(err);
    });
