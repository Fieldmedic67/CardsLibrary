import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export function useOneDeck(sessionId) {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const navigator = useNavigate();

    useEffect(() => {

        const cutCards = async (deckId, pileId, cardString) => {

            const pileResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/add/?cards=${cardString}`);

            if (!pileResponse.ok) throw new Error(`Failed to make: ${pileId}`);
        }

        const getCards = async (deckId, pileId) => {
            const pileCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/list/`);

            if (!pileCardResponse.ok) throw new Error(`Bad Pile: ${pileId}`);

            const pileCardJson = await pileCardResponse.json();
            return pileCardJson;
        }

        const createNewDeck = async () => {

            // Create a new Deck
            const response = await fetch(
                "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
            );
            if (!response.ok) throw new Error("Failed to fetch a deck");
            const json = await response.json();
            if (!json.success) throw new Error("Deck was unsuccessfully loaded");

            // Draw All 52 cards to distribute
            const drawResponse = await fetch(
                `https://deckofcardsapi.com/api/deck/${json.deck_id}/draw/?count=52`
            );
            if (!drawResponse.ok) throw new Error("Bad draw");
            const drawResponseJson = await drawResponse.json();
            const cardCodeArray = drawResponseJson.cards.map((card) => card.code);
            await cutCards(json.deck_id, "player1", cardCodeArray.slice(0, 26));
            await cutCards(json.deck_id, "player2", cardCodeArray.slice(26, 52));
            sessionId = json.deck_id;
            navigator(`/war/${json.deck_id}`, {replace:true})
        };


        async function loadDeckFromSessionId() {
            const loadResponse = await fetch(`https://www.deckofcardsapi.com/api/deck/${sessionId}`)
            if(!loadResponse.ok){throw new Error(`Failled to load ${sessionId}`)}
            const loadResponseJson = await loadResponse.json();
            if(!loadResponseJson.success){throw new Error(`Failed to load the session`)}
            setData({sessionId: loadResponseJson.deck_id});
            console.log(loadResponseJson)
        }

        async function loadDeck() {
            try {
                if (!sessionId) { await createNewDeck();}
                else{await loadDeckFromSessionId();}
                const player1Cards = await getCards(sessionId, "player1");
                const player2Cards = await getCards(sessionId, "player2");

                console.log(player1Cards);
                console.log(player2Cards);

                setData({
                    player1: player1Cards,
                    player2: player2Cards,
                    sessionId: sessionId
                })
            } 
            catch (err) {
                setError(err.message);
                console.log(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        loadDeck();
        
    }, []);

    return { error, isLoading, data }
}
