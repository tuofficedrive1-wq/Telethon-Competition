import { db, ref, get } from './firebase-config.js';

document.getElementById("loginBtn").addEventListener("click", async () => {
    const loginId = document.getElementById("loginId").value;
    const password = document.getElementById("password").value;
    const msgDiv = document.getElementById("message");

    if (!loginId || !password) {
        msgDiv.innerText = "Please enter both ID and Password!";
        return;
    }

    msgDiv.innerText = "Logging in... Please wait.";
    msgDiv.style.color = "#1769aa";

    // Hardcoded Admin
    if(loginId === 'admin' && password === 'admin123') {
        localStorage.setItem("userRole", "admin");
        window.location.href = "competition-admin.html";
        return;
    }

    try {
        const snapshot = await get(ref(db, 'competition/settings'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            let role = "";
            
            if (data.teamAId === loginId && data.teamAPassword === password) role = 'A';
            else if (data.teamBId === loginId && data.teamBPassword === password) role = 'B';
            else if (data.teamCId === loginId && data.teamCPassword === password) role = 'C';

            if (role !== "") {
                msgDiv.style.color = "green";
                msgDiv.innerText = "Login Successful!";
                localStorage.setItem("userRole", role);
                window.location.href = "competition-team.html";
            } else {
                msgDiv.style.color = "#d00";
                msgDiv.innerText = "Invalid ID or Password";
            }
        } else {
            msgDiv.style.color = "#d00";
            msgDiv.innerText = "No competition data found. Ask Admin to save settings.";
        }
    } catch (error) {
        msgDiv.style.color = "#d00";
        msgDiv.innerText = "Error connecting to server!";
    }
});