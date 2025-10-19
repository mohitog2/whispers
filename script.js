const apiUrl =
  "https://script.google.com/macros/s/AKfycbwwdcV2qoeIiPe_HhdsLOSd3azVkdGTa3eEJ2QAAY-FO4aci1wJNZYq6fOd2Tu7GupNtQ/exec"; // Replace with your latest /exec URL

// Popup elements
const feed = document.getElementById("feed");
const openPostBox = document.getElementById("openPopup");
const popup = document.getElementById("postPopup");
const closePopupBtn = document.getElementById("closePopup");
const postBtn = document.getElementById("postBtn");
const nameInput = document.getElementById("nameInput");
const contentInput = document.getElementById("contentInput");

// -------------------- Popup open/close --------------------
openPostBox.onclick = () => (popup.style.display = "block");
closePopupBtn.onclick = () => (popup.style.display = "none");

// -------------------- Timestamp formatter --------------------
function getFormattedTime() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

// -------------------- Post submission --------------------
postBtn.onclick = () => {
  const content = contentInput.value.trim();
  const name = nameInput.value.trim() || "Anonymous";
  if (!content) return alert("Post cannot be empty");

  const data = {
    id: Date.now(), // unique ID
    name,
    content,
    
  };

  // Send post via JSONP
  const script = document.createElement("script");
  script.src = `${apiUrl}?callback=postCallback&data=${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  document.body.appendChild(script);

  // Clear inputs & close popup
  contentInput.value = "";
  nameInput.value = "";
  popup.style.display = "none";
};

// -------------------- JSONP callbacks --------------------
function postCallback(response) {
  loadPosts(); // reload posts after submission
}

function displayPosts(posts) {
  feed.innerHTML = "";
  posts.reverse().forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      <p>${post.content}</p>
      <div class="author">Posted by <b>${post.name || "Anonymous"}</b></div>
      <small>${post.time}</small>
    `;
    feed.appendChild(div);
  });
}

// -------------------- Load posts --------------------
function loadPosts() {
  const script = document.createElement("script");
  script.src = `${apiUrl}?callback=displayPosts`;
  document.body.appendChild(script);
}

// Initial load
loadPosts();

