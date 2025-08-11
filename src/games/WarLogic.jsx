import { Deck } from "../util/Deck";

export class WarLogic {
  deck;
  winnerOfBattle;
  playerId;
  opponentId;
  playerPile;
  opponentPile;
  playerWarPile = 0;
  opponentWarPile = 0;
  transitions = {
    PlayCard: {
      async transition() {
        if (!this.playerPile) {
          this.playerPile = (
            await this.deck.getPile(
              this.deck.sessionId,
              this.playerId + "_Drawing"
            )
          )?.piles[this.playerId + "_Drawing"];
        }
        if (!this.opponentPile && this.opponentId) {
          this.opponentPile = (
            await this.deck.getPile(
              this.deck.sessionId,
              this.opponentId + "_Drawing"
            )
          )?.piles[this.opponentId + "_Drawing"];
        }

        // console.log(playerPile);

        const playerTurnDone =
          (this.playerPile?.remaining ?? 0) > this.playerWarPile;
        const opponentTurnDone =
          (this.opponentPile?.remaining ?? 0) > this.opponentWarPile;

        if (!playerTurnDone) {
          if (this.winnerOfBattle === null) {
            this.playerPile = await this.deck.drawCards(
              this.playerId,
              this.playerId + "_Drawing",
              4
            );
          } else {
            //Check if player is "Player1" or "Player2"
            //If player dne
            if (!this.playerPile)
              this.deck.transferDefaultToPlayerPile(this.playerId);

            this.playerPile = await this.deck.drawCards(this.playerId);

            // console.log(`Playing ${this.playerId}'s top card`);
          }
        }

        if (!opponentTurnDone) {
          console.log(
            `Waiting for ${
              this.opponentId ? this.opponentId : "other player"
            } to play a card`
          );
          return;
        } else {
          this.opponentPile = (
            await this.deck.getPile(
              this.deck.sessionId,
              this.opponentId + "_Drawing"
            )
          ).piles[this.opponentId + "_Drawing"];

          //console.log(this.opponentId + '_Drawing')
        }
        this.state = "Computing";
        this.playerWarPile = this.playerPile.cards.length;
        this.opponentWarPile = this.opponentPile.cards.length;
        console.log(
          "player:",
          this.playerPile.cards,
          "opponent:",
          this.opponentPile.cards
        );
        this.compareCards(
          this.playerPile.cards[this.playerPile.cards.length - 1],
          this.opponentPile.cards[this.opponentPile.cards.length - 1]
        );
        if (this.winnerOfBattle) {
          await this.rewardWinner();
        }

        if ((await this.gameIsDone()) === true) {
          this.state = "GameOver";
          this.emit();
        } else {
          this.state = "PlayCard";
        }

        // this.state = "CompareCards";
      },
    },

    GameOver: {
      transition() {
        console.log(`GameOver`);
        if (
          this.deck.getCardsRemainingFromPile(this.playerId) === 0 &&
          this.deck.getCardsRemainingFromPile(this.opponentId) === 0
        ) {
          alert("TIE: You both suck");
        } else if (this.deck.getCardsRemainingFromPile(this.playerId) === 0) {
          alert(`${this.opponentId} has won`);
        } else if (this.deck.getCardsRemainingFromPile(this.opponentId) === 0) {
          alert(`${this.playerId} has won`);
        }
        return;
      },
    },
    Computing: {
      async transition() {
        this.playerWarPile = this.playerPile.cards.length;
        this.opponentWarPile = this.opponentPile.cards.length;
        console.log(
          "player:",
          this.playerPile.cards,
          "opponent:",
          this.opponentPile.cards
        );
        this.compareCards(
          this.playerPile.cards[this.playerPile.cards.length - 1],
          this.opponentPile.cards[this.opponentPile.cards.length - 1]
        );
        if (this.winnerOfBattle) {
          await this.rewardWinner();
        }

        if ((await this.gameIsDone()) === true) {
          this.state = "GameOver";
          this.emit();
        } else {
          this.state = "PlayCard";
        }
      },
    },
  };

