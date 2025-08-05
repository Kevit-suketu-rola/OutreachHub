function navigatTo(event: Event): void {
  const select = event.target as HTMLSelectElement;
  const url = select.value;
  if (url) window.location.href = url;
}

function logout():void{
  localStorage.clear();
  window.location.href = "/";
}
