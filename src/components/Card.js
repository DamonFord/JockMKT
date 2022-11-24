// Author: Damon Ford

import React from 'react';

function Card(props) {
    return (
        <div>
            <img src={props.data.image} alt='card_image'></img>
        </div>
    );
};

export default Card;