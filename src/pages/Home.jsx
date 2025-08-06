import React, {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import ProfileForm from "./ProfileForm.jsx";
import UserProfileContext from "../context/UserProfileContext.jsx";


const Home = () => {

    const { userProfile } = useContext(UserProfileContext);

    return (
        <>
            <h1>Hello! {userProfile.userName}</h1>
            <div className="select-game">
                <h1>Please Select a Game</h1>

                <Link to="./two-three-seven-ten">
                    <div className="two-three-seven-ten">
                        <img src="https://deckofcardsapi.com/static/img/2H.png" id="two" />
                        <img src="https://deckofcardsapi.com/static/img/3C.png" id="three" />
                        <img src="https://deckofcardsapi.com/static/img/7D.png" id="seven" />
                        <img src="https://deckofcardsapi.com/static/img/0S.png" id="ten" />
                    </div>
                </Link>

                <Link to="./texas-hold-em">
                    <div className="texas-hold-em">
                        <img src="https://deckofcardsapi.com/static/img/AH.png" id="aceOfHearts" />
                        <img src="https://deckofcardsapi.com/static/img/KH.png" id="kingOfHearts" />
                        <img src="https://deckofcardsapi.com/static/img/QH.png" id="queenOfHearts" />
                        <img src="https://deckofcardsapi.com/static/img/JH.png" id="jackOfHearts" />
                        <img src="https://deckofcardsapi.com/static/img/0H.png" id="tenOfHearts" />
                    </div>
                </Link>
            </div>
        </>

    )
}
export default Home;

// for poker assign different hand types values and then compare them. if things are sequential, check if all 5 are, giving that a value but assigning it to the highcard so that the straights can "fight" one another. same concept for flush and 2 pair etc.
// for instance simply high card is gonna be worth whatever the card value is, so ace = 13, but 2 pair is the same point value but plus 20 to insure that it always beats high card (and round numbers are nice)
// it will always look first for how many cards are the same suit via looking at the code, and looking to see if the letters are the same.
// same concept for a pair and such. so yeah i guess each type of win is gonna take up 20 pts slot i think. ill have to look at it... hmm flush and straight seem complicated. like even serperately. as they need
// or maybe its not hard at all. for a flush by itself anyways. because just look at the value of the cards in hand. there can only be one suit that has a flush at a given time, and if its a flush v flush, and neither party has a straight, then its just high card atp, so a flush by default could be lets say 100 pts (idk scaling rn but then if they had the 2, then thatd be 101 pts, vs if someone had the ace itd be 113 pts.
// and a straight flush would be a different section entirely. but same concept)
// for a straight again doesnt actrually matter id have to look at the cheat sheet for what beats what, but i think we add their card, to the highest card in their straight and then divide by 2. this would mean that say p1 has a straight using his 8 and its the 3rd card in the straight, (10 + 8) / 2 = 9
// because this will keep the value low enough to stay within the section of values, but also if 2 ppl have the same (hmmmm id need to look at this because i think it wouldnt actually matter now that i think about it..... maybe just the high card of the straight, and then if 2 ppl have the same point value add half of their seperate high cards point value to the total (keeping the value low ))
//
// pointValue = code.splice(0,1) (the api is number suit, meaning AS = Ace of spades, or 0H = 10 of hearts, 9C = 9 of clubs) (2-9 are just 2-9, 0 = 10, J = 11, Q = 12, K = 13, A = 14 iff in a low straight, its actually a 1)
//
//
// High Card: The highest card when no other hand is formed.
// if nothing special is found, 2 of the same (number/facecard) then just grab their highest card pointValue
//
// One Pair: Two cards of the same rank.
// pointValue + 20
//
// Two Pair: Two different pairs.
// pointValue + 40
//
//
// Three of a Kind: Three cards of the same rank.
// pointValue + 60
//
// Straight: Five consecutive cards of mixed suits.
// pointValue + 80
//
// Flush: Five cards of the same suit.
// pointValue + 100
//
// Full House: Three of a kind and a pair.
// pointValue + 120
//
// Four of a Kind: Four cards of the same rank.
// pointValue + 140
//
// Straight Flush: Five consecutive cards of the same suit.
// pointValue + 160
//
// Royal Flush: Ace, King, Queen, Jack, Ten, all of the same suit.
// 180
