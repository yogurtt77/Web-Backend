document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to login first');
        window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:4000/user/profile", {
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