import React, { useState } from "react";
import styled from "styled-components";
import useGameStore, { TGameData } from "../store/gameStore";
import { useNavigate } from "react-router-dom";

export interface IGameSession {
  player1: string;
  player2: string;
  wins: { [key: string]: number };
  losses: { [key: string]: number };
  draws: number;
}

const BoardContainer = styled.div`
  margin: 0 auto;
  width: 450px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 20px;
`;

const Cell = styled.button`
  width: 150px;
  height: 150px;
  font-size: 24px;
  font-weight: bold;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const TicTacToe: React.FC = () => {
  const navigate = useNavigate();
  const { saveGameHistory } = useGameStore();
  const [gameSessions, setGameSessions] = useState<IGameSession[]>([]);
  const [showGameSetup, setShowGameSetup] = useState(true);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [currentSession, setCurrentSession] = useState<IGameSession | null>(
    null
  );
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [showContinueStop, setShowContinueStop] = useState(false);

  const handleStartNewGame = () => {
    setShowGameSetup(true);
    setCurrentSession(null);
    setGameSessions([]);
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setShowContinueStop(false);
  };

  const handleGameSetup = () => {
    if (!player1Name || !player2Name) {
      alert("Please enter player name");
      return;
    }
    const newSession: IGameSession = {
      player1: player1Name,
      player2: player2Name,
      wins: { [player1Name]: 0, [player2Name]: 0 },
      losses: { [player1Name]: 0, [player2Name]: 0 },
      draws: 0,
    };
    setCurrentSession(newSession);
    setShowGameSetup(false);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const updatedBoard = [...board];
    updatedBoard[index] = currentPlayer;
    setBoard(updatedBoard);

    const winner = calculateWinner(updatedBoard);
    if (winner) {
      handleResult(winner);
    } else if (!updatedBoard.includes(null)) {
      handleResult(null);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const handleResult = (winner: "X" | "O" | null) => {
    if (currentSession) {
      const updatedSession = { ...currentSession };
      if (winner === "X") {
        updatedSession.wins[player1Name]++;
        updatedSession.losses[player2Name]++;
      } else if (winner === "O") {
        updatedSession.wins[player2Name]++;
        updatedSession.losses[player1Name]++;
      } else {
        updatedSession.draws++;
      }
      setCurrentSession(updatedSession);
      setShowContinueStop(true);
    }
  };

  const handleContinue = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    setShowContinueStop(false);
  };

  const handleStop = async () => {
    if (currentSession) {
      setGameSessions([...gameSessions, currentSession]);
    }
    saveGameHistory([...gameSessions, currentSession] as TGameData[]);
    handleStartNewGame();
    navigate("/");
  };

  const calculateWinner = (board: (string | null)[]): "X" | "O" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as "X" | "O";
      }
    }
    return null;
  };

  return (
    <>
      {showGameSetup ? (
        <div>
          <h2>Start New Game</h2>
          <div>
            <input
              type="text"
              placeholder="Player 1 Name"
              value={player1Name}
              required
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
            <input
              type="text"
              placeholder="Player 2 Name"
              value={player2Name}
              required
              onChange={(e) => setPlayer2Name(e.target.value)}
            />
          </div>
          <button onClick={handleGameSetup}>Start</button>
        </div>
      ) : (
        <div>
          <h2>Tic Tac Toe</h2>
          <BoardContainer>
            {board.map((cell, index) => (
              <Cell key={index} onClick={() => handleCellClick(index)}>
                {cell}
              </Cell>
            ))}
          </BoardContainer>
          {currentSession && (
            <div>
              <p>
                {player1Name} (X) - Wins: {currentSession.wins[player1Name]},
                Losses: {currentSession.losses[player1Name]}
              </p>
              <p>
                {player2Name} (O) - Wins: {currentSession.wins[player2Name]},
                Losses: {currentSession.losses[player2Name]}
              </p>
              <p>Draws: {currentSession.draws}</p>
            </div>
          )}
          {showContinueStop && (
            <div>
              <button className="continue" onClick={handleContinue}>
                Continue
              </button>
              <button className="stop" onClick={handleStop}>
                Stop
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TicTacToe;
