import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Backbutton() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Navigate back by one step in history
    };

    return (
        <div class="BB">
        <button onClick={goBack}><FontAwesomeIcon icon="fa-solid fa-arrow-left-long" />
        </button></div>
    );
}

export default Backbutton;
