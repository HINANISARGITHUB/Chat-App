
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
  import {getDatabase, ref, push, onChildAdded, remove, update } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js"
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
 
  const firebaseConfig = {
    apiKey: "AIzaSyAoJ8U6wcAjBsUq95gMtm0gWmdrWbHJ_Gc",
    authDomain: "real-time-data-base-4c6c0.firebaseapp.com",
    projectId: "real-time-data-base-4c6c0",
    storageBucket: "real-time-data-base-4c6c0.firebasestorage.app",
    messagingSenderId: "1065909198495",
    appId: "1:1065909198495:web:9e983b3469db118702ccaa",
    measurementId: "G-WVNDRBYNP1"
  };

 
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


  const auth = getAuth(app);

  const provider = new GoogleAuthProvider();

  const db = getDatabase(app)  // real time data base

  // signup

  document.getElementById('signUp')?.addEventListener('click', () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
    // .then(() => {
    //   // alert('signUp sucessfully');
    //   window.location.href = 'user.html'
    // })

     .then(() => {
    swal('Congratulation' , 'SignUp Successfully' , 'success')
    .then(() => {
      window.location.href = 'user.html';
    });
  })

    .catch((error) => {
      alert(error.message)
    })
  })



    // login

  document.getElementById('login')?.addEventListener('click', () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
    // .then(() => {
    //   alert('login sucessfully');
    //   window.location.href = 'user.html'
    // })

      .then(() => {
    swal('Congratulation' , 'login Successfully' , 'success')
    .then(() => {
      window.location.href = 'user.html';
    });
  })

    .catch((error) => {
      alert(error.message)
    })
  })

  //continue with google

  document.getElementById('google-btn')?.addEventListener('click', () => {
    signInWithPopup(auth , provider)
    .then(() => {
      alert('login successfully')
      window.location.href = 'user.html'
    })

    .catch((error) => {
      alert(error.message)
    })
  })

// signout
document.getElementById('logOut')?.addEventListener('click', () => {
  signOut(auth)
  // .then(() => {
  //   alert('logout successfully')
  //   window.location.href = 'index.html'
  // })

   .then(() => {
    swal('Go to Home Page', 'logout')
    .then(() => {
      window.location.href = 'index.html';
    });
  })

  .catch((error) => {
    alert(error.message)
  })
})

//ok button 

document.getElementById('user-btn')?.addEventListener('click', () => {
  const username = document.getElementById('userName').value.trim();
  if(!username) {
    
  alert('Must enter your user name');
  return
  }
  localStorage.setItem('username', username);  //for firebase localstorage  // anyName ia a keyname
  window.location.href = 'chat.html'
})


////////////////// chat app //////////////////

// ✅ Ensure username is set
let currentUsername = localStorage.getItem("username");
if (!currentUsername) {
  currentUsername = prompt("Enter your username:");
  localStorage.setItem("username", currentUsername);
}

// ✅ Create message element
function createMessageElement(data, messageId, currentUsername) {
  const container = document.createElement("div");
  container.classList.add("message-container");
  container.classList.add(data.username === currentUsername ? "sent" : "received");

  const wrapper = document.createElement("div");
  wrapper.classList.add("message-wrapper");

  const letterCircle = document.createElement("div");
  letterCircle.classList.add("letter-circle");

  // ✅ Safe username fix
  const username = data.username || data.name || "Unknown";
  letterCircle.textContent = username.charAt(0).toUpperCase();

  const textWrapper = document.createElement("div");
  const name = document.createElement("div");
  name.classList.add("username");
  name.textContent = username;

  const msg = document.createElement("div");
  msg.classList.add("message-text");
  msg.textContent = data.message;

  textWrapper.appendChild(name);
  textWrapper.appendChild(msg);

  wrapper.appendChild(letterCircle);
  wrapper.appendChild(textWrapper);

  // ✅ Add edit/delete buttons if message is user's own
  if (username === currentUsername) {
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    const editBtn = document.createElement("span");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-icon");
    editBtn.title = "Edit message";
    editBtn.addEventListener("click", () =>
      editMessage(messageId, container, data.message)
    );
const delBtn = document.createElement("span");
delBtn.textContent = "🗑️";
delBtn.classList.add("delete-icon");
delBtn.title = "Delete message";
delBtn.addEventListener("click", () => deleteMessage(messageId, container));

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(delBtn);
    wrapper.appendChild(btnContainer);
  }

  container.appendChild(wrapper);
  return container;
}

