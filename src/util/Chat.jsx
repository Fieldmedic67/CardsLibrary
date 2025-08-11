import { useState } from "react";
import { sessionId } from "./Deck.jsx";

export default function Chat() {
    
    const [chatId, setChatId] = useState();
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,KS,AD,2D,KD,AC,2C,KC,AH,2H,KH")
        .then((response) => response.json())
        .then((json) => {
            console.log(`Chat id ${json.deck_id} has been created`, json);
            setchatId(json.deck_id);
            return json.deck_id;
        });
    await 
}