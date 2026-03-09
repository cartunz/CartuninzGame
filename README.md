Cartuninz/
├── index.html          ← Landing page (Login/Signup entry point)
├── login.html          ← Standalone login page
├── signup.html         ← Standalone signup page
├── game.html           ← Main game lobby (was lobby.html)
├── profile.html        ← Player profile page
├── inventory.html      ← Player inventory page
├── shop.html           ← Item shop
├── events.html         ← Game events
├── quest.html          ← Player quests
├── guild.html          ← Guild system
├── settings.html       ← Player settings
├── battle.html         ← Combat system (BATTLE button ✅)
│
├── js/                 ← JavaScript Modules
│   ├── ui.js           ← Shared helpers (toggleModal, switchViews, loading overlay, auth)
│   ├── auth.js         ← Login, signup, game name setup
│   ├── player.js       ← Profile, name change
│   ├── inventory.js    ← Character/Bag modal
│   ├── settings.js     ← Settings modal tabs/toggles
│   ├── friends.js      ← Friends list & search
│   ├── combat.js       ← Turn-based battle system
│   ├── shop.js         ← Item shop with filters
│   ├── events.js       ← Game events display
│   ├── quest.js        ← Quest progress tracking
│   ├── guild.js        ← Guild list and join feature
│   └── lobby.js        ← Lobby orchestrator (game.html)
│
├── css/                ← Stylesheets
│   ├── global.css      ← Shared base styles, animations, utilities
│   └── pages.css       ← All standalone page styles
│
├── style.css           ← Landing page styles (unchanged)
└── lobby.css           ← Lobby styles (unchanged, still used by game.html)
