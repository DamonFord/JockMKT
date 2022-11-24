// Author: Damon Ford

import axios from 'axios';

const baseUrl = 'https://deckofcardsapi.com/api/deck';

const fetchDeck = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/new`)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    });
};

const shuffleDeck = async () => {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/new/shuffle?deck_count=1`)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    });
};

const drawCard = async (deckId, count) => {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/${deckId}/draw?count=${count}`)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    });
};

const exportObject = {
    fetchDeck,
    shuffleDeck,
    drawCard,
};

export default exportObject;