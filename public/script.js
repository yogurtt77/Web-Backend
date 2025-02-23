const API_URL = "http://localhost:5000/api";

// // Handle login
// document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const username = document.getElementById("loginUsername").value;
//     const password = document.getElementById("loginPassword").value.trim();
//
//     console.log("Login attempt with username:", username, "and password:", password); // Debug log
//
//     const res = await fetch(`${API_URL}/users/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//     });
//     console.log("Response status:", res.status);
//     const data = await res.json();
//     console.log(data);
//     if (data.token) {
//         localStorage.setItem("token", data.token);
//         window.location.href = "dashboard.html";
//     } else {
//         alert("Login failed!");
//     }
// });
//
// // Handle registration
// document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const username = document.getElementById("registerUsername").value;
//     const password = document.getElementById("registerPassword").value;
//
//     const res = await fetch(`${API_URL}/users/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//     });
//
//     if (res.ok) {
//         alert("User registered! Now login.");
//     } else {
//         alert("Registration failed.");
//     }
// });
// Profile
// console.log("Response status:", res.status);
// console.log(data);

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to login first');
        window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/user/profile", {
            method: "GET",
            headers: { "Authorization": token }
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const user = await res.json();
        document.getElementById("username").textContent = user.username;
        document.getElementById("bio").textContent = user.bio;
    } catch (err) {
        console.error(err);
        alert("Error loading profile");
    }
});

// Fetch and display notes
async function loadNotes() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`${API_URL}/notes`, {
        headers: { Authorization: token },
    });

    const notes = await res.json();
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";

    notes.forEach((note) => {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.innerHTML = `
            <h4>${note.title}</h4>
            <p>${note.content}</p>
            <button onclick="deleteNote('${note._id}')">Delete</button>
        `;
        notesList.appendChild(noteDiv);
    });
}

// Handle adding notes
document.getElementById("noteForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ title, content }),
    });

    document.getElementById("noteForm").reset();
    loadNotes();
});

// Delete note
async function deleteNote(id) {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
    });
    loadNotes();
}


// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Load notes when dashboard loads
if (window.location.pathname.includes("dashboard.html")) {
    loadNotes();
}
