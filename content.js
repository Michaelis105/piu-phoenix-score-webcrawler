const piuGameScoreLink = "https://piugame.com/my_page/my_best_score.php";

async function getLastScorePage() {
    return parseInt($('.board_paging button', await $.get(piuGameScoreLink)).last().attr('onclick').match(/page=(\d+)/)[1]);
}

async function getScoresByPage(pageIndex) {
    var scorePage = await $.get(piuGameScoreLink + "??lv=15&&page="+pageIndex)
    var foundScores=$("ul.my_best_scoreList>li>div.in",scorePage);
    var scores = []
    foundScores.each(async function() {
        var songName = $('.song_name',this)[0].children[0].innerText.replaceAll('"','""').replaceAll('#','Num');
        if (songName.includes("Yoropiku Pikuyoro")) {
            // Character format breaks uploader.
            return true;
        }
        var chartType = $($('.stepBall_img_wrap .imG img',this)[0]).attr("src").substring(40,41);
        var difficultyLevel = $('.stepBall_img_wrap .imG img',this).map((index,i)=> $(i).attr("src").substring(46,47)).get().join("").replaceAll(".","");
        var scoreList = $(".etc_con>ul",this)[0];
        var letter = $(scoreList.children[1].children[0].children[0].children[0]).attr('src').substring(32).replace(".png","").replace("_p","+");
        var score = $(scoreList.children[0].children[0].children[0].children[0])[0].innerText.replaceAll(",","");
        var plate = $(scoreList.children[2].children[0].children[0].children[0]).attr("src").substring(32,34);
        scores.push({songName, chartType, difficultyLevel, score, letter, plate});
    });
    console.log("Done on page "+pageIndex);
    return scores;
}

async function formatScore(songName, chartType, difficultyLevel, score, letter, plate) {
    return '"'+songName+'",'+chartType+difficultyLevel+","+score+","+letter+","+plate;
}

async function downloadCSV(csvContent) {
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "scores.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function getAllScores() {
    const startTime = Date.now();
    console.log("Starting score retrieval at " + new Date().toLocaleTimeString());
    
    var lastPage = await getLastScorePage();
    console.log("Last page: "+lastPage);
    const scoreCrawlPromises = [];
    for (let pageIndex=1; pageIndex<=lastPage; pageIndex++) {
        scoreCrawlPromises.push(getScoresByPage(pageIndex));
    }
    var allScores = await Promise.all(scoreCrawlPromises);
    console.log("All scores retrieved, formatting...");
    var formattedScores = await Promise.all(allScores.flat().map(async (score) => await formatScore(score.songName, score.chartType, score.difficultyLevel, score.score, score.letter, score.plate)));
    formattedScores.unshift("Song,Difficulty,Score,LetterGrade,Plate");
    downloadCSV(formattedScores.join("\n"));
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log("Completed at " + new Date().toLocaleTimeString());
    console.log("Total time: " + duration.toFixed(2) + " seconds");
}

getAllScores();