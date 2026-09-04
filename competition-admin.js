import { db, ref, set, onValue } from './firebase-config.js';

if (localStorage.getItem("userRole") !== 'admin') {
    window.location.href = "competition-login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "competition-login.html";
});

// Instant Live Update (Ye function fauran update karega jaise hi data change hoga)
onValue(ref(db, 'competition'), (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        const settings = data.settings || {};
        const live = data.live || { teamAAmount: 0, teamBAmount: 0, teamCAmount: 0 };

        // Sirf tabhi fields update karo jab user unme type na kar raha ho
        if(document.activeElement.id !== "competitionName") document.getElementById("competitionName").value = settings.competitionName || "";
        if(document.activeElement.id !== "competitionDate") document.getElementById("competitionDate").value = settings.competitionDate || "";
        if(document.activeElement.id !== "competitionEndTime") document.getElementById("competitionEndTime").value = settings.competitionEndTime || "";

        if(document.activeElement.id !== "teamAName") document.getElementById("teamAName").value = settings.teamAName || "";
        if(document.activeElement.id !== "teamAId") document.getElementById("teamAId").value = settings.teamAId || "";
        if(document.activeElement.id !== "teamAPassword") document.getElementById("teamAPassword").value = settings.teamAPassword || "";

        if(document.activeElement.id !== "teamBName") document.getElementById("teamBName").value = settings.teamBName || "";
        if(document.activeElement.id !== "teamBId") document.getElementById("teamBId").value = settings.teamBId || "";
        if(document.activeElement.id !== "teamBPassword") document.getElementById("teamBPassword").value = settings.teamBPassword || "";

        if(document.activeElement.id !== "teamCName") document.getElementById("teamCName").value = settings.teamCName || "";
        if(document.activeElement.id !== "teamCId") document.getElementById("teamCId").value = settings.teamCId || "";
        if(document.activeElement.id !== "teamCPassword") document.getElementById("teamCPassword").value = settings.teamCPassword || "";

        // Live Dashboard Update
        document.getElementById("liveAName").innerText = settings.teamAName || "Team A";
        document.getElementById("liveBName").innerText = settings.teamBName || "Team B";
        document.getElementById("liveCName").innerText = settings.teamCName || "Team C";

        document.getElementById("liveAAmount").innerText = "₹" + (live.teamAAmount || 0);
        document.getElementById("liveBAmount").innerText = "₹" + (live.teamBAmount || 0);
        document.getElementById("liveCAmount").innerText = "₹" + (live.teamCAmount || 0);

        calculateWinner(live, settings);
    }
});

function calculateWinner(live, settings) {
    let a = Number(live.teamAAmount) || 0;
    let b = Number(live.teamBAmount) || 0;
    let c = Number(live.teamCAmount) || 0;
    let winner = "-";

    if(a > b && a > c) winner = settings.teamAName || "Team A";
    else if(b > a && b > c) winner = settings.teamBName || "Team B";
    else if(c > a && c > b) winner = settings.teamCName || "Team C";
    else if(a>0 || b>0 || c>0) winner = "Tie / Draw";

    document.getElementById("winner").innerText = "Winner: " + winner;
}

// Save Settings Data
document.getElementById("saveBtn").addEventListener("click", async () => {
    const statusDiv = document.getElementById("status");
    statusDiv.innerText = "Saving settings...";
    statusDiv.style.color = "#1769aa";

    const payloadData = {
        competitionName: document.getElementById("competitionName").value,
        competitionDate: document.getElementById("competitionDate").value,
        competitionEndTime: document.getElementById("competitionEndTime").value,
        teamAName: document.getElementById("teamAName").value,
        teamAId: document.getElementById("teamAId").value,
        teamAPassword: document.getElementById("teamAPassword").value,
        teamBName: document.getElementById("teamBName").value,
        teamBId: document.getElementById("teamBId").value,
        teamBPassword: document.getElementById("teamBPassword").value,
        teamCName: document.getElementById("teamCName").value,
        teamCId: document.getElementById("teamCId").value,
        teamCPassword: document.getElementById("teamCPassword").value
    };

    try {
        await set(ref(db, 'competition/settings'), payloadData);
        statusDiv.style.color = "green";
        statusDiv.innerText = "Settings Saved Successfully!";
        setTimeout(() => statusDiv.innerText = "", 3000);
    } catch(err) {
        statusDiv.style.color = "red";
        statusDiv.innerText = "Failed to save.";
    }
});