import { useState, useEffect } from "react";

export class Card {
  constructor({ code, images, value, suit }) {
    this.code = code;
    this.image = images.svg;
    this.value = value;
    this.suit = suit;
  }
}
export class Deck {
  constructor(sessionId, player1Id, player2Id) {
    this.isLoading = true;
    this.error;
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.sessionId = sessionId;
  }

  static async create(sessionId, player1Id, player2Id) {
    const deck = new Deck(sessionId, player1Id, player2Id);
    await deck.onCreate();
    return deck;
  }

  async onCreate() {
    try {
      if (!this.sessionId) {
        console.log("[Deck] No session ID provided. Making a new deck...");
        await this.#createNewDeck();
      } else {
        console.log(`[Deck] Loading session ${this.sessionId}...`);
        await this.#loadDeckFromSessionId();
      }
    } catch (err) {
      this.error = err.message;
    } finally {
      console.log("[Deck] Finished loading deck!");
      this.isLoading = false;
    }
  }

  async #createNewDeck() {
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
    this.sessionId = json.deck_id;
    await this.cutCards(this.player1Id, cardCodeArray.slice(0, 26));
    await this.cutCards(this.player2Id, cardCodeArray.slice(26, 52));
  }

  async #loadDeckFromSessionId() {
    try {
      const loadResponse = await fetch(
        `https://www.deckofcardsapi.com/api/deck/${this.sessionId}`
      );
      if (!loadResponse.ok) {
        this.error = `Failed to load ${this.sessionId}`;
        return;
      }
      const loadResponseJson = await loadResponse.json();
      if (!loadResponseJson.success) {
        this.error = `Failed to load the session`;
        return;
      }
    } catch (err) {
      this.error = err.message;
    }
  }

  async cutCards(pileId, cardString) {
    const pileResponse = await fetch(
      `https://deckofcardsapi.com/api/deck/${this.sessionId}/pile/${pileId}/add/?cards=${cardString}`
    );

    if (!pileResponse.ok) {
      console.error(`Failed to make: ${pileId}`);
      return;
    }
  }

  async drawCards(pileId, count = 1) {
    const drawPileId = pileId + "_Drawing";
    const drawResponse = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${this.sessionId}/pile/${pileId}/draw/?count=${count}`
    );
    if (!drawResponse.ok) {
      this.error = `Could not draw card from ${pileId}`;
      console.error(this.error);
      return;
    }

    const drawJson = await drawResponse.json();

    console.log("DrawJson:", drawJson);

    const cardCodeArray = drawJson.cards.map((card) => card.code);

    const addToDrawPileRes = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${this.sessionId}/pile/${drawPileId}/add/?cards=${cardCodeArray}`
    );

    if (!addToDrawPileRes.ok) {
      this.error = `Could not add cards to ${drawPileId}`;
      console.error(this.error);

      return;
    }

    const addToPilesJson = await addToDrawPileRes.json();
    console.log("AddToPilesJson:", addToPilesJson);
  }

  async getCards(deckId, pileId) {
    const pileCardResponse = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/list/`
    );

    if (!pileCardResponse.ok) {
      console.error(`Bad Pile: ${pileId}`);
      return null;
    }

    const pileCardJson = await pileCardResponse.json();
    return pileCardJson;
  }

  async getCardsRemainingFromPile(pileId) {
    try {
      // console.log(`[Deck] Loading cards from pile ${pileId}...`);
      var playerCards = await this.getCards(this.sessionId, pileId);
      // console.log("[Deck] Finished loading pile!");

      if (!Object.keys(playerCards.piles).includes(pileId)) {
        return 0;
      }

      return playerCards.piles[pileId].remaining;
    } catch (err) {
      this.error = err.message;
      console.error(playerCards);
    }
  }

  async refresh() {
    try {
      console.log(`[Deck] reloading ${this.sessionId}...`);
      this.#loadDeckFromSessionId();
      console.log("[Deck] Finished loading session!");
    } catch (err) {
      console.log("WEIRD2");
      this.error = err.message;
      console.log(err.message);
    }
  }
}
