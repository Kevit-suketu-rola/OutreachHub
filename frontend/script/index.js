function navigateTo(select) {
  let url = select.value;
  if (url) window.location.href = url;
}

function logout() {
  localStorage.clear();
}
