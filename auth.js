// js/auth.js

// get the currently logged in user object
function getCurrentUser() {
    var userId = localStorage.getItem("currentUserId");
    if (!userId) return null;
    var users = getUsers();
    var found = users.find(function(u) { return u.id == userId; });
    return found;
}

// Redirect dummy login to real login
function showLoginMessage() {
    window.location.href = "login.html";
}

// Handle logout
function logoutUser(e) {
    if(e) e.preventDefault();
    localStorage.removeItem("currentUserId");
    window.location.href = "index.html";
}

// Run on page load to update navbar across all pages
document.addEventListener('DOMContentLoaded', function() {
    var navContainer = document.querySelector('.navbar .container');
    var btnLogin = document.querySelector('.btn-login');
    
    // We only update if the page has a navbar
    if (navContainer && btnLogin) {
        var user = getCurrentUser();
        if (user) {
            // Replace Login button with user dropdown
            var userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            
            // Only keep first name for the navbar
            var firstName = user.name.split(' ')[0];
            var initial = user.name.charAt(0).toUpperCase();
            
            userMenu.innerHTML = `
                <button class="user-menu-btn">
                    <div class="user-avatar-small">${initial}</div>
                    <span>${firstName}</span>
                </button>
                <div class="user-dropdown">
                    <a href="profile.html">Profile</a>
                    <a href="dashboard.html">Dashboard</a>
                    <a href="#" onclick="logoutUser(event)">Logout</a>
                </div>
            `;
            
            navContainer.replaceChild(userMenu, btnLogin);
        } else {
            // Ensure logged-out users are sent to login.html if they click the button
            btnLogin.onclick = null;
            btnLogin.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        }
    }
});

// Helper: Clear error text
function clearErrors() {
    var errors = document.querySelectorAll('.form-error');
    errors.forEach(function(el) { el.innerText = ""; });
}

// Helper: Show error text inline
function showError(id, message) {
    var el = document.getElementById(id);
    if (el) el.innerText = message;
}

// Validate and process login
function loginUser(e) {
    e.preventDefault(); // Prevent form submission reload
    clearErrors();
    
    var email = document.getElementById("loginEmail").value.trim();
    var pass = document.getElementById("loginPassword").value.trim();
    var isValid = true;
    
    // Empty checks
    if (!email) {
        showError("loginEmailError", "Email is required");
        isValid = false;
    }
    if (!pass) {
        showError("loginPasswordError", "Password is required");
        isValid = false;
    }
    
    if (!isValid) return;
    
    var users = getUsers();
    var found = users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });
    
    if (!found) {
        showError("loginPasswordError", "Invalid email or password");
        return;
    }

    // NOTE: This is a frontend-only demo. Real passwords should never be stored in plain text or checked this way.
    // For demo purposes: if a sample user has no password set, we'll allow "password" as a default
    var validPassword = found.password || "password";
    
    if (validPassword !== pass) {
        showError("loginPasswordError", "Invalid email or password");
        return;
    }
    
    // Success: save session and redirect
    localStorage.setItem("currentUserId", found.id);
    window.location.href = "index.html";
}

// Validate and process registration
function registerUser(e) {
    e.preventDefault(); // Prevent form submission reload
    clearErrors();
    
    var name = document.getElementById("regName").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var pass = document.getElementById("regPassword").value.trim();
    var confirmPass = document.getElementById("regConfirmPassword").value.trim();
    var isValid = true;
    
    if (!name) {
        showError("regNameError", "Name is required");
        isValid = false;
    }
    
    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
        showError("regEmailError", "Please enter a valid email address");
        isValid = false;
    }
    
    if (pass.length < 6) {
        showError("regPasswordError", "Password must be at least 6 characters");
        isValid = false;
    }
    
    if (pass !== confirmPass) {
        showError("regConfirmPasswordError", "Passwords do not match");
        isValid = false;
    }
    
    if (!isValid) return;
    
    var users = getUsers();
    var exists = users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });
    
    if (exists) {
        showError("regEmailError", "Email is already registered");
        return;
    }
    
    // Create new user (frontend-only dummy approach)
    var newUser = {
        id: Date.now(), // simple unique ID
        name: name,
        email: email,
        password: pass, // Stored in plain text for demo only!
        role: "user",
        bio: "I am a new member of NeuraBlog.",
        skills: "",
        github: "",
        linkedin: "",
        bookmarks: [],
        likedPosts: []
    };
    
    users.push(newUser);
    saveUsers(users);
    
    alert("Account created successfully!");
    localStorage.setItem("currentUserId", newUser.id);
    window.location.href = "index.html";
}
