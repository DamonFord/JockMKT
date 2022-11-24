// Author: Damon Ford

import React from 'react';

function Hand(props) {
    return (
        <div>
            {props.cards.map(card => (
                <img key={card.code} style={cardStyle} src={card.image} alt='card_image'></img>
            ))}
        </div>
    );
};

const cardStyle = {
    height: "100px",
    width: "75px",
    marginRight: "10px",
}

export default Hand;