import React, { useEffect } from "react";
import useGameStore, { TGameData, TScores } from "../store/gameStore";
import dayjs from "dayjs";

const HomePage: React.FC = () => {
  const { data, isLoading, getHistories } = useGameStore();

  useEffect(() => {
    getHistories();
  }, []);

  return (
    <>
      <div className="session-container">
        <h2>Previous Game Sessions</h2>
        {!isLoading &&
          data?.map((session: TGameData, index) => (
            <div className="session-card" key={index}>
              <p>
                {session.player1} (X) vs {session.player2} (O)
              </p>
              <p>
                {session.player1} Wins:{" "}
                {(session.wins as TScores)[session.player1] ?? 0}, Losses:{" "}
                {(session.losses as TScores)[session.player1] ?? 0}
              </p>
              <p>
                {session.player2} Wins:{" "}
                {(session.wins as TScores)[session.player2] ?? 0}, Losses:{" "}
                {(session.losses as TScores)[session.player2] ?? 0}
              </p>
              <p>Draws: {session.draws ?? 0}</p>
              <p>{dayjs(session.createdAt).format("MMMM DD, YYYY h:mm A") ?? "Date"}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default HomePage;
