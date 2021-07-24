$(document).ready(() => {
  let socket = io("/privateChat"),
    firstId = $("#first-user-id").val(), //firstUserId
    secondId = $("#second-user-id").val(),//secondUserId
    firstName = $("#first-user-name").val(),//firstUserName
    secondName = $("#second-user-name").val(),//secondUserName

    chatIddata = [firstId, secondId]


  socket.emit("join", chatIddata);
  socket.on("joined", (data) => {
    window.chatId = data
  })




  $("#privateChatForm").submit((event) => {
    event.preventDefault();
    let text = $("#chat-input").val(),
      data = {
        content: text,
        chatId: [firstId, secondId].sort()[0] + [firstId, secondId].sort()[1],
        receiver: $("#second-user-id").val(),//secondUserId
        sender: $("#first-user-id").val(),
        senderName: $("#first-user-name").val(),
        receiverName: secondName
      };
    socket.emit("privateMessage", data);
    $("#chat-input").val("");
    return false;
  });





  // let secondId = data.secondId,
  //   chatId = data.chatId;
  checkStatus = () => {
    let chatId = window.chatId,
      secondId = $("#second-user-id").val();

    if (chatId) {
      let data = {
        chatId: chatId,
        secondId: secondId
      }
      socket.emit("checkOtherUserStatus",data)
    }

  }
  setInterval(checkStatus, 3000)


  socket.on("serverConfirmStatus",(status)=>{
    if (status==true){
      $("#online-status").text("Online")
    } else {
      $("#online-status").text("")
    }
  })



  socket.on("incomingDm", (message) => {
    let data = [firstId, secondId];
    if (message.sender != data[0]) {
      socket.emit("im online, update database to read", data)
    }
    displayMessage(message);
    for (let i = 0; i < 2; i++) {
      $(".chat-icon").fadeOut(200).fadeIn(200);
    }
  });



  let displayMessage = (message) => {
    $("#privateChatBox").prepend($("<li>").html(`<strong class="message ${getCurrentUserClass(message.sender)}">${getCurrentUserName(message.sender)}</strong>: ${message.content}`
    ));
  };
  let getCurrentUserClass = (id) => {
    let userId = $("#first-user-id").val();
    return userId === id[0] ? "current-user" : "";
  };
  let getCurrentUserName = (id) => {
    let userId = $("#first-user-id").val();
    if (userId === id[0]) {
      return "Me"
    } else {
      return secondName
    }

  };





});