// ✅ Load messages on window load
window.onload = function () {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;

  onChildAdded(ref(db, "messages"), (snapshot) => {
    const data = snapshot.val();
    const messageId = snapshot.key;
    const messageElement = createMessageElement(data, messageId, currentUsername);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
};

// ✅ Send Message
window.sendMessage = function () {
  const message = document.getElementById("message").value.trim();
  if (message === "") return;

  push(ref(db, "messages"), { username: currentUsername, message })
    .then(() => (document.getElementById("message").value = ""))
    .catch((error) => alert("Error sending message: " + error.message));
};

// ✅ Button listener
document.getElementById("send-btn").addEventListener("click", sendMessage);

// ✅ Delete Message
// function deleteMessage(messageId, messageElement) {
//   remove(ref(db, `messages/${messageId}`))
//     .then(() => messageElement.remove())
//     .catch((error) => alert("Error deleting message: " + error.message));
// }

function deleteMessage(id, el) {
  swal({
    title: "Are you sure?",
    text: "Do you really want to delete this message?",
    icon: "warning",
    buttons: ["Cancel", "Delete"],
    dangerMode: true,
  }).then((ok) => {
    if (ok) {
      remove(ref(db, `messages/${id}`))
        .then(() => {
          el.remove();
          swal("Deleted!", "Your message has been deleted.", "success");
        })
        .catch(err => swal("Error!", err.message, "error"));
    }
  });
}






// ✅ Edit Message
// function editMessage(messageId, messageElement, oldText) {
//   const newText = prompt("Edit your message:", oldText);
//   if (newText && newText.trim() !== "") {
//     update(ref(db, `messages/${messageId}`), { message: newText })
//       .then(() => {
//         messageElement.querySelector(".message-text").textContent = newText;
//       })
//       .catch((error) => alert("Error updating message: " + error.message));
//   }
// }


// function editMessage(messageId, messageElement, oldText) {
//   swal("Edit your message:", {
//     content: "input",
//     buttons: ["Cancel", "Edit"],
//   }).then((newText) => {
//     if (newText && newText.trim() !== "") {
//       update(ref(db, `messages/${messageId}`), { message: newText })
//         .then(() => {
//           messageElement.querySelector(".message-text").textContent = newText;
//           swal("Updated!", "Your message has been edited.", "success");
//         })
//         .catch((error) => {
//           swal("Error", "Error updating message: " + error.message, "error");
//         });
//     }
//   });
// }

function editMessage(messageId, messageElement, oldText) {
  swal("Edit your message:", {
    content: {
      element: "input",
      attributes: {
        value: oldText,
        placeholder: "Type new message",
      },
    },
    buttons: ["Cancel", "Update"],
  }).then((newText) => {
    if (newText && newText.trim() !== "") {
      update(ref(db, `messages/${messageId}`), { message: newText })
        .then(() => {
          // update message immediately
          messageElement.querySelector(".message-text").textContent = newText;

          // show small swal near the message
          const success = document.createElement("span");
          // success.textContent = " ✓ Updated";
          success.style.color = "green";
          success.style.marginLeft = "8px";
          success.style.fontSize = "13px";

          messageElement.appendChild(success);

          // remove after 1.5s
          setTimeout(() => success.remove(), 1500);
        })
        .catch((error) => {
          swal("Error", "Error updating message: " + error.message, "error");
        });
    }
  });
}

