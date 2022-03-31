import React from 'react';
import { Button, Row, Col, Card, Form, FormGroup, Input, Label, Container } from 'reactstrap';

const HomePage = ({
	joinGame,
	game_id_input,
	set_game_id_input,
	createNewGame,
	my_games,
	joinOwnGame,
}) => {
	return (
		<>
			<Card className='mt-4'>
				<Row>
					<Col md={8} className='p-5'>
						<Form onSubmit={joinGame}>
							<Row>
								<Col md={9}>
									<Input
										name='game_id_input'
										placeholder='Enter Game ID'
										type='text'
										value={game_id_input}
										onChange={(e) => {
											set_game_id_input(e.target.value);
										}}
									/>
								</Col>
								<Col md={3}>
									<Button color='primary'>Join Game</Button>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col className='p-5 border-start'>
						<Button color='primary' onClick={createNewGame}>
							Create New Game
						</Button>
					</Col>
				</Row>
			</Card>

			<Row>
				<Col md={6} className='mt-5'>
					<h4>My Games</h4>
					<hr />
					{my_games.map((it, key) => (
						<Card className='p-3 mb-2' key={key}>
							<Row>
								<Col md={8}>
									<p className='lead m-0'>{it.game_id}</p>
								</Col>
								<Col md={4}>
									<Button
										color='success float-end'
										onClick={() => {
											joinOwnGame(it.game_id);
										}}
									>
										Join Game
									</Button>
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<p>
										<strong>Total Users: {Object.keys(it.users).length}</strong>
									</p>
								</Col>
							</Row>
						</Card>
					))}
				</Col>
			</Row>
		</>
	);
};

export default HomePage;
