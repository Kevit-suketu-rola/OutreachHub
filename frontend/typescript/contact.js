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
const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const workspaceId = localStorage.getItem("workspaceId");
if (!token) {
    window.location.href = "../authentication/login.html";
}
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
};
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const tagsInput = document.getElementById("tags");
const searchInput = document.getElementById("search");
const searchSelect = document.getElementById("select");
const searchForm = document.getElementById("search-form");
const dataContainer = document.getElementById("data");
const editForm = document.getElementById("edit-form");
const showDialogue = document.getElementById("show-dialogue");
const dialogueContainer = document.getElementById("show-dialogue-container");
const showTable = document.getElementById("show-table");
const logoutBtn = document.getElementById("logout");
let entries = [];
let currentIndex = -1;
let currentRequest = "POST";
// Load data
document.addEventListener("DOMContentLoaded", fetchContacts);
logoutBtn === null || logoutBtn === void 0 ? void 0 : logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../authentication/login.html";
});
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchContacts();
});
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    currentRequest === "POST" ? createContact() : updateContact();
});
// Fetch all contacts
function fetchContacts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${API_BASE}/contacts`, {
                headers,
            });
            let data = yield res.json();
            entries = data.data;
            renderTable(entries);
        }
        catch (err) {
            console.error("Error fetching contacts", err);
        }
    });
}
// Render contacts in table
function renderTable(list) {
    dataContainer.innerHTML = "";
    if (!list.length) {
        dataContainer.innerHTML = `<tr><td colspan="6">No contacts found.</td></tr>`;
        return;
    }
    list.forEach((entry, index) => {
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
function searchContacts() {
    const query = searchInput.value.trim().toLowerCase();
    const field = searchSelect.value;
    const filtered = entries.filter((entry) => { var _a; return (_a = entry[field]) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query); });
    renderTable(filtered);
}
// Open contact detail
function openEntry(index) {
    var _a;
    currentIndex = index;
    const c = entries[index];
    showTable.innerHTML = `
    <tr><th>Name</th><td>${c.name}</td></tr>
    <tr><th>Phone</th><td>${c.phoneNumber}</td></tr>
    <tr><th>Tags</th><td>${((_a = c.tags) === null || _a === void 0 ? void 0 : _a.join(", ")) || "-"}</td></tr>
  `;
    openShowDialogue();
}
//  Add Contact Form
function openAddDialogue() {
    currentRequest = "POST";
    clearForm();
    toggleContainer();
    toggleForm();
}
//  Edit Contact Form
function openEditDialogue() {
    currentRequest = "PUT";
    const c = entries[currentIndex];
    nameInput.value = c.name;
    phoneInput.value = c.phoneNumber;
    tagsInput.value = c.tags.join(", ");
    toggleShow();
    toggleForm();
}
// New Contact
function createContact() {
    return __awaiter(this, void 0, void 0, function* () {
        const body = getFormData();
        try {
            yield fetch(`${API_BASE}/contacts`, {
                method: "POST",
                headers,
                body: JSON.stringify(Object.assign(Object.assign({}, body), { workspaceId })),
            });
            yield fetchContacts();
            resetDialogue();
        }
        catch (err) {
            console.error("Error creating contact", err);
        }
    });
}
// Updated Contact
function updateContact() {
    return __awaiter(this, void 0, void 0, function* () {
        const contact = entries[currentIndex];
        const body = getFormData();
        try {
            yield fetch(`${API_BASE}/contacts/${contact.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(body),
            });
            yield fetchContacts();
            resetDialogue();
        }
        catch (err) {
            console.error("Error updating contact", err);
        }
    });
}
// Delete Contact
function deleteEntry() {
    return __awaiter(this, void 0, void 0, function* () {
        const contact = entries[currentIndex];
        const confirmed = confirm(`Delete contact "${contact.name}"?`);
        if (!confirmed)
            return;
        try {
            yield fetch(`${API_BASE}/contacts/${contact.id}`, {
                method: "DELETE",
                headers,
            });
            yield fetchContacts();
            resetDialogue();
        }
        catch (err) {
            console.error("Error deleting contact", err);
        }
    });
}
// helper functions
function getFormData() {
    return {
        name: nameInput.value.trim(),
        phoneNumber: phoneInput.value.trim(),
        tags: tagsInput.value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
    };
}
function clearForm() {
    nameInput.value = "";
    phoneInput.value = "";
    tagsInput.value = "";
}
// dialogue control
function resetDialogue() {
    editForm.classList.add("hidden");
    dialogueContainer.classList.add("hidden");
    showDialogue.classList.add("hidden");
    editForm.classList.remove("flex");
    dialogueContainer.classList.remove("flex");
    showDialogue.classList.remove("flex");
    currentIndex = -1;
}
function toggleForm() {
    editForm.classList.toggle("flex");
    editForm.classList.toggle("hidden");
}
function toggleContainer() {
    dialogueContainer.classList.toggle("hidden");
    dialogueContainer.classList.toggle("flex");
}
function toggleShow() {
    showDialogue.classList.toggle("hidden");
    showDialogue.classList.toggle("flex");
}
function openShowDialogue() {
    toggleContainer();
    toggleShow();
}
