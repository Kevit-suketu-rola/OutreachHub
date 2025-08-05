const API_BASE: string = "http://localhost:3000";
const token: string | null = localStorage.getItem("token");
const workspaceId: string | null = localStorage.getItem("workspaceId");

if (!token) {
  window.location.href = "../authentication/login.html";
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

const nameInput = document.getElementById("name") as HTMLInputElement;
const phoneInput = document.getElementById("phone") as HTMLInputElement;
const tagsInput = document.getElementById("tags") as HTMLInputElement;

const searchInput = document.getElementById("search") as HTMLInputElement;
const searchSelect = document.getElementById("select") as HTMLSelectElement;
const searchForm = document.getElementById("search-form") as HTMLFormElement;

const dataContainer = document.getElementById("data") as HTMLDivElement;

const editForm = document.getElementById("edit-form") as HTMLFormElement;
const showDialogue = document.getElementById("show-dialogue") as HTMLDivElement;
const dialogueContainer = document.getElementById(
  "show-dialogue-container"
) as HTMLDivElement;
const showTable = document.getElementById("show-table") as HTMLTableElement;

const logoutBtn = document.getElementById("logout");

let entries: Contact[] = [];
let currentIndex: number = -1;
let currentRequest: string = "POST";

// Load data
document.addEventListener("DOMContentLoaded", fetchContacts);

logoutBtn?.addEventListener("click", (): void => {
  localStorage.clear();
  window.location.href = "../authentication/login.html";
});

searchForm.addEventListener("submit", (e: Event): void => {
  e.preventDefault();
  searchContacts();
});

editForm.addEventListener("submit", (e): void => {
  e.preventDefault();
  currentRequest === "POST" ? createContact() : updateContact();
});

// Fetch all contacts
async function fetchContacts(): Promise<void> {
  try {
    const res: Response = await fetch(`${API_BASE}/contacts`, {
      headers,
    });
    let data = await res.json();
    entries = data.data;
    renderTable(entries);
  } catch (err) {
    console.error("Error fetching contacts", err);
  }
}

// Render contacts in table
function renderTable(list: any[]) {
  dataContainer.innerHTML = "";
  if (!list.length) {
    dataContainer.innerHTML = `<tr><td colspan="6">No contacts found.</td></tr>`;
    return;
  }

  list.forEach((entry: any, index: number): void => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.phoneNumber}</td>
        <td><button class="show-btn" onclick="openEntry(${index})">Show</button></td>
      </tr>
    `;
    dataContainer.innerHTML += row;
  });
}

// Filter contacts by search
function searchContacts(): void {
  const query: string = searchInput.value.trim().toLowerCase();
  const field: keyof Contact = searchSelect.value as keyof Contact;

  const filtered: Contact[] = entries.filter((entry: Contact) =>
    (entry[field] as string)?.toLowerCase().includes(query)
  );

  renderTable(filtered);
}

// Open contact detail
function openEntry(index: number): void {
  currentIndex = index;
  const c: Contact = entries[index];
  showTable.innerHTML = `
    <tr><th>Name</th><td>${c.name}</td></tr>
    <tr><th>Phone</th><td>${c.phoneNumber}</td></tr>
    <tr><th>Tags</th><td>${c.tags?.join(", ") || "-"}</td></tr>
  `;
  openShowDialogue();
}

//  Add Contact Form
function openAddDialogue(): void {
  currentRequest = "POST";
  clearForm();
  toggleContainer();
  toggleForm();
}

//  Edit Contact Form
function openEditDialogue(): void {
  currentRequest = "PUT";
  const c: Contact = entries[currentIndex];
  nameInput.value = c.name;
  phoneInput.value = c.phoneNumber;
  tagsInput.value = c.tags.join(", ");
  toggleShow();
  toggleForm();
}

// New Contact
async function createContact(): Promise<void> {
  const body: any = getFormData();

  try {
    await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...body, workspaceId }),
    });
    await fetchContacts();
    resetDialogue();
  } catch (err) {
    console.error("Error creating contact", err);
  }
}

// Updated Contact
async function updateContact(): Promise<void> {
  const contact: Contact = entries[currentIndex];
  const body: any = getFormData();

  try {
    await fetch(`${API_BASE}/contacts/${contact.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    await fetchContacts();
    resetDialogue();
  } catch (err) {
    console.error("Error updating contact", err);
  }
}

// Delete Contact
async function deleteEntry(): Promise<void> {
  const contact: Contact = entries[currentIndex];
  const confirmed = confirm(`Delete contact "${contact.name}"?`);
  if (!confirmed) return;

  try {
    await fetch(`${API_BASE}/contacts/${contact.id}`, {
      method: "DELETE",
      headers,
    });
    await fetchContacts();
    resetDialogue();
  } catch (err) {
    console.error("Error deleting contact", err);
  }
}

// helper functions
function getFormData(): Contact {
  return {
    name: nameInput.value.trim(),
    phoneNumber: phoneInput.value.trim(),
    tags: tagsInput.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

function clearForm(): void {
  nameInput.value = "";
  phoneInput.value = "";
  tagsInput.value = "";
}

// dialogue control
function resetDialogue(): void {
  editForm.classList.add("hidden");
  dialogueContainer.classList.add("hidden");
  showDialogue.classList.add("hidden");
  editForm.classList.remove("flex");
  dialogueContainer.classList.remove("flex");
  showDialogue.classList.remove("flex");
  currentIndex = -1;
}

function toggleForm(): void {
  editForm.classList.toggle("flex");
  editForm.classList.toggle("hidden");
}

function toggleContainer(): void {
  dialogueContainer.classList.toggle("hidden");
  dialogueContainer.classList.toggle("flex");
}

function toggleShow(): void {
  showDialogue.classList.toggle("hidden");
  showDialogue.classList.toggle("flex");
}

function openShowDialogue(): void {
  toggleContainer();
  toggleShow();
}
