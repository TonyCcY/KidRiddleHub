# Kid Riddle Hub 🎯

A fun and interactive web application for kids to enjoy riddles! Built with Node.js, Express, and MongoDB.

## 🌟 Features

- Random riddle display with animated reveal
- Riddle management system (add/delete)
- Import/Export riddles in JSON format
- Real-time active user counter
- Total visits tracker
- Mobile-responsive design
- MongoDB database integration

## 🚀 Live Demo

Visit [Kid Riddle Hub](https://kid-riddle-hub.vercel.app/) to see the app in action!

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Template Engine**: EJS
- **Deployment**: Vercel
- **Version Control**: Git

## 💻 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/TonyCcY/KidRiddleHub.git
   cd KidRiddleHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Visit `http://localhost:3000` in your browser

## 📁 Project Structure

```
kid-riddle-hub/
├── public/
│   └── styles.css
├── views/
│   ├── display.ejs
│   └── manage.ejs
├── server.js
├── package.json
├── vercel.json
└── .env
```

## 🎮 Usage

- **View Riddles**: Visit the home page to see a random riddle
- **Manage Riddles**: Click "Manage Riddles" to add or delete riddles
- **Import/Export**: Use the buttons in the manage page to import/export riddles
- **Show Answer**: Click the button to reveal the riddle's answer
- **Get Another**: Click "Get Another Riddle" for a new random riddle

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Tony Chan
- GitHub: [@TonyCcY](https://github.com/TonyCcY)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Vercel for deployment
- Express.js community