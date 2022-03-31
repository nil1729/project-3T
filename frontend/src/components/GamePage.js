import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Row, Col, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import './game.css';

const GamePage = ({ client_id, current_game, startGame, playGame }) => {
	const history = useHistory();

	useEffect(() => {
		if (!client_id) {
			history.push('/');
		}
		//eslint-disable-next-line
	}, []);

	return (
		<>
			<hr className='mb-5' />
			{current_game && (
				<>
					<Row>
						<Col md={4}>
							<ListGroup>
								{Object.keys(current_game.users).map((key) => (
									<ListGroupItem key={key}>
										{key}
										{'  '}
										{current_game.users[key].user_type === 'player' ? (
											<>
												<small>
													<Badge color='success' pill>
														Player
													</Badge>
												</small>
												{'    '}
												<small>
													<Badge color='success' pill>
														{current_game.users[key].user_icon}
													</Badge>
												</small>
											</>
										) : null}
										{'  '}
										{client_id === key ? (
											<>
												<small>
													<Badge color='primary' pill>
														Me
													</Badge>
												</small>
											</>
										) : null}
									</ListGroupItem>
								))}
							</ListGroup>
						</Col>
						<Col md={8}>
							<section className='tile_container'>
								{current_game.board_state.map((tile, key) => (
									<div
										className='tile bg-primary'
										style={
											current_game.playing &&
											current_game.current_turn.user_icon ===
												current_game.users[client_id].user_icon &&
											tile === 0 &&
											!current_game.winner
												? { cursor: 'pointer' }
												: { pointerEvents: 'none' }
										}
										key={key}
										onClick={() => {
											playGame(current_game.game_id, key);
										}}
									>
										{tile !== 0 ? tile.user_icon : null}
									</div>
								))}
							</section>
						</Col>
					</Row>
					{Object.keys(current_game.users).length >= 2 &&
						current_game.users[client_id]?.user_type === 'player' &&
						!current_game.playing && (
							<Row>
								<div className='text-center mt-5'>
									<Button
										color='info'
										onClick={() => {
											startGame(current_game.game_id);
										}}
									>
										Start Game
									</Button>
								</div>
							</Row>
						)}
					{current_game.playing && !current_game.winner && (
						<Row>
							<div className='text-center mt-5'>
								<p className='lead'>
									<Badge color='secondary' pill>
										Player{'    '}
										{current_game.current_turn.user_icon}
									</Badge>
								</p>
							</div>
						</Row>
					)}
					{current_game.playing && current_game.winner && (
						<Row>
							<div className='text-center mt-5'>
								<h3>Player {current_game.winner.user_icon} win the game</h3>
							</div>
						</Row>
					)}
				</>
			)}
		</>
	);
};

export default GamePage;
