import { useEffect, useState } from "react";
import { useOneDeck } from "../util/useOneDeck"
import { useParams } from "react-router-dom";


export function War() {

    const userName = JSON.parse(localStorage.getItem('userName'))
    const userPicture = JSON.parse(localStorage.getItem('userPicture'))

    const { sessionId } = useParams();
    const [deckId, setDeckId] = useState();
    const [cards, setCards] = useState([]);
  // player 1 puts card in 3rd pile
  // player 2 puts card in 3rd pile
  // player with higher value puts those cards at bottom of their pile

  // This is our get deck on load
    const { error, isLoading , data } = useOneDeck(sessionId);

    useEffect(() => {

    }, [data])

    return (
        <>
            {isLoading && <p>Loading...</p>}
            {!isLoading && data && (
                <>
                    <p>{data.sessionId}</p>
                    <img src="https://deckofcardsapi.com/static/img/back.png" alt="Back of Card"/>
                </>
            )}
            
        </>
    )
}
