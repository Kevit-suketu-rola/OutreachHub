"use strict";
function navigatTo(event) {
    const select = event.target;
    const url = select.value;
    if (url)
        window.location.href = url;
}
function logout() {
    localStorage.clear();
    window.location.href = "/";
}
