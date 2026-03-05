document.addEventListener('DOMContentLoaded', () => {
    const lobbyUsername = document.getElementById('lobbyUsername');
    let activeUser = localStorage.getItem('cartuninz_active_user');

    if (lobbyUsername && activeUser) {
        lobbyUsername.textContent = activeUser.toUpperCase();
    } else {
        window.location.href = 'index.html';
        return; // Stop execution if no user
    }

    // --- Character Modal Logic ---
    const navCharacterBtn = document.getElementById('navCharacterBtn');
    const userInfoBtn = document.querySelector('.user-info');

    // Character Modal Elements
    const characterModal = document.getElementById('characterModal');
    const charCloseBtn = document.getElementById('charCloseBtn');
    const charNameDisplay = document.querySelector('.char-name-display');

    // Profile Modal Elements
    const profileModal = document.getElementById('profileModal');
    const profileCloseBtn = document.getElementById('profileCloseBtn');
    const profileNameLarge = document.querySelector('.profile-name-large');
    const editNameBtn = document.querySelector('.edit-name-btn');

    // Change Name Modal Elements
    const changeNameModal = document.getElementById('changeNameModal');
    const newNameInput = document.getElementById('newNameInput');
    const cancelNameBtn = document.getElementById('cancelNameBtn');
    const confirmNameBtn = document.getElementById('confirmNameBtn');
    const nameErrorMsg = document.getElementById('nameErrorMsg');

    // Dummy array of taken usernames
    const takenUsernames = ['admin', 'guest', 'player1', 'carltunz'];

    // HUD Elements to update
    const hudUsername = document.querySelector('.username');

    // Open Character Modal (from side nav)
    if (navCharacterBtn && characterModal && charCloseBtn) {
        navCharacterBtn.addEventListener('click', () => {
            if (charNameDisplay) {
                charNameDisplay.textContent = activeUser;
            }
            characterModal.classList.remove('hidden');
        });

        charCloseBtn.addEventListener('click', () => {
            characterModal.classList.add('hidden');
        });
    }

    // Open Profile Modal (from top left profile block)
    if (userInfoBtn && profileModal && profileCloseBtn) {
        userInfoBtn.addEventListener('click', () => {
            if (profileNameLarge) {
                profileNameLarge.textContent = activeUser;
            }
            profileModal.classList.remove('hidden');
        });

        profileCloseBtn.addEventListener('click', () => {
            profileModal.classList.add('hidden');
        });
    }

    // Change Name Logic
    if (editNameBtn && changeNameModal && cancelNameBtn && confirmNameBtn) {
        editNameBtn.addEventListener('click', () => {
            let changeCount = parseInt(localStorage.getItem('cartuninz_name_changes') || '0');

            if (changeCount >= 2) {
                // User has reached the limit, show error on the profile modal instead of opening the change modal
                if (nameErrorMsg) {
                    nameErrorMsg.textContent = "You have reached the maximum name changes (2/2).";
                    nameErrorMsg.classList.remove('hidden');

                    // Temporarily move the error message to the profile modal just below the edit button
                    const nameRow = document.querySelector('.profile-name-row');
                    if (nameRow && !nameRow.nextElementSibling.classList.contains('change-name-error')) {
                        const errorClone = nameErrorMsg.cloneNode(true);
                        errorClone.id = 'profileNameErrorMsg'; // ensure unique ID
                        nameRow.parentNode.insertBefore(errorClone, nameRow.nextSibling);

                        // Auto-hide after 3 seconds
                        setTimeout(() => {
                            if (errorClone.parentNode) {
                                errorClone.parentNode.removeChild(errorClone);
                            }
                        }, 3000);
                    }
                }
                return;
            }

            // Allowed to change name
            newNameInput.value = ''; // clear previous input
            if (nameErrorMsg) nameErrorMsg.classList.add('hidden'); // hide error on open
            changeNameModal.classList.remove('hidden');
        });

        cancelNameBtn.addEventListener('click', () => {
            changeNameModal.classList.add('hidden');
        });

        confirmNameBtn.addEventListener('click', () => {
            const newName = newNameInput.value.trim();
            if (newName.length > 0) {
                // Check if the username is already taken
                if (takenUsernames.includes(newName.toLowerCase())) {
                    if (nameErrorMsg) {
                        nameErrorMsg.textContent = "Username use already";
                        nameErrorMsg.classList.remove('hidden');
                    }
                    return; // Stop execution, don't close modal or save
                }

                // Update active user state
                activeUser = newName;
                localStorage.setItem('cartuninz_active_user', newName);

                // Increment change count
                let changeCount = parseInt(localStorage.getItem('cartuninz_name_changes') || '0');
                localStorage.setItem('cartuninz_name_changes', (changeCount + 1).toString());

                // Update UI elements
                if (hudUsername) hudUsername.textContent = newName;
                if (profileNameLarge) profileNameLarge.textContent = newName;
                if (charNameDisplay) charNameDisplay.textContent = newName;

                // Hide modal and error
                changeNameModal.classList.add('hidden');
                if (nameErrorMsg) nameErrorMsg.classList.add('hidden');
            }
        });

        // Hide error message when user starts typing again
        newNameInput.addEventListener('input', () => {
            if (nameErrorMsg) nameErrorMsg.classList.add('hidden');
        });
    }

    // Modal Tab Switching Logic
    const paneCharacter = document.getElementById('paneCharacter');
    const paneBag = document.getElementById('paneBag');
    const charTabs = document.querySelectorAll('.char-tab');

    if (charTabs.length > 0) {
        charTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Clear active styling from all tabs
                charTabs.forEach(t => t.classList.remove('active'));

                // Add active styling to clicked tab
                tab.classList.add('active');

                // Determine which tab was clicked
                const tabName = tab.textContent.trim().toUpperCase();

                if (tabName === 'CHARACTER') {
                    if (paneCharacter && paneBag) {
                        paneBag.classList.add('hidden-pane');
                        paneBag.classList.remove('active-pane');
                        paneCharacter.classList.remove('hidden-pane');
                        paneCharacter.classList.add('active-pane');
                    }
                } else if (tabName === 'BAG') {
                    if (paneCharacter && paneBag) {
                        paneCharacter.classList.add('hidden-pane');
                        paneCharacter.classList.remove('active-pane');
                        paneBag.classList.remove('hidden-pane');
                        paneBag.classList.add('active-pane');
                    }
                }
            });
        });
    }

    // Inner Grid Tab Switching Logic (All, Male, Female)
    const gridTabs = document.querySelectorAll('.grid-tab');
    if (gridTabs.length > 0) {
        gridTabs.forEach(gridTab => {
            gridTab.addEventListener('click', () => {
                // Clear active styling from all grid tabs
                gridTabs.forEach(t => t.classList.remove('active'));

                // Add active styling to clicked grid tab
                gridTab.classList.add('active');
            });
        });
    }

    // --- Settings Modal Logic ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.getElementById('settingsCloseBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const choiceBtns = document.querySelectorAll('.choice-btn');

    if (hamburgerMenu && settingsModal && settingsCloseBtn) {
        hamburgerMenu.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });

        settingsCloseBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('cartuninz_active_user');
            window.location.href = 'index.html';
        });
    }

    if (toggleBtns.length > 0) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('off');
                if (btn.classList.contains('off')) {
                    btn.textContent = 'OFF';
                } else {
                    btn.textContent = 'ON';
                }
            });
        });
    }

    if (choiceBtns.length > 0) {
        choiceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const group = e.target.closest('.btn-group');
                if (group) {
                    const peers = group.querySelectorAll('.choice-btn');
                    peers.forEach(p => p.classList.remove('active'));
                }
                btn.classList.add('active');
            });
        });
    }

    // Settings Tab Switching Logic
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanes = document.querySelectorAll('.settings-pane');

    if (settingsTabs.length > 0) {
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active styling from all tabs
                settingsTabs.forEach(t => t.classList.remove('active'));

                // Add active styling to clicked tab
                tab.classList.add('active');

                // Hide all panes
                settingsPanes.forEach(pane => {
                    pane.classList.add('hidden-pane');
                    pane.classList.remove('active-pane');
                });

                // Show target pane
                const targetId = tab.getAttribute('data-target');
                if (targetId) {
                    const targetPane = document.getElementById(targetId);
                    if (targetPane) {
                        targetPane.classList.remove('hidden-pane');
                        targetPane.classList.add('active-pane');
                    }
                }
            });
        });
    }
});
