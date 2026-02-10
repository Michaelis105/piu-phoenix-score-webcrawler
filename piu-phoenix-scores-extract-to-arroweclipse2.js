// Click "Copy Object"
async function getScore() {
    var csvString = "Song,Difficulty,Score,LetterGrade,Plate\r\n";
    var pageIndex=1;
    while(true) {
        var nextPageString = await $.get("https://piugame.com/my_page/my_best_score.php??lv=15&&page="+pageIndex)
        var page=$(nextPageString);
        var foundScores=$("ul.my_best_scoreList>li>div.in",page);
        foundScores.each(function(){
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
            var row = '"'+songName+'",'+chartType+difficultyLevel+","+score+","+letter+","+plate+"\n";
            console.log(row)
            csvString+=row
        });
        pageIndex++;
        console.log("Page "+pageIndex);
        if($(".xi.last",page).length==0){
            break;
        }
    }
    console.log(csvString);
}

getScore()