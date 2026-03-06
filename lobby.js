document.addEventListener('DOMContentLoaded', () => {
    const lobbyUsername = document.getElementById('lobbyUsername');
    let activeUser = localStorage.getItem('cartuninz_active_user');

    // Retrieve active user data
    const savedUsersStr = localStorage.getItem('cartuninz_users');
    let activeUserData = { rank: 'NEWBIE', level: 1 };

    if (savedUsersStr && activeUser) {
        const savedUsers = JSON.parse(savedUsersStr);
        if (savedUsers[activeUser]) {
            activeUserData = savedUsers[activeUser];
            // Ensure they have level and rank initialized
            if (!activeUserData.level) activeUserData.level = 1;
            if (!activeUserData.rank) activeUserData.rank = 'NEWBIE';
        }
    }

    const lobbyRank = document.querySelector('.user-details .rank');

    if (lobbyUsername && activeUser) {
        lobbyUsername.textContent = activeUser.toUpperCase();
        if (lobbyRank) {
            lobbyRank.textContent = `Lv. ${activeUserData.level} ${activeUserData.rank}`;
        }
    } else {
        window.location.href = 'index.html';
        return; // Stop execution if no user
    }

    // --- Character Modal Logic ---
    const navCharacterBtn = document.getElementById('navCharacterBtn');
    const navQuestBtn = document.getElementById('navQuestBtn');
    const navGuildBtn = document.getElementById('navGuildBtn');
    const navShopBtn = document.getElementById('navShopBtn');
    const inventoryBtn = document.getElementById('inventoryBtn');
    const userInfoBtn = document.querySelector('.user-info');

    // Character Modal Elements
    const characterModal = document.getElementById('characterModal');
    const charCloseBtn = document.getElementById('charCloseBtn');
    const charNameDisplay = document.querySelector('.char-name-display');

    // Profile Modal Elements
    const profileModal = document.getElementById('profileModal');
    const profileCloseBtn = document.getElementById('profileCloseBtn');
    const profileNameLarge = document.querySelector('.profile-name-large');
    const profileRankLarge = document.querySelector('.profile-rank-large');
    const editNameBtn = document.querySelector('.edit-name-btn');

    // Change Name Modal Elements
    const changeNameModal = document.getElementById('changeNameModal');
    const newNameInput = document.getElementById('newNameInput');
    const cancelNameBtn = document.getElementById('cancelNameBtn');
    const confirmNameBtn = document.getElementById('confirmNameBtn');
    const nameErrorMsg = document.getElementById('nameErrorMsg');

    // Coming Soon Modal Elements
    const comingSoonCloseBtn = document.getElementById('comingSoonCloseBtn');

    // Friends Modal Elements
    const navFriendsBtn = document.getElementById('navFriendsBtn');
    const friendsModal = document.getElementById('friendsModal');
    const friendsCloseBtn = document.getElementById('friendsCloseBtn');
    const friendsSearchInput = document.getElementById('friendsSearchInput');
    const friendsSearchBtn = document.getElementById('friendsSearchBtn');
    const friendsSearchResults = document.getElementById('friendsSearchResults');
    const friendsEmptyState = document.getElementById('friendsEmptyState');

    // Dummy array of taken usernames
    const takenUsernames = ['admin', 'guest', 'player1', 'carltunz'];

    // HUD Elements to update
    const hudUsername = document.querySelector('.username');

    // Helper function for transitions
    function toggleModal(modal, show) {
        if (show) {
            modal.classList.remove('hidden');
            modal.classList.remove('anim-pop-out');
            modal.classList.add('anim-pop-in');
        } else {
            modal.classList.remove('anim-pop-in');
            modal.classList.add('anim-pop-out');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('anim-pop-out');
            }, 200);
        }
    }

    // Open Character Modal to BAG tab (from Inventory btn)
    if (inventoryBtn && characterModal && charCloseBtn) {
        // Shared close listener for Character Modal
        charCloseBtn.addEventListener('click', () => {
            toggleModal(characterModal, false);
        });

        inventoryBtn.addEventListener('click', () => {
            if (charNameDisplay) {
                charNameDisplay.textContent = activeUser;
            }
            toggleModal(characterModal, true);

            // Switch to BAG tab automatically
            const charTabs = document.querySelectorAll('.char-tab');
            const paneCharacter = document.getElementById('paneCharacter');
            const paneBag = document.getElementById('paneBag');

            if (charTabs.length >= 2 && paneCharacter && paneBag) {
                // Remove active tabs
                charTabs.forEach(t => t.classList.remove('active'));

                // Add active to BAG tab (assuming it's the 2nd one)
                charTabs[1].classList.add('active');

                // Show Bag Pane
                paneCharacter.classList.add('hidden-pane');
                paneCharacter.classList.remove('active-pane');
                paneBag.classList.remove('hidden-pane');
                paneBag.classList.add('active-pane');
            }
        });
    }

    // Open Coming Soon Modal (from side nav)
    if (comingSoonModal && comingSoonCloseBtn && comingSoonTitle) {
        if (navQuestBtn) {
            navQuestBtn.addEventListener('click', () => {
                comingSoonTitle.textContent = 'QUESTS COMING SOON';
                toggleModal(comingSoonModal, true);
            });
        }
        if (navGuildBtn) {
            navGuildBtn.addEventListener('click', () => {
                comingSoonTitle.textContent = 'GUILD COMING SOON';
                toggleModal(comingSoonModal, true);
            });
        }
        if (navShopBtn) {
            navShopBtn.addEventListener('click', () => {
                comingSoonTitle.textContent = 'SHOP COMING SOON';
                toggleModal(comingSoonModal, true);
            });
        }

        comingSoonCloseBtn.addEventListener('click', () => {
            toggleModal(comingSoonModal, false);
        });
    }

    // Open Friends Modal (from side nav)
    if (navFriendsBtn && friendsModal && friendsCloseBtn) {
        navFriendsBtn.addEventListener('click', () => {
            toggleModal(friendsModal, true);
        });

        friendsCloseBtn.addEventListener('click', () => {
            toggleModal(friendsModal, false);
        });

        // Search Logic
        friendsSearchBtn.addEventListener('click', () => {
            const query = friendsSearchInput.value.trim().toLowerCase();
            if (!query) return;

            // Clear previous results
            friendsSearchResults.innerHTML = '';
            friendsSearchResults.classList.remove('hidden');
            friendsEmptyState.classList.add('hidden');

            const savedUsers = JSON.parse(localStorage.getItem('cartuninz_users') || '{}');
            const foundUsers = Object.keys(savedUsers).filter(username =>
                username.toLowerCase().includes(query) && username.toLowerCase() !== activeUser.toLowerCase()
            );

            if (foundUsers.length > 0) {
                foundUsers.forEach(username => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <div class="result-user-info">
                            <div class="result-avatar">${username.charAt(0).toUpperCase()}</div>
                            <div class="result-username">${username.toUpperCase()}</div>
                        </div>
                        <button class="add-friend-btn">ADD</button>
                    `;

                    // Add dummy functionality to the ADD button
                    const addBtn = resultItem.querySelector('.add-friend-btn');
                    addBtn.onclick = () => {
                        addBtn.textContent = 'PENDING';
                        addBtn.disabled = true;
                        addBtn.style.filter = 'grayscale(1)';
                    };

                    friendsSearchResults.appendChild(resultItem);
                });
            } else {
                friendsSearchResults.innerHTML = '<div class="no-results-text">No users found matching "' + query + '"</div>';
            }
        });
    }

    // Open Profile Modal (from top left profile block)
    if (userInfoBtn && profileModal && profileCloseBtn) {
        userInfoBtn.addEventListener('click', () => {
            if (profileNameLarge) {
                profileNameLarge.textContent = activeUser;
            }
            if (profileRankLarge) {
                profileRankLarge.textContent = `Lv. ${activeUserData.level} ${activeUserData.rank}`;
            }
            toggleModal(profileModal, true);
        });

        profileCloseBtn.addEventListener('click', () => {
            toggleModal(profileModal, false);
        });
    }

    // Change Name Logic
    if (editNameBtn && changeNameModal && cancelNameBtn && confirmNameBtn) {
        editNameBtn.addEventListener('click', () => {
            let changeCount = activeUserData.nameChanges || 0;

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
            toggleModal(changeNameModal, true);
        });

        cancelNameBtn.addEventListener('click', () => {
            toggleModal(changeNameModal, false);
        });

        confirmNameBtn.addEventListener('click', () => {
            const newName = newNameInput.value.trim();
            if (newName.length > 0) {
                // Determine if the name is already taken
                let isTaken = takenUsernames.includes(newName.toLowerCase());

                // Also check against registered accounts in localStorage
                const savedUsersStr = localStorage.getItem('cartuninz_users');
                if (savedUsersStr) {
                    const savedUsers = JSON.parse(savedUsersStr);
                    // Check if any existing account matches the new name (case insensitive)
                    // Note: ignore the current active User's name just in case
                    isTaken = isTaken || Object.keys(savedUsers).some(k =>
                        k.toLowerCase() === newName.toLowerCase() && k.toLowerCase() !== activeUser.toLowerCase()
                    );
                }

                if (isTaken) {
                    if (nameErrorMsg) {
                        nameErrorMsg.textContent = "Username use already";
                        nameErrorMsg.classList.remove('hidden');
                    }
                    return; // Stop execution, don't close modal or save
                }

                // Increment change count on user object
                let changeCount = activeUserData.nameChanges || 0;
                activeUserData.nameChanges = changeCount + 1;

                // Migrate user data to new name in localStorage map
                const currentUserStr = localStorage.getItem('cartuninz_users');
                if (currentUserStr) {
                    let usersMap = JSON.parse(currentUserStr);
                    if (usersMap[activeUser]) {
                        usersMap[newName] = activeUserData; // save updated object with nameChanges
                        delete usersMap[activeUser];
                        localStorage.setItem('cartuninz_users', JSON.stringify(usersMap));
                    }
                }

                // Update active user state
                activeUser = newName;
                localStorage.setItem('cartuninz_active_user', newName);

                // Update UI elements
                if (hudUsername) hudUsername.textContent = newName;
                if (profileNameLarge) profileNameLarge.textContent = newName;
                if (charNameDisplay) charNameDisplay.textContent = newName;

                // Hide modal and error
                toggleModal(changeNameModal, false);
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
            toggleModal(settingsModal, true);
        });

        settingsCloseBtn.addEventListener('click', () => {
            toggleModal(settingsModal, false);
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
