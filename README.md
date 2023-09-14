# Tic-Tac-Toe Multiplayer Game

This is a simple multiplayer Tic-Tac-Toe game built using React.js and Socket.io. It allows two players to play the classic game of Tic-Tac-Toe in real-time over the internet. Players can take turns to make moves, and the game will display the winner or a draw when the game ends.

## Table of Contents

- [Demo](#demo)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)

## Demo

You can play a live demo of the game at [Tic-Tac-Toe Multiplayer](https://nil1729-in-memory-tic-tac-toe.netlify.app).

## Getting Started

To run this game locally or deploy it to your own server, follow these steps:

1. **Clone the Repository:**

   ```bash
    git clone https://github.com/nil1729/in-memory-socket-server
    cd in-memory-socket-server
   ```

2. **Install Dependencies:**

   Use npm or yarn to install the required dependencies.

   ```bash
    npm install && npm run setup:frontend
   ```

3. **Start the Development Server:**

   Start the backend server to run the app locally.

   ```bash
    npm run start:dev
   ```

   And start the frontend react application locally.

   ```bash
    npm run start:frontend
   ```

## Usage

Once you have the game running, here's how to use it:

1. Open the game in a web browser.
2. Share the game URL with a friend or open it in another browser to play against yourself.
3. Players can take turns clicking on the board to place their X or O.
4. The game will automatically detect if someone has won or if it's a draw.
5. Enjoy playing Tic-Tac-Toe!

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
