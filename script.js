document.addEventListener('DOMContentLoaded', () => {
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

    // --- Initialize default user for testing ---
    let initialUsersStr = localStorage.getItem('cartuninz_users');
    let initialUsers = initialUsersStr ? JSON.parse(initialUsersStr) : {};
    if (!initialUsers['carltunz']) {
        initialUsers['carltunz'] = {
            email: 'carltunz@example.com',
            password: '12345',
            rank: 'BRONZE I'
        };
        localStorage.setItem('cartuninz_users', JSON.stringify(initialUsers));
    }
    // -------------------------------------------

    if (mainLoginBtn && centerPiece && loginModal && modalBackBtn) {
        mainLoginBtn.addEventListener('click', () => {
            centerPiece.classList.add('hidden');
            loginModal.classList.remove('hidden');
        });

        modalBackBtn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
            centerPiece.classList.remove('hidden');
        });

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
                    // Update current active user and redirect
                    localStorage.setItem('cartuninz_active_user', inputUsername);
                    window.location.href = 'lobby.html';
                } else {
                    alert('Invalid username or password!');
                }
            });
        }
    }

    if (mainSignupBtn && centerPiece && signupModal && signupBackBtn) {
        mainSignupBtn.addEventListener('click', () => {
            centerPiece.classList.add('hidden');
            signupModal.classList.remove('hidden');
        });

        signupBackBtn.addEventListener('click', () => {
            signupModal.classList.add('hidden');
            centerPiece.classList.remove('hidden');
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
                    rank: 'BRONZE I'
                };

                localStorage.setItem('cartuninz_users', JSON.stringify(savedUsers));
                alert('Account created successfully! You can now log in.');

                // Reset form and go back to main screen
                signupUsername.value = '';
                signupEmail.value = '';
                signupPassword.value = '';
                signupConfirm.value = '';
                signupModal.classList.add('hidden');
                centerPiece.classList.remove('hidden');
            });
        }
    }
});
