
const API_URL = "/api";

let currentUserId = null;

// Show Registration Section
document.getElementById("show-registration").addEventListener("click", () => {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("registration-section").style.display = "block";
});

// Show Login Section
document.getElementById("show-login").addEventListener("click", () => {
    document.getElementById("registration-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
});

// User Registration
document.getElementById("registration-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const userData = {
        username: document.getElementById("username").value,
        email: document.getElementById("reg-email").value,
        rollNumber: document.getElementById("roll-number").value,
        casualLeave: Number(document.getElementById("casual-leave").value),
        medicalLeave: Number(document.getElementById("medical-leave").value)
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        document.getElementById("registration-response").textContent = result.message;

        if (response.ok) {
            document.getElementById("registration-form").reset();
            document.getElementById("registration-section").style.display = "none";
            document.getElementById("login-section").style.display = "block";
        }
    } catch (error) {
        document.getElementById("registration-response").textContent =
            "Unable to connect to server.";
        console.error(error);
    }
});

// User Login
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (!response.ok) {
            document.getElementById("response-message").textContent = result.message;
            return;
        }

        currentUserId = result.userId;

        document.getElementById("username-display").textContent = result.username;
        document.getElementById("roll-number-display").textContent = result.rollNumber;

        document.getElementById("login-section").style.display = "none";
        document.getElementById("registration-section").style.display = "none";
        document.getElementById("balance-section").style.display = "block";
        document.getElementById("apply-leave-section").style.display = "block";
        document.getElementById("logout-button").style.display = "inline-block";
        document.getElementById("response-message").textContent = result.message;

        await loadLeaveBalance();
    } catch (error) {
        document.getElementById("response-message").textContent =
            "Unable to connect to server.";
        console.error(error);
    }
});

// Load Leave Balance
async function loadLeaveBalance() {
    if (!currentUserId) return;

    try {
        const response = await fetch(
            `${API_URL}/leave-balance/${currentUserId}`
        );

        const result = await response.json();

        if (!response.ok) {
            document.getElementById("response-message").textContent = result.message;
            return;
        }

        document.getElementById("casual-leave-display").textContent =
            result.casualLeave;

        document.getElementById("medical-leave-display").textContent =
            result.medicalLeave;
    } catch (error) {
        document.getElementById("response-message").textContent =
            "Unable to load leave balance.";
        console.error(error);
    }
}

// Refresh Leave Balance
document.getElementById("refresh-balance").addEventListener("click", () => {
    loadLeaveBalance();
});

// Apply for Leave
document.getElementById("leave-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentUserId) return;

    const type = document.getElementById("leave-type").value;
    const days = document.getElementById("leave-days").value;

    try {
        const response = await fetch(
            `${API_URL}/apply-leave/${currentUserId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ type, days })
            }
        );

        const result = await response.json();

        document.getElementById("response-message").textContent = result.message;

        if (response.ok) {
            document.getElementById("leave-form").reset();
            await loadLeaveBalance();
        }
    } catch (error) {
        document.getElementById("response-message").textContent =
            "Unable to connect to server.";
        console.error(error);
    }
});

// Logout
document.getElementById("logout-button").addEventListener("click", () => {
    currentUserId = null;

    document.getElementById("login-section").style.display = "block";
    document.getElementById("registration-section").style.display = "none";
    document.getElementById("balance-section").style.display = "none";
    document.getElementById("apply-leave-section").style.display = "none";
    document.getElementById("logout-button").style.display = "none";

    document.getElementById("login-form").reset();
    document.getElementById("response-message").textContent = "";
});
