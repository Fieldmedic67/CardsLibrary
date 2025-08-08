import { useEffect, useState, useSyncExternalStore, useRef } from "react";
import { useParams } from "react-router-dom";
import { WarLogic } from "../games/WarLogic.jsx";
import { useNavigate } from "react-router-dom";

function useWarGame(sessionId, playerId) {
  const gameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGame = async () => {
      const game = await WarLogic.createNewGame(sessionId, playerId);

      // If game reference has not been set... set it
      if (!gameRef.current) {
        gameRef.current = game;
      }

      setIsLoading(false);
    };
    loadGame();
  }, [sessionId, playerId]);

  useSyncExternalStore(
    // Add a listener and returns its cleanup method
    (cb) => gameRef.current?.subscribe(cb),
    // Get the state of the game
    () => gameRef.current?.version ?? 0
  );

  return { game: gameRef.current, isLoading };
}

export function War() {
  const { sessionId } = useParams();
  const REFRESH_RATE_MS = 5000;
  const myId = JSON.parse(localStorage.getItem("userName"));
  const userPicture = JSON.parse(localStorage.getItem("userPicture"));

  const { game, isLoading } = useWarGame(sessionId, myId);

  const navigator = useNavigate();

  useEffect(() => {
    if (!game || !game.deck) return;

    //When the deck loading finishes, update url if param not already set
    if (!sessionId)
      navigator(`/war/${game?.deck?.sessionId}`, { replace: true });
  }, [game?.deck]);

  if (isLoading || !game.deck) {
    return <p className="text-white">Loading...</p>;
  }

  if (game.deck.error) {
    return <p className="text-white">{game.deck.error}</p>;
  }

  return (
    <>
      <h1 className="text-white">Game ID: {game.deck.sessionId}</h1>
      <h1 className="text-white">State: {game.state}</h1>
      <img
        className="cursor-pointer"
        src="/back.png"
        alt="Back of Card"
        onClick={async () => {
          await game.transition(game.playerId);
        }}
      />
      <button
        className="p-4 border rounded-full bg-pink-500 text-white cursor-pointer"
        onClick={async () => {
          await game.switchPlayer();
          console.log(game.playerId);
        }}
      >
        Change Player (You are {game.playerId})
      </button>
    </>
  );
}
