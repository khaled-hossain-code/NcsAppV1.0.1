
module.exports = function (){

  var dateObj = {};

  var date = new Date();
  var mnth = date.getMonth()+1;
  var dt = date.getDate();
  var yr = date.getFullYear();

  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var hour = date.getHours();

  //var ampm = hour >= 12 ? 'PM' : 'AM';
  //hour = hour % 12;
  //hour = hour ? hour : 12; // the hour '0' should be '12'
  hour = hour < 10 ? '0'+hour : hour;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  
  dt = dt < 10 ? '0'+dt : dt;
  mnth = mnth < 10 ? '0'+mnth : mnth;

  var formatted = dt + '.' + mnth + '.'+ yr + ' ' + hour + ':'+ minutes + ':'+ seconds;
  var formattedDate = dt + '.' + mnth + '.'+ yr;
  var formattedTime = hour + ':'+ minutes + ':'+ seconds;

  var DiffTime = function( StartTime, StopTime)
  {
    var start = StartTime.split(':'); // split it at the colons
    var stop = StopTime.split(':'); // split it at the colons

    var diffHour = (+stop[0]) - (+start[0]); //calculating the difference in hours
    var diffMinutes = (+stop[1]) - (+start[1]); //calculating the difference in minutes
    var diffSeconds = (+stop[2]) - (+start[2]); //calculating the difference in seconds

        if(diffMinutes < 0){  //ex startTime = 10:58:00 stopTime = 11:00:00 Diff= 01:-58:00
          diffMinutes += 60;  // Diff = 01:02
          diffHour -= 1;      // Diff = 00:02
        }

        if(diffSeconds < 0){
          diffSeconds += 60;
          diffMinutes -= 1;
        }

        diffHour = diffHour < 10 ? '0'+diffHour : diffHour;
        diffMinutes = diffMinutes < 10 ? '0'+diffMinutes : diffMinutes;
        diffSeconds = diffSeconds < 10 ? '0'+diffSeconds : diffSeconds;


    var diffTime = diffHour+ ':' + diffMinutes+ ':'+ diffSeconds;

    return diffTime;
  };

  dateObj.month = mnth;
  dateObj.date = dt;
  dateObj.year = yr;
  dateObj.hour = hour;
  dateObj.minutes = minutes;
  dateObj.seconds = seconds;
  dateObj.formatted = formatted;
  dateObj.formattedDate = formattedDate;
  dateObj.formattedTime = formattedTime;
  dateObj.DiffTime = DiffTime;
  
  return dateObj;
};
    




