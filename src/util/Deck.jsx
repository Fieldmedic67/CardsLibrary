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
  constructor(sessionId) {
    this.isLoading = true;
    this.error;
    this.sessionId = sessionId;
    this.piles = [];
  }

  async transferDefaultToPlayerPile(connectingPlayerId) {
    try { // draw all cards from the pile
      const drawResponse = await fetch(
        `https://deckofcardsapi.com/api/deck/${this.sessionId}/pile/Player2/draw/bottom/?count=26`
      );
      if (!drawResponse.ok) throw new Error("Bad draw");
      const drawResponseJson = await drawResponse.json();
      const cardCodeArray = drawResponseJson.cards.map((card) => card.code);
      this.player2Id = connectingPlayerId;
      await this.addCards(connectingPlayerId, cardCodeArray.slice(0, 26));
    }

    catch {

    }
  }

  static async create(sessionId, connectingPlayerId) {
    const deck = new Deck(sessionId);
    await deck.onCreate(connectingPlayerId);
    return deck;
  }

  async onCreate(connectingPlayerId) {
    try {
      if (!this.sessionId) {
        // console.log("[Deck] No session ID provided. Making a new deck...");
        await this.#createNewDeck(connectingPlayerId);
      } else {
        // console.log(`[Deck] Loading session ${this.sessionId}...`);
        await this.#loadDeckFromSessionId(connectingPlayerId);
      }
      await this.setPiles(connectingPlayerId);

    } catch (err) {
      this.error = err.message;
    } finally {
      // console.log("[Deck] Finished loading deck!");
      this.isLoading = false;
    }
  }

  async #createNewDeck(connectingPlayerId) {
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
    this.player1Id = connectingPlayerId;
    await this.addCards(connectingPlayerId, cardCodeArray.slice(0, 26));
    await this.addCards('Player2', cardCodeArray.slice(26, 52));
  }

  async #loadDeckFromSessionId(connectingPlayerId) {
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
      // Check to see if the connectingPlayerId has a pile
      const playerHasPile = await this.getPile(this.sessionId, connectingPlayerId)

      if (!playerHasPile) {
        await this.transferDefaultToPlayerPile(connectingPlayerId);
      }
    } catch (err) {
      this.error = err.message;
    }
  }

  async addCards(pileId, cardString) {
    const pileResponse = await fetch(
      `https://deckofcardsapi.com/api/deck/${this.sessionId}/pile/${pileId}/add/?cards=${cardString}`
    );

    if (!pileResponse.ok) {
      console.error(`Failed to make: ${pileId}`);
      return;
    }
  }

  async drawCards(fromPileId, toPileId = undefined, count = 1) {
    toPileId = toPileId ?? fromPileId + "_Drawing";
    const drawResponse = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${this.sessionId}/pile/${fromPileId}/draw/bottom/?count=${count}`
    );
    if (!drawResponse.ok) {
      this.error = `Could not draw card from ${fromPileId}`;
      console.error(this.error);
      return;
    }

    const drawJson = await drawResponse.json();

    // console.log("DrawJson:", drawJson);

    const cardCodeArray = drawJson.cards.map((card) => card.code);

    const addToDrawPileRes = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${this.sessionId}/pile/${toPileId}/add/?cards=${cardCodeArray}`
    );

    if (!addToDrawPileRes.ok) {
      this.error = `Could not add cards to ${toPileId}`;
      console.error(this.error);

      return;
    }

    const addToPilesJson = await addToDrawPileRes.json();
    const cardData = await this.getPile(this.sessionId, toPileId);
    console.log(cardData, cardData.piles[toPileId])
    return(cardData.piles[toPileId])
  }

  async setPiles(pileId) {
    const piles = await this.getPile(this.sessionId, pileId);
    this.piles = piles.piles;
  }

  async getPile(deckId, pileId) {
    const pileCardResponse = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileId}/list/`
    );

    if (!pileCardResponse.ok) {
      console.error(`Bad Pile: ${pileId}`);
      return null;
    }

    const pileCardJson = await pileCardResponse.json();
    console.log(pileId,pileCardJson)
    return pileCardJson;
  }

  async getCardsRemainingFromPile(pileId) {
    try {
      // console.log(`[Deck] Loading cards from pile ${pileId}...`);
      var playerCards = await this.getPile(this.sessionId, pileId);
      // console.log("[Deck] Finished loading pile!");

      if (!Object.keys(playerCards.piles).includes(pileId)) {
        return 0;
      }
      console.log(playerCards.piles[pileId].remaining)
      return playerCards.piles[pileId].remaining;
    } catch (err) {
      this.error = err.message;
      console.error(playerCards);
    }
  }

  async refresh(connectingPlayerId) {
    try {
      console.log(`[Deck] reloading ${this.sessionId}...`);
      this.#loadDeckFromSessionId(connectingPlayerId);
      console.log("[Deck] Finished loading session!");
    } catch (err) {
      console.log("WEIRD2");
      this.error = err.message;
      console.log(err.message);
    }
  }
}
