//TODO: add a tweet one a certain follower threshold has been reached

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


    function dayMonthYearEqual(dateOne, dateTwo){
        return (dateOne.getDate() == dateTwo.getDate() && dateOne.getMonth() == dateTwo.getMonth() && dateOne.getFullYear() == dateTwo.getFullYear());
    }


    daysLeft = remainingDays;



    var possibleMessages = [`${daysLeft} days left until Christmas!`];




    T.get('users/show/screen_name', { screen_name: 'xmascounter25'}, (err, data, response) => {
        if(err){
            console.log(err);
        }
        else{
            // console.log(data.status.created_at);

            var lastTweetDate = new Date(data.status.created_at);
            // console.log(lastTweetDate.getFullYear());

            if(dayMonthYearEqual(lastTweetDate, currentDate)){

            }else{
                //maybe add a 1/10 chance that the message also includes how many days until the end of 2020
                var tweet = {
                    status: possibleMessages[0]
                }

                var tweetMessage;
                if(currentDate.getMonth()!=11||currentDate.getDate()<25||currentDate.getDate()>25){
                    tweetMessage = tweet.status;
                }
                else{
                    tweetMessage = 'Today is Christmas! Merry Christmas!';
                }

                // if(dayMonthYearEqual(currentDate, christmasDay)){
                //     tweetMessage = 'Today is Christmas! Merry Christmas!';
                // }else{
                //     tweetMessage = tweet.status;
                // }

                // T.post('statuses/update', tweet, tweeted);
                console.log('About to tweet: ' + tweetMessage);


            
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




}




// newTweet();

app.listen(PORT, () =>{
    console.log(`Twitter bot is running at http://localhost:${PORT}`);
    newTweet();

    setInterval(newTweet, oneDayinMilliSeconds);


});