const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHanlder');
const cors = require('cors');
const PORT = process.env.PORT || 5050;
const { createServer } = require('http');
const { Server } = require('socket.io');
const uuid = require('uuid');

const GAMES = {
	// "game_id": {
	//  	game_id,
	//		users: {}
	//		owner: socket_id
	// 		board_state: [0, 0, 0, 0, 0, 0, 0, 0, 0]
	//		current_turn: user_object
	//		playing: false
	//		winner: null
	// }
};

// const winner_check = (board_state) => {
// 	let board_state_map = {};
// 	board_state.forEach((item, index) => {
// 		board_state_map[index] = item;
// 	});

// 	if(board_state_map[])
// }

// Initialize App
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
});

// Logging Middleware
app.use(morgan('dev'));

// Body Parser Setup
app.use(express.json());

// Enable Cors
app.use(cors());

// Error Handler Middleware
app.use(errorHandler);

// Serve "Public" folder as a static directory
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
	socket.on('create_game', (message, cb) => {
		let game_id = uuid.v4();
		while (GAMES[game_id]) game_id = uuid.v4();

		const game_object = {
			game_id,
			users: {},
			owner: socket.id,
			board_state: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			current_turn: null,
			playing: null,
			winner: null,
		};

		GAMES[game_id] = game_object;

		const my_games = Object.keys(GAMES)
			.map((it) => {
				if (GAMES[it].owner === socket.id) return GAMES[it];
				else return null;
			})
			.filter((it) => it !== null);

		socket.emit('my_games', JSON.stringify(my_games));

		cb();
	});

	socket.on('join_game', (game_id, cb) => {
		const game_object = GAMES[game_id];

		if (!game_object) {
			cb({
				error: 'Invalid Game ID',
			});
			return;
		}

		if (!game_object.users[socket.id]) {
			const current_users_count = Object.keys(game_object.users).length;

			const user_object = {
				user_id: socket.id,
				user_type: current_users_count >= 2 ? 'stalk' : 'player',
				user_icon: current_users_count === 0 ? 'X' : current_users_count === 1 ? 'O' : null,
			};

			game_object.users[socket.id] = user_object;
			const owner_id = game_object.owner;

			const my_joined_games = Object.keys(GAMES)
				.map((it) => {
					if (GAMES[it].users[socket.id]) return GAMES[it];
					else return null;
				})
				.filter((it) => it !== null);

			const owner_games = Object.keys(GAMES)
				.map((it) => {
					if (GAMES[it].owner === owner_id) return GAMES[it];
					else return null;
				})
				.filter((it) => it !== null);

			socket.emit('my_joined_games', JSON.stringify(my_joined_games));
			socket.to(owner_id).emit('my_games', JSON.stringify(owner_games));
			Object.keys(game_object.users).forEach((user_socket_id) => {
				socket.to(user_socket_id).emit('my_current_game', JSON.stringify(game_object));
			});
		}

		cb({
			game_state: game_object,
		});
	});

	socket.on('start_game', (game_id, cb) => {
		const game_object = GAMES[game_id];

		if (
			!game_object ||
			(game_object && Object.keys(game_object.users).length < 2) ||
			(game_object && game_object.users[socket.id].user_type !== 'player') ||
			(game_object && game_object.playing)
		) {
			cb({
				error: 'Invalid Command',
			});
			return;
		}

		game_object.playing = true;
		game_object.current_turn = game_object.users[socket.id];

		Object.keys(game_object.users).forEach((user_socket_id) => {
			socket.to(user_socket_id).emit('my_current_game', JSON.stringify(game_object));
		});

		cb({
			game_state: game_object,
		});
	});

	socket.on('play_game', (data, cb) => {
		const game_object = GAMES[data.game_id];

		if (
			!game_object ||
			data.board_index >= 9 ||
			(game_object && Object.keys(game_object.users).length < 2) ||
			(game_object && game_object.users[socket.id].user_type !== 'player') ||
			(game_object && !game_object.playing) ||
			(game_object && game_object.board_state[data.board_index] !== 0)
		) {
			cb({
				error: 'Invalid Command',
			});
			return;
		}

		const second_player_id = Object.keys(game_object.users).find(
			(key) => game_object.users[key].user_type === 'player' && key !== socket.id
		);
		game_object.current_turn = game_object.users[second_player_id];
		game_object.board_state[data.board_index] = game_object.users[socket.id];

		// Winner Check

		Object.keys(game_object.users).forEach((user_socket_id) => {
			socket.to(user_socket_id).emit('my_current_game', JSON.stringify(game_object));
		});

		cb({
			game_state: game_object,
		});
	});

	socket.on('disconnect', () => {
		const owner_ids = {};

		Object.keys(GAMES).forEach((it) => {
			if (GAMES[it].users[socket.id]) {
				owner_ids[GAMES[it].owner] = 'OWNER';

				if (GAMES[it].users[socket.id].user_type === 'player') {
					for (user_socket_id of Object.keys(GAMES[it].users)) {
						if (
							user_socket_id !== socket.id &&
							GAMES[it].users[user_socket_id].user_type !== 'player'
						) {
							GAMES[it].users[user_socket_id].user_type = 'player';
							GAMES[it].users[user_socket_id].user_icon = GAMES[it].users[socket.id].user_icon;
						}
					}

					GAMES[it].board_state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
					GAMES[it].current_turn = null;
					GAMES[it].playing = null;
					GAMES[it].winner = null;
				}

				delete GAMES[it].users[socket.id];

				Object.keys(GAMES[it].users).forEach((user_socket_id) => {
					socket.to(user_socket_id).emit('my_current_game', JSON.stringify(GAMES[it]));
				});
			}

			if (GAMES[it].owner === socket.id && Object.keys(GAMES[it].users).length === 0)
				delete GAMES[it];
		});

		for (let owner_id of Object.keys(owner_ids)) {
			const owner_games = Object.keys(GAMES)
				.map((it) => {
					if (GAMES[it].owner === owner_id) return GAMES[it];
					else return null;
				})
				.filter((it) => it !== null);
			socket.to(owner_id).emit('my_games', JSON.stringify(owner_games));
		}
	});
});

// PORT Setup and Server Setup on PORT
httpServer.listen(PORT, async () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
