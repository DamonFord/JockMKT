# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


## About

This project was created by Damon Ford as part of a coding exercise for JockMKT.  
It is designed to simulate a game of poker.  It consumes a public API to get a deck of cards and draw one or more cards.  
It uses Axios package to make the api calls.  
The useState hook is used to store the deckId, current cards and last 10 hands.
Separate React components were created to display an individual card and a full hand.  
With each draw of 5 cards, the best poker hand is calculated and displayed.  
The last 10 hands that were drawn from the current deck can be displayed. 
Each time a new deck is generated, all state variable are cleared and the display is cleared.  
The algorithms for each "card" operation are clean, simple and efficient.  Code reuse is used where ever possible.  
Because the components are small and simple, the styling was done in the same file as the UI.  Typically you would separate styling from UI, but not necessary here givin the simplicity of the componenents.