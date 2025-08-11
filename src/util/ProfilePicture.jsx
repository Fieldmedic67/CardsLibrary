import { useState } from "react";
import { sessionId } from "./Deck.jsx";

export default function ProfilePicture() {
    
    const [ProfileId, setProfileId] = useState();
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,KS,AD,2D,KD")
        .then((response) => response.json())
        .then((json) => {
            console.log(`profile id ${json.deck_id} has been created`, json);
            setchatId(json.deck_id);
            return json.deck_id;
        });
    await 
}