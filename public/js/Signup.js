const submitBtn = document.getElementById("submit");
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    fetch('/Signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, username, role })
})
    .then(response =>
      response.json().then(data => ({ status: response.status, body: data }))
    )
    .then(({ status, body }) => {
      if (status === 200) {
        alert("Signup successful");
        if (role === 'Teacher') {
          localStorage.setItem("role", role);
          localStorage.setItem("username", username);
        }
        window.location.href = "Login.html";
      } else {
        alert(body.message);
      }
    })
    .catch(error => {
      console.error("Signup error:", error);
      alert("Something went wrong during signup.");
    });
  });
}
