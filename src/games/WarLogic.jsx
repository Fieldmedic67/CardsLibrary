import { Deck } from "../util/Deck";

const userName = JSON.parse(localStorage.getItem('userName'))
const player1 = userName;

export class WarLogic {
  deck;
  winnerOfBattle;
  playerId;
  opponentId;

  transitions = {
    PlayCard: {
      async transition() {
        const playerPile = await this.deck.getPile(
          this.deck.sessionId,
          this.playerId + "_Drawing"
        );

        console.log(playerPile);

        const drawRemaining =
          playerPile.piles[this.playerId + "_Drawing"].remaining;

        const opponentDrawRemaining = this.opponentId
          ? playerPile.piles[this.opponentId + "_Drawing"].remaining
          : 0;

        const playerTurnDone = drawRemaining > 0;
        const opponentTurnDone = opponentDrawRemaining > 0;

        if (!playerTurnDone) {
          console.log(`Playing ${playerId}'s top card`);
          await this.deck.drawCards(playerId);
        }

        if (!opponentTurnDone) {
          console.log(
            `Waiting for ${
              this.opponentId ? this.opponentId : "other player"
            } to play a card`
          );
          return;
        }

        this.state = "CompareCards";
      },
    },
    CompareCards: {
      transition(player1Card, player2Card) {
        const player1Value = this.getCardValue(player1Card);
        const player2Value = this.getCardValue(player2Card);
        if (player1Value > player2Value) {
          this.winnerOfBattle = player1;
        } else if (player2Value > player1Value) {
          this.winnerOfBattle = "player2";
        } else {
          this.winnerOfBattle = null;
          this.state = "WarPreparation";
          return;
        }
        this.state = "RewardWinner";
      },
    },
    RewardWinner: {
      transition() {
        // add cards into winner's pile
        this.state = "GameDoneCheck";
      },
    },
    GameDoneCheck: {
      transition() {
        // check if loser's pile remaining = 0
        if (true) {
          this.state = "GameOver";
        } else {
          this.state = "PlayCard";
        }
      },
    },
    GameOver: {
      transition() {
          if (this.deck.getCardsRemainingFromPile(this.deck.player1Id) === 0 && this.deck.getCardsRemainingFromPile(this.deck.player2Id) === 0) {
              alert("TIE: You both suck")
          }else if (this.deck.getCardsRemainingFromPile(this.deck.player1Id) === 0) {
                  alert('Player2 has won')
              } else if (this.deck.getCardsRemainingFromPile(this.deck.player2Id) === 0) {
                  alert(`${player1} has won`)
              }
        return;
      },
    },
    WarPreparation: {
      transition() {
        //wait for 4 cards to be added to each playing piles
        //if both players have no cards
        if (false) {
          this.state = "GameOver";
          return;
        } else if (false) {
          // if one player doesnt have the cards to go to war
          this.state = "RewardWinner";
          return;
        }
        this.state = "War";
      },
    },
    War: {
      transition() {
        this.state = "CompareCards";
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

  async switchPlayer() {
    const temp = this.playerId;

    // Get name of other player
    // Get all piles first
    const playerPile = await this.deck.getPile(
      this.deck.sessionId,
      this.playerId
    );
    const piles = Object.keys(playerPile.piles);
    console.log(piles);

    // Remove current player and all drawing piles
    const filtered = piles.filter(
      (item) =>
        item.indexOf(this.playerId) === -1 &&
        item.indexOf("_Drawing") === -1 &&
        item.indexOf("Player2") === -1
    );
    console.log(filtered);

    const name = filtered[0] ?? null;

    // If player 2 hasnt played, lets make a new player name (default = "Opponent")
    if (!name) {
      this.playerId = "Opponent";
    } else this.playerId = name;

    this.opponentId = temp;

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
      case "A":
        return 14;
      case "0":
        return 10;
      case "J":
        return 11;
      case "Q":
        return 12;
      case "K":
        return 13;
      default:
        return parseInt(card?.value);
    }
  }
  compareCards(player1Card, player2Card) {
    const player1Value = this.getCardValue(player1Card);
    const player2Value = this.getCardValue(player2Card);
    if (player1Value > player2Value) {
      return "player1";
    }
    if (player2Value > player1Value) {
      return "player2";
    }
    return "war";
  }
  async transition(param) {
    const action = this.transitions[this.state]["transition"];
    if (action) {
      await action.call(this, param);
      this.emit();
      return WarLogic.clone(this);
    } else {
      console.log("Invalid action");
      return this;
    }
  }
}
