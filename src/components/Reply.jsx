import React, { useState, useCallback, memo } from "react";
import '../styles/Reply.css';

const Reply = memo(({ parentId, onReply, currentUser, replyingTo }) => {
    const [replyText, setReplyText] = useState("");

    const handleTextChange = useCallback((e) => {
        setReplyText(e.target.value);
    }, []);

    const handleReply = useCallback(() => {
        const trimmedText = replyText.trim();
        if (!trimmedText) return;

        const newReply = {
            id: Date.now(),
            content: trimmedText,
            replyingTo: replyingTo,
            createdAt: "just now",
            score: 0,
            user: currentUser,
        };
        
        onReply(parentId, newReply);
        setReplyText("");
    }, [replyText, parentId, currentUser, replyingTo, onReply]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleReply();
        }
    }, [handleReply]);

    return (
        <div className="reply-section">
            {currentUser && (
                <img 
                    className="reply-user-img" 
                    src={currentUser.image.png} 
                    alt={currentUser.username} 
                />
            )}
            <textarea
                placeholder={`Reply to @${replyingTo}...`}
                value={replyText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <button 
                className="button1" 
                onClick={handleReply}
                disabled={!replyText.trim()}
            >
                Reply
            </button>
        </div>
    );
});

Reply.displayName = 'Reply';

export default Reply;