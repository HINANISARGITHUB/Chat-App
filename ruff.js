import { getDatabase, ref, push, onChildAdded, remove, update } from "https:                                                          


// Chat functions
function createMessageElement(data, messageId, currentUsername) {
  const container = document.createElement("div");
  container.classList.add("message-container");
  container.classList.add(data.username === currentUsername ? "sent" : "received");

  const wrapper = document.createElement("div");
  wrapper.classList.add("message-wrapper");

  const letterCircle = document.createElement("div");
  letterCircle.classList.add("letter-circle");
  letterCircle.textContent = data.username.charAt(0).toUpperCase();

  const textWrapper = document.createElement("div");
  const name = document.createElement("div");
  name.classList.add("username");
  name.textContent = data.username;
  const msg = document.createElement("div");
  msg.classList.add("message-text");
  msg.textContent = data.message;
  textWrapper.appendChild(name);
  textWrapper.appendChild(msg);

  wrapper.appendChild(letterCircle);
  wrapper.appendChild(textWrapper);

  if (data.username === currentUsername) {
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    const editBtn = document.createElement("span");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-icon");
    editBtn.title = "Edit message";
    editBtn.addEventListener("click", () => editMessage(messageId, container, data.message));
    const delBtn = document.createElement("span");
    delBtn.textContent = "🗑️";
    delBtn.classList.add("delete-icon");
    delBtn.title = "Delete message";
    delBtn.addEventListener("click", () => {
      if (confirm("Delete this message?")) deleteMessage(messageId, container);
    });
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(delBtn);
    wrapper.appendChild(btnContainer);
  }

  container.appendChild(wrapper);
  return container;
}

window.onload = function() {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;
  const currentUsername = localStorage.getItem("username");

  onChildAdded(ref(db, "messages"), (snapshot) => {
    const data = snapshot.val();
    const messageId = snapshot.key;
    const messageElement = createMessageElement(data, messageId, currentUsername);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
};

window.sendMessage = function() {
  const message = document.getElementById("message").value.trim();
  const username = localStorage.getItem("username");
  if (message === "") return;
  push(ref(db, "messages"), { username, message })
    .then(() => (document.getElementById("message").value = ""))
    .catch((error) => alert("Error sending message: " + error.message));
};

function deleteMessage(messageId, messageElement) {
  remove(ref(db, `messages/${messageId}`))
    .then(() => messageElement.remove())
    .catch((error) => alert("Error deleting message: " + error.message));
}

function editMessage(messageId, messageElement, oldText) {
  const newText = prompt("Edit your message:", oldText);
  if (newText && newText.trim() !== "") {
    update(ref(db, `messages/${messageId}`), { message: newText })
      .then(() => {
        messageElement.querySelector(".message-text").textContent = newText;
      })
      .catch((error) => alert("Error updating message: " + error.message));
  }
}