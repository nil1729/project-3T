import { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { Switch, Route, useHistory } from "react-router-dom";
import HomePage from "./components/HomePage";
import GamePage from "./components/GamePage";
import { socket } from "./socket";

const App = () => {
  window.onbeforeunload = function () {
    return "Are you sure you want to leave? You are in the middle of something.";
  };

  const history = useHistory();

  const [client_id, set_client_id] = useState(null);
  const [my_games, set_my_games] = useState([]);
  const [game_id_input, set_game_id_input] = useState("");
  const [current_game, set_current_game] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      set_client_id(socket.id);
    });

    socket.on("my_current_game", (data) => {
      set_current_game(data);
    });

    socket.on("my_games", (data) => {
      set_my_games(data);
    });

    return () => {
      socket.off("connect");
      socket.off("my_current_game");
      socket.off("my_games");
    };
  });

  const createNewGame = () => {
    socket.emit("create_game", null, (err) => {
      if (err) alert(err);
    });
  };

  const joinGame = (e) => {
    e.preventDefault();
    socket.emit("join_game", game_id_input, (cb) => {
      if (cb && cb.error) alert(cb.error);
    });
    history.push(`/play/${game_id_input}`);
    set_game_id_input("");
  };

  const joinOwnGame = (game_id) => {
    socket.emit("join_game", game_id, (cb) => {
      if (cb && cb.error) {
        alert(cb.error);
        history.push("/");
      }
    });
    history.push(`/play/${game_id}`);
  };

  const startGame = (game_id) => {
    socket.emit("start_game", game_id, (cb) => {
      if (cb && cb.error) {
        alert(cb.error);
      }
    });
  };

  const playGame = (game_id, board_index) => {
    socket.emit("play_game", game_id, board_index, (cb) => {
      if (cb && cb.error) {
        alert(cb.error);
      }
    });
  };

  const restartGame = (game_id) => {
    socket.emit("restart_game", game_id, (cb) => {
      if (cb && cb.error) {
        alert(cb.error);
      }
    });
  };

  return (
    <div className="App">
      <Container>
        <h1 className="text-center mt-4">Multi Player Tic-Tac-Toe</h1>
        <Switch>
          <Route path="/" exact>
            <HomePage
              joinGame={joinGame}
              game_id_input={game_id_input}
              set_game_id_input={set_game_id_input}
              createNewGame={createNewGame}
              my_games={my_games}
              joinOwnGame={joinOwnGame}
            />
          </Route>
          <Route path="/play/:game_id">
            <GamePage
              client_id={client_id}
              joinOwnGame={joinOwnGame}
              current_game={current_game}
              startGame={startGame}
              playGame={playGame}
              restartGame={restartGame}
            />
          </Route>
        </Switch>
      </Container>
    </div>
  );
};

export default App;
