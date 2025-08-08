import { Deck } from "../util/Deck";

const userName = JSON.parse(localStorage.getItem('userName'))
const player1 = userName;

export class WarLogic {
  deck;
  winnerOfBattle;
  transitions = {
    PlayCard: {
      async transition(playerId) {
        //wait for both players to play a card
        // look to see how many cards remaining in the given player's drawing pile
        const player1MadeTurn =
          (await this.deck.getCardsRemainingFromPile(
            this.deck.player1Id + "_Drawing"
          )) > 0;
        const player2MadeTurn =
          (await this.deck.getCardsRemainingFromPile(
            this.deck.player2Id + "_Drawing"
          )) > 0;

        const currentPlayerMadeTurn =
          playerId === this.deck.player1Id ? player1MadeTurn : player2MadeTurn;

        const otherPlayerMadeTurn =
          playerId !== this.deck.player1Id ? player1MadeTurn : player2MadeTurn;

        if (!currentPlayerMadeTurn) {
          console.log(`Playing ${playerId}'s top card`);
          await this.deck.drawCards(playerId);
        } //draw a card out of the player's drawingPile and place into the playingPile
        if (!otherPlayerMadeTurn) {
          console.log("waiting for other player to play a card");
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

  static async createNewGame(sessionId, player1Id, player2Id) {
    const deck = await Deck.create(sessionId, player1Id, player2Id);

    return new WarLogic(deck);
  }

  constructor(deck) {
    if (!deck) throw new Error("Deck must be provided");
    this.deck = deck;
    this.state = "PlayCard";
  }

  static clone(game) {
    const clone = new WarLogic(game.deck);
    clone.state = game.state;
    clone.winnerOfBattle = game.winnerOfBattle;
    return clone;
  }

  async refresh(playerId) {
    const opponentId =
      playerId === this.deck.player1
        ? this.deck.player2Id
        : this.deck.player1Id;


    // one http req to get piles (and see requested)


    // 
    const hasPlayerPlayed =
      (await this.deck.getCardsRemainingFromPile(playerId + "_Drawing")) > 0;

    const hasOpponentPlayed =
      (await this.deck.getCardsRemainingFromPile(opponentId + "_Drawing")) > 0;

    if (hasPlayerPlayed && hasOpponentPlayed && this.state === "PlayCard") {
      this.state = "CompareCards";
      await this.deck.refresh();
      return WarLogic.clone(this);
    } else {
      return this;
    }
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
      return WarLogic.clone(this);
    } else {
      console.log("Invalid action");
      return this;
    }
  }
}
