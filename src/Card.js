import React from 'react';
import './Card.css'; // Import the CSS file for styling

const Card = ({ task, ticketId, onClick }) => {
    return (
        <div className="cam-11-container">
            <div className="cam-11-header">
                <div className="cam-11-id">{ticketId}</div>
                <div className="cam-11-avatar">
                    {/* Add your avatar image here */}
                </div>
            </div>
            <h2 className="cam-11-title">
                {task.title}
            </h2>
            <div className="cam-11-feature-request">
                <div className="cam-11-feature-request-icon">!</div>
                <div className="cam-11-feature-request-text">Feature Request</div>
            </div>
        </div>
    );
};

export default Card;