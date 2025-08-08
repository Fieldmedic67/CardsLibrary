import React, {useState} from 'react';
import "./TwoThreeSevenTen.css";
import ProfileHeader from "./ProfileHeader.jsx";

const TwoThreeSevenTen = () => {

    const userName = JSON.parse(localStorage.getItem('userName'))
    const userPicture = JSON.parse(localStorage.getItem('userPicture'))

    const [deckID, setDeckID] = useState();


    // Player 1 cards
    const [p1Hand, setP1Hand] = useState([]);
    const [p1FaceDown, setP1FaceDown] = useState([]);
    const [p1FaceUp, setP1FaceUp] = useState([]);

    // Player 2 cards
    const [p2Hand, setP2Hand] = useState([]);
    const [p2FaceDown, setP2FaceDown] = useState([]);
    const [p2FaceUp, setP2FaceUp] = useState([]);

    //other piles
    const [drawPile, setDrawPile] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [burnPile, setBurnPile] = useState([]);

    const NewGame = () => {
        const createOrResetDeck = () => {
            if (!deckID) { //if deck is undefined (doesnt exist) then make a new deck and shuffle (its falsy)
                return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
                    .then((response) => response.json())
                    .then((json) => {
                        console.log(`New Deck ${json.deck_id} has successfully been created as such:`, json);
                        setDeckID(json.deck_id);
                        return json.deck_id;
                    });
            } else {
                console.log(`Returning and shuffling deck ${deckID}`);
                return fetch(`https://deckofcardsapi.com/api/deck/${deckID}/return/`)
                    .then(() => fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`))
                    .then(() => deckID);
            }
        };

        createOrResetDeck()
            .then((deckID) => {
                return fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`);
            })
            .then((response) => response.json())
            .then((json) => {
                console.log("52 cards drawn:", json.cards);
                let theDeck = json.cards;
                //deal cards
                setP1FaceDown(theDeck.splice(0, 3));
                setP2FaceDown(theDeck.splice(0, 3));
                setP1FaceUp(theDeck.splice(0, 3));
                setP2FaceUp(theDeck.splice(0, 3));
                setP1Hand(theDeck.splice(0, 3));
                setP2Hand(theDeck.splice(0, 3));
                setDrawPile(theDeck);
            })
    };
    const Player1CardFromHand = (index) => {
        let playedCard = p1Hand[index];
        setDiscardPile([...discardPile, playedCard]);
        let newHand = [...p1Hand];
        newHand.splice(index, 1);

        if (newHand.length < 3 && drawPile.length >= 1) {
            let drawnCard = drawPile[0];
            newHand.push(drawnCard);
            setDrawPile(drawPile.slice(1));
        }
        setP1Hand(newHand)

    }

    return (
        <>
            <ProfileHeader />
            <div>
                <button className="p-3 bg-green-300 rounded-full" onClick={NewGame}>New Game</button>

                <div className="p1FaceDown"> {p1FaceDown.length > 0 && p1FaceDown.map((card, index) => (
                    <img key={index} src={`https://deckofcardsapi.com/static/img/back.png`}
                         onClick={() => Player1PlayFaceDown(index)}/>))}
                </div>
                <div className="p2FaceDown"> {p2FaceDown.length > 0 && p1FaceDown.map((card, index) => (
                    <img key={index} src={`https://deckofcardsapi.com/static/img/back.png`}/>))}
                </div>
                <div className="p1FaceUp"> {p1FaceUp.length > 0 && p1FaceUp.map((card, index) => (
                    <img key={index} src={`https://deckofcardsapi.com/static/img/${card.code}.png`}
                         onClick={() => Player1PlayFaceUp(index)}/>))}
                </div>
                <div className="p2FaceUp"> {p2FaceUp.length > 0 && p2FaceUp.map((card, index) => (
                    <img key={index} src={`https://deckofcardsapi.com/static/img/${card.code}.png`}/>))}
                </div>
                <div className="p1Hand"> {p1Hand.length > 0 && p1Hand.map((card, index) => (
                    <img key={index} src={`https://deckofcardsapi.com/static/img/${card.code}.png`}
                         onClick={() => Player1CardFromHand(index)}/>))}
                </div>
                <div className="p2Hand"> {p2Hand.length > 0 && p2Hand.map((card, index) => (
                    <img key={index} src={`https://deckofcardsapi.com/static/img/back.png`}/>))}
                </div>
                <div className="drawPile"> {drawPile.length > 0 && (
                    <img src={`https://deckofcardsapi.com/static/img/back.png`}/>)}
                </div>
                <div className="discardPile"> {discardPile.length > 0 && (
                    <img
                        src={`https://deckofcardsapi.com/static/img/${discardPile[discardPile.length - 1].code}.png`}/>)}
                </div>
            </div>
        </>

    )
}
export default TwoThreeSevenTen;
