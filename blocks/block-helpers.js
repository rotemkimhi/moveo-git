
function getRoomIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('roomId');
}

function updateRoomUsersUI(users, socket) {
    const roomUsersList = document.getElementById('room-users-list');
    roomUsersList.innerHTML = '';
    const heading = document.createElement('p');
    heading.textContent = 'Active users:';
    roomUsersList.appendChild(heading);

    for (const user of users) {
      if (user.active) {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.username} - ${user.userType}`;
        roomUsersList.appendChild(listItem);

        // Check if the user is the current user based on their socket ID
        if (user.socketId === socket.id) {
          const helloMessage = document.getElementById('hello-message');
          helloMessage.textContent = `Hello ${user.username}!`;
        }
      }
    }
  }
  function displayBigSmiley() {
    const bigSmileyDiv = document.createElement('div');

    // Set the styles for the div
    bigSmileyDiv.style.fontSize = '50px';
    bigSmileyDiv.style.display = 'block';
    bigSmileyDiv.style.textAlign = 'center';

    bigSmileyDiv.id = 'bigSmiley';
    bigSmileyDiv.textContent = '😊';
    document.body.appendChild(bigSmileyDiv);
  }

  function initializeCommonBehavior(socket){
    const sharedTextBox = document.getElementById('sharedTextBox'); 
    const sendButton = document.getElementById('sendButton');
    let userType;
    // connection to server
    socket.on('connect', () => {
      socket.on('serverReady', (currentUser) =>{
        console.log('Connected to server');
      // Attempt to reconnect with the room ID from the URL
        const roomId = getRoomIdFromUrl();
        console.log('Room ID from URL:', roomId);
        if (roomId) {
        // Join the room using the extracted room ID
          socket.emit('joinRoom', roomId); 
        }
      socket.on('userType', (userType) => {
      if (userType === 'student') {
        // Allow editing for students
        sharedTextBox.style.display = 'block'; // Show the text box
        sendButton.style.display = 'block';
        sharedTextBox.addEventListener('input', (event) => {
          // Emit the text change event when the student types
          socket.emit('textChange', { text: event.target.value });
        });
      }
      else{
        // Disable editing for teachers
        sharedTextBox.disabled = true;
        sendButton.style.display = 'none';
      }
    });
      // what to do when the student writes
      socket.on('textChange', (data) => {
        sharedTextBox.value = data.text;
    });

      // Follow who is in the room
      socket.on('updateRoomUsers', (users) => {
        console.log('Received updated room user list:', users);
        updateRoomUsersUI(users, socket);
      });

      socket.on('receivedAnswer', () => {
        console.log("Message received");
      });
      
      // handle a user who wants to leave a room
      socket.on('leaveRoom', (updatedUsers) => {
        console.log('Received leaveRoom event for room:', updatedUsers);
        // Handle the leaveRoom event
        updateRoomUsersUI(updatedUsers);
      });
      })
    });
    
    

    

    

    
    
  }

  export {displayBigSmiley, getRoomIdFromUrl, updateRoomUsersUI, initializeCommonBehavior};