"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let loginForm = document.getElementById("login-form");
let loginNameInput = document.getElementById("login-name");
let loginPasswordInput = document.getElementById("login-password");
const API_URL = "http://localhost:3000/auth/";
loginForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    try {
        const response = yield fetch(API_URL + "login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: loginNameInput.value + "",
                password: loginPasswordInput.value + "",
            }),
        });
        let data = yield response.json();
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            window.location.href = "../home";
        }
        // console.log(data);
    }
    catch (error) {
        console.error("Error during login:", error);
        alert("Something went wrong. Please try again.");
    }
}));
