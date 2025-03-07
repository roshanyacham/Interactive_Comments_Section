import React, { useState, useEffect, useCallback } from "react";
import Delete from "./Delete";
import Edit from "./Edit";
import Reply from "./Reply";
import "../styles/AddComment.css";

const AddComment = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyingToReplyId, setReplyingToReplyId] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data.currentUser);
        const commentsWithReplies = data.comments.map((comment) => ({
          ...comment,
          replies: comment.replies ? comment.replies : [],
        }));
        setMessages(commentsWithReplies);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const getMaxId = useCallback((comments) => {
    let maxId = 0;
    comments.forEach((comment) => {
      if (comment.id > maxId) maxId = comment.id;
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => {
          if (reply.id > maxId) maxId = reply.id;
        });
      }
    });
    return maxId;
  }, []);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === "") return;
    const newMsg = {
      id: getMaxId(messages) + 1,
      content: newMessage,
      createdAt: "just now",
      score: 0,
      user: currentUser,
      replies: [],
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  }, [newMessage, messages, currentUser, getMaxId]);

  const handleDeleteComment = useCallback((commentId) => {
    setMessages(prev => 
      prev.map(comment => ({
        ...comment,
        replies: comment.replies.filter(reply => reply.id !== commentId)
      })).filter(comment => comment.id !== commentId)
    );
  }, []);

  const handleUpdateComment = useCallback((commentId, updatedContent) => {
    setMessages(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: updatedContent };
        }
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? { ...reply, content: updatedContent }
              : reply
          )
        };
      })
    );
    setEditingCommentId(null);
  }, []);

  const handlePlus = useCallback((parentId, commentId) => {
    if (commentId === undefined) {
      commentId = parentId;
    }
    const currentVote = userVotes[commentId] || 0;
    if (currentVote === 1) return;

    setMessages(prev => prev.map(msg => {
      if (parentId === commentId && msg.id === commentId) {
        return { ...msg, score: msg.score + 1 };
      }
      if (msg.id === parentId) {
        return {
          ...msg,
          replies: msg.replies.map(reply =>
            reply.id === commentId ? { ...reply, score: reply.score + 1 } : reply
          ),
        };
      }
      return msg;
    }));
    setUserVotes({ ...userVotes, [commentId]: 1 });
  }, [userVotes]);

  const handleMinus = useCallback((parentId, commentId) => {
    if (commentId === undefined) {
      commentId = parentId;
    }
    const currentVote = userVotes[commentId] || 0;
    if (currentVote === -1) return;

    setMessages(prev => prev.map(msg => {
      if (parentId === commentId && msg.id === commentId) {
        return { ...msg, score: msg.score - 1 };
      }
      if (msg.id === parentId) {
        return {
          ...msg,
          replies: msg.replies.map(reply =>
            reply.id === commentId ? { ...reply, score: reply.score - 1 } : reply
          ),
        };
      }
      return msg;
    }));
    setUserVotes({ ...userVotes, [commentId]: -1 });
  }, [userVotes]);

  const handleReply = useCallback((parentId, newReply) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === parentId) {
        return {
          ...msg,
          replies: [...msg.replies, { ...newReply, replies: [] }]
        };
      }
      return msg;
    }));
    setReplyingToCommentId(null);
    setReplyingToReplyId(null);
  }, []);

  const setReplyContext = useCallback((commentId, replyId) => {
    setReplyingToCommentId(commentId);
    setReplyingToReplyId(replyId);
  }, []);

  return (
    <div className="section">
      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          <div className="contianer">
            <button className="score-box">
              <img
                src="./images/icon-plus.svg"
                alt="plus"
                onClick={() => handlePlus(msg.id)}
              />
              <h5>{msg.score}</h5>
              <img
                src="./images/icon-minus.svg"
                alt="minus"
                onClick={() => handleMinus(msg.id)}
              />
            </button>
            <div className="content-box">
              <div className="innerbox">
                <div className="amyrobson">
                  <img
                    className="image-amyrobson"
                    src={msg.user.image.png}
                    alt={msg.user.username}
                  />
                  <h5>{msg.user.username}</h5>
                  <h5>
                    <span>{msg.createdAt}</span>
                  </h5>
                </div>
                <div className="reply">
                  {currentUser && msg.user.username === currentUser.username ? (
                    <div className="edit-delete-container">
                      <Delete commentId={msg.id} onDelete={handleDeleteComment} />
                      <img
                        className="icon-edit"
                        src="./images/icon-edit.svg"
                        alt="update"
                        onClick={() => setEditingCommentId(msg.id)}
                      />
                      <h5>Edit</h5>
                    </div>
                  ) : (
                    <>
                      <img
                        className="icon-reply"
                        src="./images/icon-reply.svg"
                        alt="reply"
                        onClick={() => setReplyContext(msg.id, null)}
                      />
                      <h5 onClick={() => setReplyContext(msg.id, null)}>Reply</h5>
                    </>
                  )}
                </div>
              </div>
              <div className="para">
                {editingCommentId === msg.id ? (
                  <Edit
                    comment={msg}
                    onUpdate={handleUpdateComment}
                    onCancel={() => setEditingCommentId(null)}
                  />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          </div>

          <div className="reply-container">
            {replyingToCommentId === msg.id && replyingToReplyId === null && (
              <Reply
                parentId={msg.id}
                onReply={handleReply}
                currentUser={currentUser}
                replyingTo={msg.user.username}
              />
            )}

            {msg.replies.map((reply) => (
              <React.Fragment key={reply.id}>
                <div className="contianer">
                  <button className="score-box">
                    <img
                      src="./images/icon-plus.svg"
                      alt="plus"
                      onClick={() => handlePlus(msg.id, reply.id)}
                    />
                    <h5>{reply.score}</h5>
                    <img
                      src="./images/icon-minus.svg"
                      alt="minus"
                      onClick={() => handleMinus(msg.id, reply.id)}
                    />
                  </button>
                  <div className="content-box">
                    <div className="innerbox">
                      <div className="amyrobson">
                        <img
                          className="image-amyrobson"
                          src={reply.user.image.png}
                          alt={reply.user.username}
                        />
                        <h5>{reply.user.username}</h5>
                        <h5>
                          <span>{reply.createdAt}</span>
                        </h5>
                      </div>
                      <div className="reply1">
                        {currentUser && reply.user.username === currentUser.username ? (
                          <div className="edit-delete-container">
                            <Delete commentId={reply.id} onDelete={handleDeleteComment} />
                            <img
                              className="icon-edit1"
                              src="./images/icon-edit.svg"
                              alt="update"
                              onClick={() => setEditingCommentId(reply.id)}
                            />
                            <h5>Edit</h5>
                          </div>
                        ) : (
                          <>
                            <img
                              className="icon-reply"
                              src="./images/icon-reply.svg"
                              alt="reply"
                              onClick={() => setReplyContext(msg.id, reply.id)}
                            />
                            <h5 onClick={() => setReplyContext(msg.id, reply.id)}>
                              Reply
                            </h5>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="para">
                      {editingCommentId === reply.id ? (
                        <Edit
                          comment={reply}
                          onUpdate={handleUpdateComment}
                          onCancel={() => setEditingCommentId(null)}
                        />
                      ) : (
                        <p>
                          {reply.replyingTo && (
                            <span className="replying-to">
                              @{reply.replyingTo}
                            </span>
                          )}{" "}
                          {reply.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {replyingToCommentId === msg.id && replyingToReplyId === reply.id && (
                  <div className="nested-reply-container">
                    <Reply
                      parentId={msg.id}
                      onReply={handleReply}
                      currentUser={currentUser}
                      replyingTo={reply.user.username}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      ))}

      <div className="container1">
        {currentUser && <img src={currentUser.image.png} alt="user" />}
        <textarea
          id="message"
          name="message"
          placeholder="Add a comment..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AddComment;