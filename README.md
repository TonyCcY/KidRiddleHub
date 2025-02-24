# Kid Riddle Hub 🎯

A fun and interactive riddle game designed for kids, built with Node.js and Express. Perfect for family entertainment and educational purposes.

## Features 🌟

- Interactive riddle display with reveal-answer functionality
- Comprehensive riddle management system (add, delete, browse)
- AJAX-based pagination for smooth navigation
- Duplicate riddle detection
- Mobile-responsive design
- Kid-friendly interface with emoji support
- JSON-based storage for easy deployment

## Installation 🚀

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/kid-riddle-hub.git
    cd kid-riddle-hub
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    node server.js
    ```

4. Visit http://localhost:3000 in your browser

## Usage 📖

### Playing Riddles
- Visit the homepage for a random riddle
- Click "Show Answer" to reveal the solution
- Click "Get Another Riddle" for a new challenge
- Navigate to management page via the link at bottom

### Managing Riddles
- Visit /manage to access the admin interface
- Add new riddles with question and answer fields
- Browse existing riddles with pagination
- Delete unwanted riddles with confirmation
- Automatic duplicate checking prevents repeats

## Project Structure 📁

    kid-riddle-hub/
    ├── public/
    │   └── styles.css         # Global styles
    ├── views/
    │   ├── display.ejs        # Riddle display page
    │   └── manage.ejs         # Management interface
    ├── server.js             # Express server setup
    ├── riddles.json          # Riddle storage
    ├── package.json          # Project dependencies
    └── README.md             # Documentation

## Technical Stack 🛠

### Frontend
- HTML5/CSS3 for structure and styling
- Vanilla JavaScript for interactivity
- EJS templating engine
- Mobile-first responsive design

### Backend
- Node.js runtime environment
- Express.js web framework
- File-based JSON storage
- RESTful API architecture

## API Endpoints 🔌

- `GET /` - Display random riddle
- `GET /manage` - Management interface
- `POST /add-riddle` - Add new riddle
- `DELETE /delete-riddle/:index` - Remove riddle
- `GET /api/riddles` - Fetch paginated riddles

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Emoji graphics provided by [OpenMoji](https://openmoji.org/)
- Riddle content curated for kid-friendly entertainment
- Special thanks to all contributors and users

## Contact 📧

Your Name - [@TonyCcY](https://twitter.com/TonyCcY)
Project Link: [https://github.com/TonyCcY/KidRiddleHub](https://github.com/TonyCcY/KidRiddleHub)