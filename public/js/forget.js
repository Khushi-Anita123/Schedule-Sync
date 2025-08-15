document.getElementById("forgetForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const newPassword = document.getElementById("newPassword").value;

      const res = await fetch("/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
      })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        alert("New password saved successfully!");
        window.location.href ='Login.html';
      } 
    })
    .catch(err => {
      console.error("Reset error:", err);
      alert("Something went wrong during password");
    });
    });
