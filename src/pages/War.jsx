import { useEffect, useState } from "react";
import { Deck } from "../util/Deck.jsx";
import { useParams } from "react-router-dom";
import { WarLogic } from "../games/WarLogic.jsx";
import { useNavigate } from "react-router-dom";

export function War() {
  const { sessionId } = useParams();
  const [game, setGame] = useState();
  const REFRESH_RATE_MS = 5000;
  const myId = JSON.parse(localStorage.getItem("userName"));
  const userPicture = JSON.parse(localStorage.getItem("userPicture"));
  const [playerId, setPlayerId] = useState(myId);
  // player 1 puts card in 3rd pile
  // player 2 puts card in 3rd pile
  // player with higher value puts those cards at bottom of their pile

  const navigator = useNavigate();

  useEffect(() => {
    const init = async () => {
      const newGame = await WarLogic.createNewGame(
        sessionId,
        playerId,
        "player2" // handle logic.. to get player2name
      );
      setGame(newGame);
    };
    init();

    // refresh war every 5 seconds
    // const interval = setInterval(() => {
    //   setGame(async (prev) => {
    //     if (!prev) return prev;
    //     const refreshed = await prev.refresh(playerId);
    //     if (!refreshed) return prev;
    //     return refreshed;
    //   });
    // }, REFRESH_RATE_MS);

    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!game || !game.deck || game.deck.isLoading) return;
    //When the deck loading finishes, update url if param not already set
    if (!sessionId)
      navigator(`/war/${game?.deck?.sessionId}`, { replace: true });
  }, [game, sessionId]);

  if (game?.deck.error) {
    return <p>{game.deck.error}</p>;
  }

  if (game?.deck.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Game ID: {game?.deck.sessionId}</h1>
      <h1>State: {game?.state}</h1>
      {game?.state === "PlayCard" && (
        <img
          className="cursor-pointer"
          src="/back.png"
          alt="Back of Card"
          onClick={async () => {
            if (!game) return;
            console.log(`Start State: ${game.state}`);
            const next = await game.transition(playerId);
            setGame(next);
            console.log(`End State: ${game.state}`);
          }}
        />
      )}
      <button
        className="p-4 border rounded-full bg-pink-500 text-white cursor-pointer"
        onClick={() => {
          setPlayerId(playerId === myId ? "player2" : myId);
        }}
      >
        Change Player (You are {playerId})
      </button>
    </>
  );
}
