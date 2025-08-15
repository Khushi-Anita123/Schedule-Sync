if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch('/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        alert("Login successful!");

        // Store JWT in localStorage
        localStorage.setItem("token", body.token);

        // Optionally still store role & username for UI convenience
        localStorage.setItem("username", username);
        localStorage.setItem("role", body.role);
        localStorage.setItem("email", email);

        // Redirect based on role
        window.location.href = body.role === "Admin" ? "AdminFile.html" : "Teacher.html";
      } else if (status === 403) {
        // This is where you put it
        alert(body.message); // "User already logged in in another tab"
      } else {
        alert(body.message || "Login failed.");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    });
  });
}
