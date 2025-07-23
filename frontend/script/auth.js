let loginForm =
  document.getElementById("login-form") || document.createElement("form");
let signupForm =
  document.getElementById("sign-up-form") | document.createElement("form");

let loginNameInput = document.getElementById("login-name");
let loginPasswordInput = document.getElementById("login-password");

let signupNameInput = document.getElementById("name");
let signupEmailInput = document.getElementById("email");
let signupMobileInput = document.getElementById("mobile");
let signupPasswordInput = document.getElementById("password");
let signupCPasswordInput = document.getElementById("c-password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    console.log(typeof loginNameInput.value + "");
    console.log(typeof loginPasswordInput.value + "");
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginNameInput.value + "",
        password: loginPasswordInput.value + "",
      }),
    });

    let data = await response.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "../home"
    }

    console.log(data);
  } catch (error) {
    console.error("Error during login:", error);
    alert("Something went wrong. Please try again.");
  }
});
