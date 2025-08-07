import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export class Card {
    constructor({ code, images, value, suit }) {
        this.code = code;
        this.image = images.svg;
        this.value = value;
        this.suit = suit;
    }
}
export class Deck {

    

    constructor(sessionId) {
        this.data;
        this.isLoading = true
        this.error;
        this.sessionId = sessionId
        this.navigator = useNavigate();
        this.onCreate();
        
    }

    async cutCards(deckId, pileId, cardString) {

        const pileResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/add/?cards=${cardString}`);

        if (!pileResponse.ok) throw new Error(`Failed to make: ${pileId}`);
    }

    async getCards(deckId, pileId) {
        const pileCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/list/`);

        if (!pileCardResponse.ok) throw new Error(`Bad Pile: ${pileId}`);

        const pileCardJson = await pileCardResponse.json();
        return pileCardJson;
    }

    async createNewDeck() {

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
        await this.cutCards(json.deck_id, "player1", cardCodeArray.slice(0, 26));
        await this.cutCards(json.deck_id, "player2", cardCodeArray.slice(26, 52));
        this.sessionId = json.deck_id;
        this.navigator(`/war/${json.deck_id}`, { replace: true })
    };

    async getCardsRemainingFromPile(pileId) {
        try {
            const playerCards = await this.getCards(this.sessionId, pileId);
            return playerCards[pileId].remaining
        }
        catch (err) {
            this.setError(err.message);
            console.log(err.message);
        }
    }

    async loadDeckFromSessionId() {
        const loadResponse = await fetch(`https://www.deckofcardsapi.com/api/deck/${this.sessionId}`)
        if (!loadResponse.ok) { throw new Error(`Failled to load ${this.sessionId}`) }
        const loadResponseJson = await loadResponse.json();
        if (!loadResponseJson.success) { throw new Error(`Failed to load the session`) }
    }

    setError(message) {
        this.error = message;
    }

    setIsLoading(value) {
        this.isLoading = value;
    }

    async onCreate() {
        try {
            if (!this.sessionId) { await this.createNewDeck(); }
            else { await this.loadDeckFromSessionId(); }
            const player1Cards = await this.getCards(this.sessionId, "player1");
            const player2Cards = await this.getCards(this.sessionId, "player2");

            this.data = ({
                player1: player1Cards,
                player2: player2Cards,
                sessionId: this.sessionId,
                player1Id: "player1",
                player2Id: "player2"
            })
        }
        catch (err) {
            this.setError(err.message);
            console.log(err.message);
        } finally {
            this.setIsLoading(false);
        }


    }

}
