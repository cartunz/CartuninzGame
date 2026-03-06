document.addEventListener('DOMContentLoaded', () => {
    // One-time script to delete all accounts as requested
    if (!localStorage.getItem('accounts_cleared_v4')) {
        localStorage.removeItem('cartuninz_users');
        localStorage.removeItem('cartuninz_active_user');
        localStorage.setItem('accounts_cleared_v4', 'true');
        console.log("All accounts successfully deleted.");
    }

    // One-time script to delete just the "test" account
    if (!localStorage.getItem('test_account_cleared_v1')) {
        const usersStr = localStorage.getItem('cartuninz_users');
        if (usersStr) {
            let users = JSON.parse(usersStr);
            if (users['test']) {
                delete users['test'];
                localStorage.setItem('cartuninz_users', JSON.stringify(users));
                console.log("Account 'test' successfully deleted.");
            }
        }
        localStorage.setItem('test_account_cleared_v1', 'true');
    }

    const mainLoginBtn = document.getElementById('mainLoginBtn');
    const centerPiece = document.querySelector('.center-piece');
    const loginModal = document.getElementById('loginModal');
    const modalBackBtn = document.getElementById('modalBackBtn');

    const mainSignupBtn = document.getElementById('mainSignupBtn');
    const signupModal = document.getElementById('signupModal');
    const signupBackBtn = document.getElementById('signupBackBtn');

    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');

    // Registration elements
    const signupInputs = document.querySelectorAll('.signup-input');
    const signupUsername = signupInputs[0];
    const signupEmail = signupInputs[1];
    const signupPassword = signupInputs[2];
    const signupConfirm = signupInputs[3];
    const signupSubmitBtn = document.getElementById('signupSubmitBtn');
    const showPasswordToggle = document.getElementById('showPasswordToggle');

    if (showPasswordToggle) {
        showPasswordToggle.addEventListener('change', () => {
            const newType = showPasswordToggle.checked ? 'text' : 'password';
            if (signupPassword) signupPassword.type = newType;
            if (signupConfirm) signupConfirm.type = newType;
        });
    }

    // Setup Game Name elements
    const setupNameModal = document.getElementById('setupNameModal');
    const setupGameName = document.getElementById('setupGameName');
    const setupNameSubmitBtn = document.getElementById('setupNameSubmitBtn');
    const setupNameErrorMsg = document.getElementById('setupNameErrorMsg');
    let currentSetupUser = null;

    // Helper function for transitions
    function switchViews(hideEl, showEl) {
        hideEl.classList.remove('anim-pop-in');
        hideEl.classList.add('anim-pop-out');

        setTimeout(() => {
            hideEl.classList.add('hidden');
            hideEl.classList.remove('anim-pop-out');

            showEl.classList.remove('hidden');
            showEl.classList.add('anim-pop-in');
        }, 200); // 200ms matches the ease-in out duration
    }

    // Helper function for loading screen
    function showLoadingOverlay(callback) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingBarFill = document.getElementById('loadingBarFill');

        if (loadingOverlay && loadingBarFill) {
            loadingOverlay.classList.remove('hidden');

            // Trigger animation after a tiny delay to ensure browser paints the un-hidden overlay
            setTimeout(() => {
                loadingBarFill.style.width = '100%';
            }, 50);

            // Wait for simulated loading time (e.g. 2.5 seconds)
            setTimeout(() => {
                if (callback) callback();
            }, 2500);
        } else {
            // Fallback if elements are missing
            if (callback) callback();
        }
    }

    if (mainLoginBtn && centerPiece && loginModal && modalBackBtn) {
        mainLoginBtn.addEventListener('click', () => {
            switchViews(centerPiece, loginModal);
        });

        modalBackBtn.addEventListener('click', () => {
            switchViews(loginModal, centerPiece);
        });

        const showLoginPasswordToggle = document.getElementById('showLoginPasswordToggle');
        if (showLoginPasswordToggle && loginPassword) {
            showLoginPasswordToggle.addEventListener('change', () => {
                loginPassword.type = showLoginPasswordToggle.checked ? 'text' : 'password';
            });
        }

        if (loginSubmitBtn && loginUsername && loginPassword) {
            loginSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const inputUsername = loginUsername.value.trim();
                const inputPassword = loginPassword.value;

                // Retrieve saved user data from LocalStorage
                const savedUsersStr = localStorage.getItem('cartuninz_users');
                let savedUsers = {};
                if (savedUsersStr) {
                    savedUsers = JSON.parse(savedUsersStr);
                }

                // Check if the user exists and the password matches
                if (savedUsers[inputUsername] && savedUsers[inputUsername].password === inputPassword) {
                    if (savedUsers[inputUsername].newAccount) {
                        currentSetupUser = inputUsername;
                        switchViews(loginModal, setupNameModal);
                        // Reset input forms
                        loginUsername.value = '';
                        loginPassword.value = '';
                        if (showLoginPasswordToggle) {
                            showLoginPasswordToggle.checked = false;
                            loginPassword.type = 'password';
                        }
                    } else {
                        // Update current active user and redirect
                        localStorage.setItem('cartuninz_active_user', inputUsername);
                        showLoadingOverlay(() => {
                            window.location.href = 'lobby.html';
                        });
                    }
                } else {
                    // Show custom notification instead of native alert
                    const notificationModal = document.getElementById('notificationModal');
                    const notificationTitle = document.getElementById('notificationTitle');
                    const notificationMessage = document.getElementById('notificationMessage');
                    const notificationOkBtn = document.getElementById('notificationOkBtn');

                    if (notificationModal && notificationTitle && notificationMessage && notificationOkBtn) {
                        notificationTitle.textContent = "ERROR";
                        notificationMessage.innerHTML = "Invalid username or password!<br>Please try again.";
                        switchViews(loginModal, notificationModal);

                        notificationOkBtn.onclick = () => {
                            switchViews(notificationModal, loginModal);
                        };
                    } else {
                        // Fallback
                        alert('Invalid username or password! please try again');
                    }
                }
            });
        }
    }

    if (setupNameSubmitBtn && setupGameName) {
        setupNameSubmitBtn.addEventListener('click', () => {
            const gameName = setupGameName.value.trim();
            if (!gameName) return;

            const savedUsersStr = localStorage.getItem('cartuninz_users');
            let savedUsers = JSON.parse(savedUsersStr || '{}');

            // Case-insensitive check and also check against dummy array from lobby.js if needed
            const takenUsernames = ['admin', 'guest', 'player1', 'carltunz'];

            // It is taken if:
            // 1. It is in the dummy takenUsernames array
            // 2. OR it exists in savedUsers AND it does NOT belong to the current user setting up their account
            const isTaken = takenUsernames.some(u => u.toLowerCase() === gameName.toLowerCase()) ||
                (Object.keys(savedUsers).some(k => k.toLowerCase() === gameName.toLowerCase()) &&
                    gameName.toLowerCase() !== currentSetupUser.toLowerCase());

            if (isTaken) {
                if (setupNameErrorMsg) setupNameErrorMsg.classList.remove('hidden');
                return;
            }

            // Migrate user to new game name
            let sourceUser = savedUsers[currentSetupUser] || {
                email: 'test@example.com',
                password: '123',
                rank: 'NEWBIE',
                level: 1
            };

            savedUsers[gameName] = sourceUser;

            if (currentSetupUser !== gameName && savedUsers[currentSetupUser]) {
                delete savedUsers[currentSetupUser];
            }

            if (savedUsers[gameName]) {
                delete savedUsers[gameName].newAccount;
            }

            localStorage.setItem('cartuninz_users', JSON.stringify(savedUsers));
            localStorage.setItem('cartuninz_active_user', gameName);

            showLoadingOverlay(() => {
                window.location.href = 'lobby.html';
            });
        });

        setupGameName.addEventListener('input', () => {
            if (setupNameErrorMsg) setupNameErrorMsg.classList.add('hidden');
        });
    }

    if (mainSignupBtn && centerPiece && signupModal && signupBackBtn) {
        mainSignupBtn.addEventListener('click', () => {
            switchViews(centerPiece, signupModal);
        });

        signupBackBtn.addEventListener('click', () => {
            switchViews(signupModal, centerPiece);
        });

        if (signupSubmitBtn) {
            signupSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const user = signupUsername.value.trim();
                const email = signupEmail.value.trim();
                const pass = signupPassword.value;
                const confirm = signupConfirm.value;

                if (!user || !email || !pass) {
                    alert('Please fill in all fields.');
                    return;
                }

                if (pass !== confirm) {
                    alert('Passwords do not match!');
                    return;
                }

                if (!email.endsWith('@gmail.com')) {
                    alert('Please provide a valid @gmail.com address.');
                    return;
                }

                // Retrieve existing DB
                const savedUsersStr = localStorage.getItem('cartuninz_users');
                let savedUsers = {};
                if (savedUsersStr) {
                    savedUsers = JSON.parse(savedUsersStr);
                }

                // Check if the email is already in use
                let emailInUse = false;
                for (const existingUsername in savedUsers) {
                    if (savedUsers[existingUsername].email === email) {
                        emailInUse = true;
                        break;
                    }
                }

                if (emailInUse) {
                    alert('This E-mail is already registered to another account!');
                    return;
                }

                if (savedUsers[user]) {
                    alert('Username already exists! Please choose another.');
                    return;
                }

                // Save new user
                savedUsers[user] = {
                    email: email,
                    password: pass,
                    rank: 'NEWBIE',
                    level: 1,
                    newAccount: true
                };

                localStorage.setItem('cartuninz_users', JSON.stringify(savedUsers));

                // Show custom notification instead of native alert
                const notificationModal = document.getElementById('notificationModal');
                const notificationTitle = document.getElementById('notificationTitle');
                const notificationMessage = document.getElementById('notificationMessage');
                const notificationOkBtn = document.getElementById('notificationOkBtn');

                if (notificationModal && notificationOkBtn && notificationTitle && notificationMessage) {
                    notificationTitle.textContent = "SUCCESS";
                    notificationMessage.textContent = "Account created successfully!";
                    switchViews(signupModal, notificationModal);

                    // Allow one-time click on OK to proceed to game name setup
                    notificationOkBtn.onclick = () => {
                        currentSetupUser = user;
                        switchViews(notificationModal, setupNameModal);
                    };
                } else {
                    // Fallback just in case
                    currentSetupUser = user;
                    switchViews(signupModal, setupNameModal);
                }

                // Reset form
                signupUsername.value = '';
                signupEmail.value = '';
                signupPassword.value = '';
                signupConfirm.value = '';
                if (showPasswordToggle) {
                    showPasswordToggle.checked = false;
                    signupPassword.type = 'password';
                    signupConfirm.type = 'password';
                }
            });
        }
    }
});
