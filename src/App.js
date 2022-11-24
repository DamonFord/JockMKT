// Author: Damon Ford

import React, {useState} from 'react';
import CardsApiService from './api/CardsApi';
import Card from './components/Card';
import Hand from './components/Hand';

function App() {
  const faceCards = ["ACE","KING", "QUEEN", "JACK", "10"];

  const [deckId, setDeckId] = useState();
  const [showPrevious, setShowPrevious] = useState(false);
  const [cardsRemaining, setCardsRemaining] = useState(0);
  const [cards, setCards] = useState([]);
  const [previousHands, setPreviousHands] = useState([]);
  const [banner, setBanner] = useState('');
  
  const reset = async () => {
    setCards([]);
    setPreviousHands([]);
    setShowPrevious(false);
    setBanner('');
  };

  const getNewDeck = async () => {
    reset();
    try {
      const response = await CardsApiService.fetchDeck();
      setDeckId(response.deck_id);
      setCardsRemaining(response.remaining);
    } catch(err) {
      alert(`Error getting new deck: ${err.response ? err.response.data : err.message}`);
    }
  };

  const shuffleDeck = async () => {
    reset();
    try {
      const response = await CardsApiService.shuffleDeck();
      setDeckId(response.deck_id);
      setCardsRemaining(response.remaining);
    } catch(err) {
      alert(`Error shuffling deck: ${err.response ? err.response.data : err.message}`);
    }
  };

  const dealCards = async count => {
    try {
      if(cardsRemaining < count) {
        alert(`Not enough cards remaining to draw ${count}.  Shuffle new deck.`);
        return;
      }

      const response = await CardsApiService.drawCard(deckId, count);
      setCardsRemaining(response.remaining);
      setCards(response.cards);

      previousHands.push(response.cards);
      setPreviousHands(previousHands);

      calculateBestHand(response.cards);
      setShowPrevious(false);
    } catch(err) {
      alert(`Error drawing cards: ${err.response ? err.response.data : err.message}`);
    }
  };

  const showPreviousHands = async () => {
    setShowPrevious(!showPrevious);
    setCards([]);
  };

  const calculateBestHand = async currentHand => {
    if(await isRoyalFlush(currentHand)) {
      setBanner('Royal Flush!');
    } else if(await isStraightFlush(currentHand)) {
      setBanner('Straight Flush');
    } else if(await findDuplicates(currentHand, 4)) {
      setBanner('Four of a Kind');
    } else if(await isFullHouse(currentHand)) {
      setBanner('Full House');
    } else if(await isFlush(currentHand)){
      setBanner('Flush');
    } else if(await isStraight(currentHand)) {
      setBanner('Straight');
    } else if(await findDuplicates(currentHand, 3)) {
      setBanner('Three of a Kind');
    } else if(await isTwoPairs(currentHand)) {
      setBanner('Two Pairs');
    } else if(await findDuplicates(currentHand, 2)) {
      setBanner('Pair');
    } else {
      setBanner('High Card');
    }
  };

  const isRoyalFlush = async currentHand => {
    //all cards are ace to 10 and of the same suit
    if(!await isFlush(currentHand)) {
      return false;
    }

    let royalFlush = true;
    for(let card of currentHand) {
      if(!faceCards.includes(card.value)) {
        royalFlush = false;
        break;
      }
    }

    return royalFlush;
  };

  const isStraightFlush = async currentHand => {
    return await isFlush(currentHand) && await isStraight(currentHand);
  };

  const isFullHouse = async currentHand => {
    //value of pair and value of triple must be different
    const triple = await getDuplicateValue(currentHand, 3);
    const pair = await getDuplicateValue(currentHand, 2);    

    return pair && triple;
  };

  const isFlush = async currentHand => {
    const suit = currentHand[0].suit;
    const item = currentHand.find(item => item.suit !== suit);
    if(item) {
      return false;
    } else {
      return true;
    }
  };

  const isStraight = async currentHand => {
    const mappedSet = currentHand.map(item => {
      isNumber(item.value) ? item.sequence = parseInt(item.value, 10) : item.sequence = setNumericValue(item.value);
      return item;
    });
    mappedSet.sort((a, b) => a.sequence - b.sequence);

    //confirm they are in proper sequence
    let found = true;
    for(let i = 0; i < mappedSet.length - 1; i++) {
      if(mappedSet[i].sequence + 1 !== mappedSet[i + 1].sequence) {
        found = false;
        break;
      }
    }

    return found;
  };

  const isTwoPairs = async currentHand => {
    let pairs = [];

    for(let card of currentHand) {
      const items = currentHand.filter(item => item.value === card.value);
      if(items.length === 2 && !pairs.includes(card.value)) pairs.push(card.value);
      if(pairs.length > 1) break;
    }

    return pairs.length > 1;
  };

  const findDuplicates = async (currentHand, count) => {
    let found = false;

    for(let card of currentHand) {
      const items = currentHand.filter(item => item.value === card.value);
      if(items.length === count) {
        found = true;
        break;
      }
    }

    return found;
  };

  const getDuplicateValue = async (currentHand, count) => {
    let duplicate;

    for(let card of currentHand) {
      const items = currentHand.filter(item => item.value === card.value);
      if(items.length === count) {
        duplicate = card.value;
        break;
      }
    }

    return duplicate;
  };

  const isNumber = inputStr => {
    return /^\d+$/.test(inputStr);
  };

  const setNumericValue = inputStr => {
    switch(inputStr) {
      case "JACK":
        return 11;
      case "QUEEN":
        return 12;
      case "KING":
        return 13;
      case "ACE":
        return 14;
      default: 
        console.log(`unknown value ${inputStr}`);
    }
  };
  
  return (
    <div style={body}>
      
      <div style={buttonContainer}>
        <input style={button} type="button" value="Fetch New Deck!" onClick={getNewDeck} />
        <input style={button} type="button" value="Shuffle New Deck" onClick={shuffleDeck} />
        <input style={button} type="button" value="Deal 5 Cards" onClick={() => dealCards(5)} disabled={!deckId} />
        <input style={button} type="button" value="Show Last 10 Hands" onClick={showPreviousHands} />
      </div>

      <div>
        <h1>{banner}</h1>
      </div>

      <div style={cardContainer}>
        {cards.map(card => (
          <Card key={card.code} data={card} />
        ))}
      </div>

      {showPrevious ? (
        previousHands.map((hand, index) => (
          <Hand key={index} cards={hand} />
        ))
      ) : null}
    </div>
  );
}

const body = {
  textAlign: "center",
  paddingTop: "10px",
};

const buttonContainer = {
  marginBottom: "30px",
  marginTop: "30px",
}

const button = {
  color: "#ffffff", 
  backgroundColor: "#f55656", 
  border: "none",
  padding: "10px",
  paddingLeft: "20px",
  paddingRight: "20px",
  fontSize: "20px",
  borderRadius: "10px",
  cursor: "pointer",
  marginRight: "10px",
};

const cardContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: "50px",
  paddingRight: "50px",
}

export default App;