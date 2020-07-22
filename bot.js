const Twit = require('twit');
const express = require('express');
const app = express();

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


    daysLeft = remainingDays;



    var possibleMessages = [`${daysLeft} days left until Christmas!`];

    // console.log(possibleMessages[0]);


    T.get('users/show/screen_name', { screen_name: 'xmascounter25'}, (err, data, response) => {
        if(err){
            console.log(err);
        }
        else{
            // console.log(data.status.created_at);

            var lastTweetDate = new Date(data.status.created_at);
            // console.log(lastTweetDate.getFullYear());
            if(lastTweetDate.getDate()==currentDate.getDate() && lastTweetDate.getMonth() == currentDate.getMonth() && lastTweetDate.getFullYear() == currentDate.getFullYear()){

            }else{
                var tweet = {
                    status: possibleMessages[0]
                }

                T.post('statuses/update', tweet, tweeted);
                console.log('About to tweet: ' + tweet.status);


            
                function tweeted(err, data, response){
                    if(err){
                        console.log(err);
                    }else{
                    // console.log(data);
                    T.get('users/show/screen_name', {screen_name: 'xmascounter25'}, (err,data, response)=> {
                        if(err){
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



    // check to see if tweet went through and print out the tweet




}




// newTweet();

app.listen(PORT, () =>{
    console.log(`Twitter Bot is running at http://localhost:${PORT}!`);
    newTweet();

    setInterval(newTweet, oneDayinMilliSeconds);


});