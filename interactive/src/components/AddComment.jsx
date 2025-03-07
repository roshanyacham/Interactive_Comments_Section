import React, { useState, useEffect } from "react";
import Delete from "./Delete";
import Edit from "./Edit";
import Reply from "./Reply";
import '../styles/AddComment.css';

const AddComment = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [userVotes, setUserVotes] = useState({});

    useEffect(() => {
        fetch("/data/data.json")
            .then((response) => response.json())
            .then((data) => {
                setCurrentUser(data.currentUser);
                const filteredComments = data.comments.map(comment => ({
                    ...comment,
                    replies: [] 
                }));
                setMessages(filteredComments);
            })
            .catch((error) => console.error("Error loading data:", error));
    }, []);
    

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        const newMsg = {
            id: messages.length + 1,
            content: newMessage,
            createdAt: "just now",
            score: 0,
            user: currentUser,
            replies: []
        };
        setMessages([...messages, newMsg]);
        setNewMessage("");
    };

    const handleDeleteComment = (commentId) => {
        setMessages(messages.filter((msg) => msg.id !== commentId));
    };

    const handleUpdateComment = (commentId, updatedContent) => {
        const updatedMessages = messages.map((msg) => {
            if (msg.id === commentId) {
                return { ...msg, content: updatedContent };
            }
            return msg;
        });
        setMessages(updatedMessages);
        setEditingCommentId(null);
    };

    const handlePlus = (commentId) => {
        const currentVote = userVotes[commentId] || 0;
        if (currentVote === 1) return;
        const updatedMessages = messages.map((msg) =>
            msg.id === commentId ? { ...msg, score: msg.score + 1 } : msg
        );
        setMessages(updatedMessages);
        setUserVotes({ ...userVotes, [commentId]: 1 });
    };

    const handleMinus = (commentId) => {
        const currentVote = userVotes[commentId] || 0;
        if (currentVote === -1) return;
        const updatedMessages = messages.map((msg) =>
            msg.id === commentId ? { ...msg, score: msg.score - 1 } : msg
        );
        setMessages(updatedMessages);
        setUserVotes({ ...userVotes, [commentId]: -1 });
    };

    const handleReply = (parentId, newReply) => {
        setMessages(messages.map(msg => {
            if (msg.id === parentId) {
                return { ...msg, replies: [...msg.replies, newReply] };
            }
            return msg;
        }));
        setReplyingToCommentId(null);
    };
    
    return (
        <div className="section">
            {messages.map((msg) => (
            <React.Fragment key={msg.id}>
                <div className="contianer">
                    <button className="score-box">
                        <img src="./images/icon-plus.svg" alt="plus" onClick={() => handlePlus(msg.id)} />
                        <h5>{msg.score}</h5>
                        <img src="./images/icon-minus.svg" alt="minus" onClick={() => handleMinus(msg.id)} />
                    </button>
                    <div className="content-box">
                        <div className="innerbox">
                            <div className="amyrobson">
                                <img className="image-amyrobson" src={msg.user.image.png} alt={msg.user.username} />
                                <h5>{msg.user.username}</h5>
                                <h5><span>{msg.createdAt}</span></h5>
                            </div>
                            <div className="reply">
                                {currentUser && msg.user.username === currentUser.username ? (
                                <>
                                    <Delete commentId={msg.id} onDelete={handleDeleteComment} />
                                    <img className="icon-edit" src="./images/icon-edit.svg" alt="update" onClick={() => setEditingCommentId(msg.id)} />
                                    <h5>Edit</h5>
                                </>
                                ) : (
                                <>
                                    <img className="icon-reply" src="./images/icon-reply.svg" alt="reply" onClick={() => setReplyingToCommentId(msg.id)} />
                                    <h5 onClick={() => setReplyingToCommentId(msg.id)}>Reply</h5>
                                </>
                                )}
                            </div>
                        </div>
                        <div className="para">
                            {editingCommentId === msg.id ? (
                                <Edit comment={msg} onUpdate={handleUpdateComment} onCancel={() => setEditingCommentId(null)} />
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="reply-container">
                    {replyingToCommentId === msg.id && (
                        <Reply 
                        parentId={msg.id} 
                        onReply={handleReply} 
                        currentUser={currentUser} 
                        replyingTo={msg.user.username} 
                        />
                    )}
                    {msg.replies.map((reply) => (
                        <div key={reply.id} className="contianer">
                            <button className="score-box">
                                <img src="./images/icon-plus.svg" alt="plus" onClick={() => handlePlus(reply.id)} />
                                <h5>{reply.score}</h5>
                                <img src="./images/icon-minus.svg" alt="minus" onClick={() => handleMinus(reply.id)} />
                            </button>
                            <div className="content-box">
                                <div className="innerbox">
                                    <div className="amyrobson">
                                        <img className="image-amyrobson" src={reply.user.image.png} alt={reply.user.username} />
                                        <h5>{reply.user.username}</h5>
                                        <h5><span>{reply.createdAt}</span></h5>
                                    </div>
                                    <div className="reply">
                                        {currentUser && reply.user.username === currentUser.username ? (
                                        <>
                                            <Delete commentId={reply.id} onDelete={handleDeleteComment} />
                                            <img className="icon-edit" src="./images/icon-edit.svg" alt="update" onClick={() => setEditingCommentId(reply.id)} />
                                            <h5>Edit</h5>
                                        </>
                                        ) : (
                                        <>
                                            <img className="icon-reply" src="./images/icon-reply.svg" alt="reply" onClick={() => setReplyingToCommentId(reply.id)} />
                                            <h5 onClick={() => setReplyingToCommentId(reply.id)}>Reply</h5>
                                        </>
                                        )}
                                    </div>
                                </div>
                                <div className="para">
                                    <p>{reply.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </React.Fragment>
            ))}

            <div className="container1">
                {currentUser && <img src={currentUser.image.png} alt="user" />}
                <textarea id="message" name="message" placeholder="Add a comment..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default AddComment;
