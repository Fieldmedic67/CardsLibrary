
export class WarLogic {
    player1Id; //player pile ID
    drawingPile1;
    playingPile1;
    player1PreviousRemaining;
    player2Id; //player pile ID
    drawingPile2;
    playingPile2;
    player2PreviousRemaining;
    getRemaining;
    params = {};
    winnerOfBattle;
    transitions = {
        PlayCard: {
            transition(playerId) { //wait for both players to play a card
                // look to see how many cards remaining in the given player's drawing pile
                const currentPlayer1Remaining = this.getRemaining(this.player1Id);
                const currentPlayer2Remaining = this.getRemaining(this.player2Id);
                const previousRemaining = playerId === this.player1Id ? this.player1PreviousRemaining : this.player2PreviousRemaining
                const currentRemaining = playerId === this.player1Id ? currentPlayer1Remaining : currentPlayer2Remaining
                if (currentRemaining != previousRemaining) {console.log("playing your top card")} //draw a card out of the player's drawingPile and place into the playingPile
                else {console.log("waiting for other player to play a card")}
                if (currentPlayer1Remaining != this.player1PreviousRemaining && currentPlayer2Remaining != this.player2PreviousRemaining)
                    this.state = "CompareCards"
            }
        },
        CompareCards: {
            transition(player1Card, player2Card) {
                const player1Value = this.getCardValue(player1Card);
                const player2Value = this.getCardValue(player2Card);
                if (player1Value > player2Value) {
                    winnerOfBattle = player1
                }
                else if (player2Value > player1Value) {
                    winnerOfBattle = player2
                }
                else {
                    winnerOfBattle = null
                    this.state = "WarPreparation"
                    return
                }
                this.state = "RewardWinner"
            }
        },
        RewardWinner: {
            transition() { // add cards into winner's pile
                this.state = "GameDoneCheck"
            }
        },
        GameDoneCheck: {
            transition() {
                // check if loser's pile remaining = 0
                if (true) { this.state = "GameOver" }
                else { this.state = "PlayCard" }
            }
        },
        GameOver: {
            transition() {
                return
            }
        },
        WarPreparation: {
            transition() { //wait for 4 cards to be added to each playing piles
                //if both players have no cards
                if (false) {
                    this.state = "GameOver"
                    return
                }
                else if (false) { // if one player doesnt have the cards to go to war
                    this.state = "RewardWinner"
                    return
                }
                this.state = "War"
            }
        },
        War: {
            transition() {
                this.state = "CompareCards"
            }
        },
    }
    constructor() {
        this.state = "PlayCard"
        this.player1PreviousRemaining = 26;
        this.player2PreviousRemaining = 26;
        this.player1Id = "player1";
        this.player2Id = "player2";
    }
    getCardValue(card) {
        switch (card?.value) {
            case "A":
                return 14
            case "0":
                return 10
            case "J":
                return 11
            case "Q":
                return 12
            case "K":
                return 13
            default:
                return parseInt(card?.value)
        }
    }
    compareCards(player1Card, player2Card) {
        const player1Value = this.getCardValue(player1Card);
        const player2Value = this.getCardValue(player2Card);
        if (player1Value > player2Value) { return "player1" }
        if (player2Value > player1Value) { return "player2" }
        return ("war")
    }
    transition(param) {
        const action = this.transitions[this.state]["transition"];
        if (action) {
            action.call(this, param);
        } else {
            console.log('Invalid action');
        }
    }
}



export function CreateWarGame() {
    return new WarLogic()
}