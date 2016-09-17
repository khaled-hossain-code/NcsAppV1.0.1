/**
 * Created by khaled on 6/5/2016.
 */


var clientApp = (function() {

  var socket = io();
  /*payload = {
   IP:IP, //getting from network interfaces file IP='192.168.1.240'
   CallType: 'Normal'
   }*/

  socket.on('Normal Alert', function (payload) {
    var IP = payload.IP.split('.').join('_');
    var table = document.getElementById("callTableBody");
    var row = table.insertRow(0);
    row.className = "";
    row.id = IP;
    //console.log(payload);
    //BedNumber    RoomNumber   RoomType    Floor   CallType    CallDate    CallTime  Timer
    var newCell = row.insertCell(0);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.BedNumber;
    newCell = row.insertCell(1);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.RoomNumber;
    newCell = row.insertCell(2);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.RoomType;
    newCell = row.insertCell(3);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.Floor;
    newCell = row.insertCell(4);
    newCell.className = 'text-center';
    if(payload.CallType == 'Normal'){
        newCell.innerHTML = '<small class="label label-warning">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'Emergency'){
        newCell.innerHTML = '<small class="label label-danger">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'BlueCode'){
        newCell.innerHTML = '<small class="label label-primary">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'Toilet'){
        newCell.innerHTML = '<small class="label label-info">'+payload.CallType+'</span>';
    }else{
        newCell.innerHTML = '<small class="label label-warning">'+payload.CallType+'</span>';
    }    
    newCell = row.insertCell(5);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.CallDate;
    newCell = row.insertCell(6);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.StartTime;
    newCell = row.insertCell(7);
    newCell.className = 'text-center';
    newCell.id = IP + "_timer";

    //start a timer
    $("#" + newCell.id).timer({
      duration: '23h59m30s'
    });

    //deviceDisconnectAlert(payload.IP);
    //deviceConnectedAlert(payload.IP);
    playAlertSound(1);

  });

  socket.on('Presence Alert', function (payload) {
    var IP = payload.IP.split('.').join('_');
    $("#" + IP ).remove();
  });

  socket.on('Emergency Alert', function (payload) {
    var IP = payload.IP.split('.').join('_');
    var table = document.getElementById("callTableBody");
    var row = table.insertRow(0);
    row.className = "";
    row.id = IP;
    //console.log(payload);
    //BedNumber    RoomNumber   RoomType    Floor   CallType    CallDate    CallTime  Timer
    var newCell = row.insertCell(0);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.BedNumber;
    newCell = row.insertCell(1);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.RoomNumber;
    newCell = row.insertCell(2);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.RoomType;
    newCell = row.insertCell(3);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.Floor;
    newCell = row.insertCell(4);
    newCell.className = 'text-center';
    if(payload.CallType == 'Normal'){
        newCell.innerHTML = '<small class="label label-warning">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'Emergency'){
        newCell.innerHTML = '<small class="label label-danger">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'BlueCode'){
        newCell.innerHTML = '<small class="label label-primary">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'Toilet'){
        newCell.innerHTML = '<small class="label label-info">'+payload.CallType+'</span>';
    }else{
        newCell.innerHTML = '<small class="label label-warning">'+payload.CallType+'</span>';
    } 
    //newCell.innerHTML = payload.CallType;
    newCell = row.insertCell(5);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.CallDate;
    newCell = row.insertCell(6);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.StartTime;
    newCell = row.insertCell(7);
    newCell.className = 'text-center';
    newCell.id = IP + "_timer";

    //start a timer
    $("#" + newCell.id).timer({
      duration: '23h59m30s'
    });

    playAlertSound(2);
  });

  socket.on('BlueCode Alert', function (payload) {
    var IP = payload.IP.split('.').join('_');
    $("#" + IP).remove(); //remove emergency alert first
    var table = document.getElementById("callTableBody");
    var row = table.insertRow(0);
    row.className = "";
    row.id = IP;
    //console.log(payload);
    //BedNumber    RoomNumber   RoomType    Floor   CallType    CallDate    CallTime  Timer
    var newCell = row.insertCell(0);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.BedNumber;
    newCell = row.insertCell(1);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.RoomNumber;
    newCell = row.insertCell(2);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.RoomType;
    newCell = row.insertCell(3);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.Floor;
    newCell = row.insertCell(4);
    newCell.className = 'text-center';
    if(payload.CallType == 'Normal'){
        newCell.innerHTML = '<small class="label label-warning">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'Emergency'){
        newCell.innerHTML = '<small class="label label-danger">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'BlueCode'){
        newCell.innerHTML = '<small class="label label-primary">'+payload.CallType+'</span>';
    }else if(payload.CallType == 'Toilet'){
        newCell.innerHTML = '<small class="label label-info">'+payload.CallType+'</span>';
    }else{
        newCell.innerHTML = '<small class="label label-warning">'+payload.CallType+'</span>';
    } 
    //newCell.innerHTML = payload.CallType;
    newCell = row.insertCell(5);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.CallDate;
    newCell = row.insertCell(6);
    newCell.className = 'text-center';
    newCell.innerHTML = payload.StartTime;
    newCell = row.insertCell(7);
    newCell.className = 'text-center';
    newCell.id = IP + "_timer";

    //start a timer
    $("#" + newCell.id).timer({
      duration: '23h59m30s'
    });
    playAlertSound(3);
  });

  socket.on('Cancel BlueCode Alert', function (payload) {
    var IP = payload.IP.split('.').join('_');
    $("#" + IP).remove();
  });

  socket.on('Device Disconnected Alert', function (ip) {
       
    console.log(ip);
    deviceDisconnectAlert(ip);

  });

  //mamshad
  socket.on('Refresh Device Table', function (payload) {
    //console.log('reload');
    location.reload();
  });  
}());




