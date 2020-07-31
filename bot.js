//TODO: add a tweet one a certain follower threshold has been reached

const Twit = require('twit');
const express = require('express');
const app = express();
const fs = require('fs-extra');

const config = require('./config');

var T = new Twit(config);

const PORT = 5050;

const oneDayinMilliSeconds = 86400000;



function currentChristmasYear(){
    //if date is > dec 25 return next year. if date is > jan 1 and < less than dec 26

    var currentDate = new Date();

    if(currentDate.getMonth()!=11||(currentDate.getMonth()==11 && currentDate.getDate()<25)){
        return currentDate.getFullYear();
    }
    else{
        return currentDate.getFullYear()+1;
    }
}

function newTweet(){

    var daysLeft;


    var christmasDay = new Date(currentChristmasYear(), 11, 25);

    var currentDate = new Date();

    var remainingTime = christmasDay.getTime() - currentDate.getTime();


    var remainingDays = (remainingTime/oneDayinMilliSeconds).toFixed(0);


    function dayMonthYearEqual(dateOne, dateTwo){
        return (dateOne.getDate() == dateTwo.getDate() && dateOne.getMonth() == dateTwo.getMonth() && dateOne.getFullYear() == dateTwo.getFullYear());
    }


    daysLeft = remainingDays;

    var daysUntilEndofYear = parseInt(daysLeft) +6;


    var possibleMessages = [`${daysLeft} days left until Christmas!`,`${daysLeft} days until Christmas and ${daysUntilEndofYear} days until the end of ${currentChristmasYear()}! `];




    T.get('users/show/screen_name', { screen_name: 'xmascounter25'}, (err, data, response) => {
        if(err){
            console.log(new Date().toTimeString());
            console.log(err);
        }
        else{
            // console.log(data.status.created_at);

            var lastTweetDate = new Date(data.status.created_at);
            // console.log(lastTweetDate.getFullYear());

            if(dayMonthYearEqual(lastTweetDate, currentDate)){

            }else{

                var random = (Math.random()*10).toFixed(0);


                var tweetMessage;
                if(currentDate.getMonth()!=11||currentDate.getDate()<25||currentDate.getDate()>25){
                    if(random == 5 ){
                        tweetMessage = possibleMessages[1];
                    }else{
                        tweetMessage = possibleMessages[0];
                    } 
                    
                    var tweet = {
                        status : tweetMessage
                    }
                    T.post('statuses/update', tweet, tweeted);
        
                }else{
                    tweetMessage = 'Today is Christmas! Merry Christmas!';

                    var christmasImage = fs.readFileSync('./christmasImage.jpg', {encoding: 'base64'});
                    T.post('media/upload', {media_data: christmasImage}, (err, data, response) => {
                        var imageId = data.media_id_string;
                        var altText = `Merry Christmas ${currentChristmasYear}!`;
                        var meta_params = {media_id: imageId, alt_text: { text: altText}};
                        
                        T.post('media/metadata/create', meta_params, (err, data, response) => {
                            if(!err) {
                                var params = {status: tweetMessage, media_ids:[imageId]};

                                T.post('statuses/update', params, (err, data, repsonse) =>{
                                });
                            }
                        });
                    });
                    
                }


                console.log('About to tweet: ' + tweetMessage);


            
                function tweeted(err, data, response){
                    if(err){
                            console.log(new Date().toTimeString());
                            console.log(err);
                    }else{
                    // console.log(data);
                    T.get('users/show/screen_name', {screen_name: 'xmascounter25'}, (err,data, response)=> {
                        if(err){
                            console.log(new Date().toTimeString());
                            console.log(err);
                        }else{
                            var lastTweetMessage = data.status.text;
                            console.log('Last tweet: ' + lastTweetMessage);
                        }
                    });
                    }
                }            
            }
        }
    });




}







app.listen(PORT, () =>{
    var botRunningDate = new Date().toTimeString();
    console.log(`Twitter bot is running at http://localhost:${PORT} at ${botRunningDate}`);
    newTweet(); 

    setInterval(newTweet, 3600000);


});