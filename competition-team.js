import { db, ref, update, onValue } from './firebase-config.js';

const myRole = localStorage.getItem("userRole"); // 'A', 'B', or 'C'

if (!myRole || myRole === 'admin') {
    window.location.href = "competition-login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "competition-login.html";
});

document.getElementById("loginInfo").innerText = "Logged in as Team " + myRole;

// Instant Live Update (0.1 second delay)
onValue(ref(db, 'competition'), (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        const settings = data.settings || {};
        const live = data.live || { teamAAmount: 0, teamBAmount: 0, teamCAmount: 0 };

        document.getElementById("competitionName").innerText = settings.competitionName || "Competition";
        document.getElementById("competitionDate").innerText = settings.competitionDate || "-";

        document.getElementById("teamAName").innerText = settings.teamAName || "Team A";
        document.getElementById("teamBName").innerText = settings.teamBName || "Team B";
        document.getElementById("teamCName").innerText = settings.teamCName || "Team C";

        const aAmount = live.teamAAmount || 0;
        const bAmount = live.teamBAmount || 0;
        const cAmount = live.teamCAmount || 0;

        document.getElementById("teamAAmount").innerText = "₹" + aAmount;
        document.getElementById("teamBAmount").innerText = "₹" + bAmount;
        document.getElementById("teamCAmount").innerText = "₹" + cAmount;

        if(myRole === 'A') { document.getElementById("myAmount").innerText = "₹" + aAmount; document.getElementById("teamTitle").innerText = settings.teamAName || "Team A"; }
        if(myRole === 'B') { document.getElementById("myAmount").innerText = "₹" + bAmount; document.getElementById("teamTitle").innerText = settings.teamBName || "Team B"; }
        if(myRole === 'C') { document.getElementById("myAmount").innerText = "₹" + cAmount; document.getElementById("teamTitle").innerText = settings.teamCName || "Team C"; }

        let winner = "-";
        if(aAmount > bAmount && aAmount > cAmount) winner = (settings.teamAName || "Team A");
        else if(bAmount > aAmount && bAmount > cAmount) winner = (settings.teamBName || "Team B");
        else if(cAmount > aAmount && cAmount > bAmount) winner = (settings.teamCName || "Team C");
        else if(aAmount > 0 || bAmount > 0 || cAmount > 0) winner = "Tie / Draw";
        
        document.getElementById("winner").innerText = "Current Winner: " + winner;
    }
});

document.getElementById("updateBtn").addEventListener("click", async () => {
    const newAmount = document.getElementById("amountInput").value;
    const btn = document.getElementById("updateBtn");
    
    if(!newAmount || newAmount < 0) {
        alert("Please enter a valid amount");
        return;
    }

    btn.innerText = "Updating...";
    btn.disabled = true;

    try {
        let updateData = {};
        updateData["team" + myRole + "Amount"] = Number(newAmount);
        
        // Push direct to Firebase Live Node
        await update(ref(db, 'competition/live'), updateData);
        
        document.getElementById("amountInput").value = "";
    } catch(err) {
        alert("Failed to update amount");
    }

    btn.innerText = "Update My Amount";
    btn.disabled = false;
});