  subscribe(listener) {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getSnapshot() {
    return this.version;
  }

  emit() {
    this.version++;
    this.listeners.forEach((l) => l());
  }

  static async createNewGame(sessionId, connectingPlayerId) {
    const deck = await Deck.create(sessionId, connectingPlayerId);
    const newGame = new WarLogic(deck);
    newGame.playerId = connectingPlayerId;

    return newGame;
  }
  async reload() {
    console.log("reloading Game");
    // Get name of other player
    // Get all piles first
    const playerPile = await this.deck.getPile(
      this.deck.sessionId,
      this.playerId
    );
    const piles = Object.keys(playerPile.piles);
    // console.log(piles);

    // Remove current player and all drawing piles
    const filtered = piles.filter(
      (item) =>
        item.indexOf(this.playerId) === -1 &&
        item.indexOf("_Drawing") === -1 &&
        item.indexOf("Player2") === -1
    );
    // console.log(filtered);

    const name = filtered[0] ?? null;
    if (!name) {
      return;
    }
    this.opponentId = name;
    this.opponentPile = (
      await this.deck.getPile(this.deck.sessionId, this.opponentId + "_Drawing")
    )?.piles[this.opponentId + "_Drawing"];
    if (!this.opponentPile) {
      return;
    }
    this.opponentWarPile = this.opponentPile.remaining;
    const playerTurnDone =
      (this.playerPile?.remaining ?? 0) > this.playerWarPile;
    const opponentTurnDone =
      (this.opponentPile?.remaining ?? 0) > this.opponentWarPile;
    console.log(opponentTurnDone, playerTurnDone);
    if (playerTurnDone && opponentTurnDone) {
      const action = this.transitions[Computing]["transition"];
      if (action) {
        //console.log(action);
        await action.call(this);
        this.emit();
      } else {
        console.log("Invalid action");
      }
    }
    console.log(this.opponentPile);

    this.emit();
  }
  async switchPlayer() {
    const tempWarPile = this.playerWarPile;
    const temp = this.playerId;
    const tempPile = this.playerPile;
    // Get name of other player
    // Get all piles first
    const playerPile = await this.deck.getPile(
      this.deck.sessionId,
      this.playerId
    );
    const piles = Object.keys(playerPile.piles);
    // console.log(piles);

    // Remove current player and all drawing piles
    const filtered = piles.filter(
      (item) =>
        item.indexOf(this.playerId) === -1 &&
        item.indexOf("_Drawing") === -1 &&
        item.indexOf("Player2") === -1
    );
    // console.log(filtered);

    const name = filtered[0] ?? null;

    // If player 2 hasnt played, lets make a new player name (default = "Opponent")
    if (!name) {
      this.playerId = "Opponent";
      this.deck.transferDefaultToPlayerPile(this.playerId);
    } else {
      this.playerId = name;
    }
    this.playerPile = this.opponentPile;
    this.playerWarPile = this.opponentWarPile;
    this.opponentId = temp;
    this.opponentPile = tempPile;
    this.opponentWarPile = tempWarPile;
    this.emit();
  }

  constructor(deck) {
    if (!deck) throw new Error("Deck must be provided");
    this.deck = deck;
    this.state = "PlayCard";
    this.listeners = [];
    this.snapshot = {};
    this.version = 0;
  }

  getCardValue(card) {
    switch (card?.value) {
      case "ACE":
        return 14;
      case "JACK":
        return 11;
      case "QUEEN":
        return 12;
      case "KING":
        return 13;
      default:
        return parseInt(card?.value);
    }
  }
  compareCards(player1Card, player2Card) {
    // const player1Value = 10;
    // const player2Value = 9;
    const player1Value = this.getCardValue(player1Card);
    const player2Value = this.getCardValue(player2Card);
    console.log(`Comparing ${player1Value} and ${player2Value}`);
    if (player1Value > player2Value) {
      this.winnerOfBattle = this.playerId;
    } else if (player2Value > player1Value) {
      this.winnerOfBattle = this.opponentId;
    } else {
      this.winnerOfBattle = null;
    }
  }

  async rewardWinner() {
    // add cards into winner's pile
    const playerCards = await this.deck.drawCards(
      this.playerId + "_Drawing",
      this.winnerOfBattle,
      this.playerWarPile
    );
    const oponentCards = await this.deck.drawCards(
      this.opponentId + "_Drawing",
      this.winnerOfBattle,
      this.opponentWarPile
    );
    this.playerWarPile = 0;
    this.opponentWarPile = 0;
    this.playerPile = null;
    this.opponentPile = null;
    console.log(`Rewarding ${this.winnerOfBattle}`);
  }

  async gameIsDone() {
    const loserId =
      this.winnerOfBattle !== this.playerId ? this.playerId : this.opponentId;
    const loserNumRemaining = await this.deck.getCardsRemainingFromPile(
      loserId
    );
    console.log(
      `Check loser id has this many cards: ${loserNumRemaining} Id: ${loserId}`
    );
    return loserNumRemaining === 0;
  }

  async transition(param) {
    const action = this.transitions[this.state]["transition"];
    if (action) {
      //console.log(action);
      await action.call(this, param);
      this.emit();
    } else {
      console.log("Invalid action");
      return this;
    }
  }
}
