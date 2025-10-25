function login() {
  const username = document.getElementById('username').value;
  const role = document.getElementById('role').value;

  if(!username) {
    alert("Please enter your name");
    return;
  }

  if(role === "student") window.location.href = "student.html";
  else if(role === "moderator") window.location.href = "moderator.html";
  else if(role === "gatekeeper") window.location.href = "gatekeeper.html";
}