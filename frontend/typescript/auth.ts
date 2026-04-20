let loginForm = document.getElementById("login-form") as HTMLFormElement;

let loginNameInput = document.getElementById("login-name") as HTMLInputElement;
let loginPasswordInput = document.getElementById(
  "login-password"
) as HTMLInputElement;

const API_URL: string = "http://localhost:3000/auth/";

loginForm.addEventListener("submit", async (e: Event): Promise<void> => {
  e.preventDefault();

  try {
    const response: Response = await fetch(API_URL + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginNameInput.value + "",
        password: loginPasswordInput.value + "",
      }),
    });

    let data: any = await response.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "../home";
    }

    // console.log(data);
  } catch (error) {
    console.error("Error during login:", error);
    alert("Something went wrong. Please try again.");
  }
});
