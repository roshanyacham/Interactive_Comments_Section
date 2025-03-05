import React, { useState } from "react";
import '../styles/Reply.css';

const Reply = ({ parentId, onReply, currentUser, replyingTo }) => {
    const [replyText, setReplyText] = useState("");

    const handleReply = () => {
        if (replyText.trim() === "") return;
        const newReply = {
            id: Date.now(), 
            content: `@${replyingTo} ${replyText}`, 
            createdAt: "just now",
            score: 0,
            user: currentUser,
        };
        onReply(parentId, newReply);
        setReplyText("");
    };
    return (
        <div className="reply-section">
            {currentUser && (
                <img className="reply-user-img" src={currentUser.image.png} alt={currentUser.username} />
            )}
            <textarea
                placeholder="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
            />
            <button className="button1" onClick={handleReply}>Reply</button>
        </div>
    );
};

export default Reply;
