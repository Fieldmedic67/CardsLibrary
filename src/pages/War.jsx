import { useEffect, useState } from "react";
import { Deck } from "../util/useOneDeck"
import { useParams } from "react-router-dom";
import { CreateWarGame} from "../games/WarLogic.jsx"

export function War() {
    const { sessionId } = useParams();
    const [playerId, setPlayerId] = useState("player1")
    const [deck, setDeck] = useState();
  // player 1 puts card in 3rd pile
  // player 2 puts card in 3rd pile
  // player with higher value puts those cards at bottom of their pile
    const war = CreateWarGame()
    console.log("current state:", war.state)
  // This is our get deck on load
    
    useEffect(() => {
        setDeck(new Deck(sessionId))   
    }, [])
    useEffect(() => {
        if (!deck) return
        const data = deck.data;
        war.drawingPile1 = data?.player1;
        war.drawingPile2 = data?.player2;
        war.player1Id = data?.player1Id;
        war.player2Id = data?.player2Id;
        war.player1PreviousRemaining = getCardsRemainingFromPile(war.player1Id);
        war.player2PreviousRemaining = getCardsRemainingFromPile(war.player2Id);
        war.getRemaining = getCardsRemainingFromPile;
        console.log("data", data, war)
    }, [deck, playerId])

    return (
        <>
            {deck && deck.isLoading && <p>Loading...</p>}
            {deck && !deck.isLoading && deck.data && (
                <>
                    <p>{deck.data.sessionId}</p>
                    <img src="https://deckofcardsapi.com/static/img/back.png" alt="Back of Card" onClick={() => {
                        console.log("test",war.state,war.drawingPile1,"war.player1Id",war.player1Id)
                        war.transition(playerId)
                        
                    }}/>
                    <button onClick={() => {setPlayerId(playerId === "player1"?"player2":"player1")}}>Change Player (You are {playerId})</button>
                </>
            )}
            
        </>
    )
}
