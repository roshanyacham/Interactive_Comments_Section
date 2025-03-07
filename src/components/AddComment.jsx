// import React, { useState, useEffect } from "react";
// import Delete from "./Delete";
// import Edit from "./Edit";
// import Reply from "./Reply";
// import '../styles/AddComment.css';

// const AddComment = () => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [editingCommentId, setEditingCommentId] = useState(null);
//     const [replyingToCommentId, setReplyingToCommentId] = useState(null);
//     const [userVotes, setUserVotes] = useState({});

//     useEffect(() => {
//         fetch("/data/data.json")
//             .then((response) => response.json())
//             .then((data) => {
//                 setCurrentUser(data.currentUser);
//                 const filteredComments = data.comments.map(comment => ({
//                     ...comment,
//                     replies: [] 
//                 }));
//                 setMessages(filteredComments);
//             })
//             .catch((error) => console.error("Error loading data:", error));
//     }, []);
    

//     const handleSendMessage = () => {
//         if (newMessage.trim() === "") return;
//         const newMsg = {
//             id: messages.length + 1,
//             content: newMessage,
//             createdAt: "just now",
//             score: 0,
//             user: currentUser,
//             replies: []
//         };
//         setMessages([...messages, newMsg]);
//         setNewMessage("");
//     };

    
//     const handleDeleteComment = (commentId) => {
//         const updatedMessages = messages
//             .map((msg) => {
//                 // If the comment itself needs to be deleted
//                 if (msg.id === commentId) return null;
    
//                 // Check if the comment has replies and filter out the deleted reply
//                 if (msg.replies && msg.replies.some(reply => reply.id === commentId)) {
//                     const updatedReplies = msg.replies.filter(reply => reply.id !== commentId);
//                     return { ...msg, replies: updatedReplies };
//                 }
    
//                 return msg;
//             })
//             .filter(Boolean); // Removes null values
    
//         setMessages(updatedMessages);
//     };
    

//     const handleUpdateComment = (commentId, updatedContent) => {
//         const updatedMessages = messages.map((msg) => {
//             if (msg.id === commentId) {
//                 // Update main comment
//                 return { ...msg, content: updatedContent };
//             } else if (msg.replies) {
//                 // Update reply if found inside replies array
//                 const updatedReplies = msg.replies.map((reply) =>
//                     reply.id === commentId ? { ...reply, content: updatedContent } : reply
//                 );
//                 return { ...msg, replies: updatedReplies };
//             }
//             return msg;
//         });
    
//         setMessages(updatedMessages);
//         setEditingCommentId(null);
//     };
    

//     const handlePlus = (commentId) => {
//         const currentVote = userVotes[commentId] || 0;
//         if (currentVote === 1) return;
//         const updatedMessages = messages.map((msg) =>
//             msg.id === commentId ? { ...msg, score: msg.score + 1 } : msg
//         );
//         setMessages(updatedMessages);
//         setUserVotes({ ...userVotes, [commentId]: 1 });
//     };

//     const handleMinus = (commentId) => {
//         const currentVote = userVotes[commentId] || 0;
//         if (currentVote === -1) return;
//         const updatedMessages = messages.map((msg) =>
//             msg.id === commentId ? { ...msg, score: msg.score - 1 } : msg
//         );
//         setMessages(updatedMessages);
//         setUserVotes({ ...userVotes, [commentId]: -1 });
//     };

//     const handleReply = (parentId, newReply) => {
//         setMessages(messages.map(msg => {
//             if (msg.id === parentId) {
//                 return { ...msg, replies: [...msg.replies, newReply] };
//             }
//             return msg;
//         }));
//         setReplyingToCommentId(null);
//     };
    
//     return (
//         <div className="section">
//             {messages.map((msg) => (
//             <React.Fragment key={msg.id}>
//                 <div className="contianer">
//                     <button className="score-box">
//                         <img src="./images/icon-plus.svg" alt="plus" onClick={() => handlePlus(msg.id)} />
//                         <h5>{msg.score}</h5>
//                         <img src="./images/icon-minus.svg" alt="minus" onClick={() => handleMinus(msg.id)} />
//                     </button>
//                     <div className="content-box">
//                         <div className="innerbox">
//                             <div className="amyrobson">
//                                 <img className="image-amyrobson" src={msg.user.image.png} alt={msg.user.username} />
//                                 <h5>{msg.user.username}</h5>
//                                 <h5><span>{msg.createdAt}</span></h5>
//                             </div>
//                             <div className="reply">
//                                 {currentUser && msg.user.username === currentUser.username ? (
//                                 <>
//                                     <Delete commentId={msg.id} onDelete={handleDeleteComment} />
//                                     <img className="icon-edit" src="./images/icon-edit.svg" alt="update" onClick={() => setEditingCommentId(msg.id)} />
//                                     <h5 onClick={() => setEditingCommentId(msg.id)}>Edit</h5>
//                                 </>
//                                 ) : (
//                                 <>
//                                     <img className="icon-reply" src="./images/icon-reply.svg" alt="reply" onClick={() => setReplyingToCommentId(msg.id)} />
//                                     <h5 onClick={() => setReplyingToCommentId(msg.id)}>Reply</h5>
//                                 </>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="para">
//                         {editingCommentId === msg.id ? (
//                                 <Edit comment={msg} onUpdate={handleUpdateComment} onCancel={() => setEditingCommentId(null)} />
//                         ) : (
//                                 <p>{msg.content}</p>
//                         )}

//                         </div>
//                     </div>
//                 </div>
//                 <div className="reply-container">
//                     {replyingToCommentId === msg.id && (
//                         <Reply 
//                         parentId={msg.id} 
//                         onReply={handleReply} 
//                         currentUser={currentUser} 
//                         replyingTo={msg.user.username} 
//                         />
//                     )}
//                     {msg.replies.map((reply) => (
//                     <div key={reply.id} className="contianer">
//                         <button className="score-box">
//                             <img src="./images/icon-plus.svg" alt="plus" onClick={() => handlePlus(reply.id)} />
//                             <h5>{reply.score}</h5>
//                             <img src="./images/icon-minus.svg" alt="minus" onClick={() => handleMinus(reply.id)} />
//                         </button>
//                         <div className="content-box">
//                             <div className="innerbox">
//                                 <div className="amyrobson">
//                                     <img className="image-amyrobson" src={reply.user.image.png} alt={reply.user.username} />
//                                     <h5>{reply.user.username}</h5>
//                                     <h5><span>{reply.createdAt}</span></h5>
//                                 </div>
//                                 <div className="reply">
//                                     {currentUser && reply.user.username === currentUser.username ? (
//                                         <>
//                                             <Delete commentId={reply.id} onDelete={handleDeleteComment} />
//                                             <img className="icon-edit" src="./images/icon-edit.svg" alt="update" onClick={() => setEditingCommentId(reply.id)} />
//                                             <h5 onClick={() => setEditingCommentId(reply.id)}>Edit</h5>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <img className="icon-reply" src="./images/icon-reply.svg" alt="reply" onClick={() => setReplyingToCommentId(reply.id)} />
//                                             <h5 onClick={() => setReplyingToCommentId(reply.id)}>Reply</h5>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="para">
//                                 {editingCommentId === reply.id ? (
//                                     <Edit comment={reply} onUpdate={handleUpdateComment} onCancel={() => setEditingCommentId(null)} />
//                                 ) : (
//                                     <p>{reply.content}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 ))}

//                 </div>
//             </React.Fragment>
//             ))}

//             <div className="container1">
//                 {currentUser && <img src={currentUser.image.png} alt="user" />}
//                 <textarea id="message" name="message" placeholder="Add a comment..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
//                 <button onClick={handleSendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default AddComment;
import React, { useState, useEffect } from "react";
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

  // Helper function to get the maximum id from all comments and nested replies.
  const getMaxId = (comments) => {
    let maxId = 0;
    comments.forEach((comment) => {
      if (comment.id > maxId) maxId = comment.id;
      if (comment.replies && comment.replies.length > 0) {
        const nestedMax = getMaxId(comment.replies);
        if (nestedMax > maxId) maxId = nestedMax;
      }
    });
    return maxId;
  };

  const handleSendMessage = () => {
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
  };

  // Recursive function to delete a comment or reply at any level
  const deleteCommentRecursively = (comments, commentId) => {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => ({
        ...comment,
        replies: comment.replies ? deleteCommentRecursively(comment.replies, commentId) : []
      }));
  };

  const handleDeleteComment = (commentId) => {
    setMessages(deleteCommentRecursively(messages, commentId));
  };

  const updateCommentsRecursively = (comments, commentId, updatedContent) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, content: updatedContent };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentsRecursively(comment.replies, commentId, updatedContent),
        };
      }
      return comment;
    });
  };

  const handleUpdateComment = (commentId, updatedContent) => {
    setMessages(updateCommentsRecursively(messages, commentId, updatedContent));
    setEditingCommentId(null);
  };

  const handlePlus = (parentId, commentId) => {
    if (commentId === undefined) {
      commentId = parentId;
    }
    const currentVote = userVotes[commentId] || 0;
    if (currentVote === 1) return;

    const updatedMessages = messages.map((msg) => {
      if (parentId === commentId && msg.id === commentId) {
        return { ...msg, score: msg.score + 1 };
      }
      if (msg.id === parentId) {
        return {
          ...msg,
          replies: msg.replies.map((reply) =>
            reply.id === commentId ? { ...reply, score: reply.score + 1 } : reply
          ),
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
    setUserVotes({ ...userVotes, [commentId]: 1 });
  };

  const handleMinus = (parentId, commentId) => {
    if (commentId === undefined) {
      commentId = parentId;
    }
    const currentVote = userVotes[commentId] || 0;
    if (currentVote === -1) return;

    const updatedMessages = messages.map((msg) => {
      if (parentId === commentId && msg.id === commentId) {
        return { ...msg, score: msg.score - 1 };
      }
      if (msg.id === parentId) {
        return {
          ...msg,
          replies: msg.replies.map((reply) =>
            reply.id === commentId ? { ...reply, score: reply.score - 1 } : reply
          ),
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
    setUserVotes({ ...userVotes, [commentId]: -1 });
  };

  const handleReply = (parentId, replyId, newReply) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === parentId) {
          if (replyId) {
            return {
              ...msg,
              replies: msg.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, replies: [...(reply.replies || []), newReply] }
                  : reply
              ),
            };
          } else {
            return { ...msg, replies: [...msg.replies, newReply] };
          }
        }
        return msg;
      })
    );
    setReplyingToCommentId(null);
    setReplyingToReplyId(null);
  };

  const setReplyContext = (commentId, replyId) => {
    setReplyingToCommentId(commentId);
    setReplyingToReplyId(replyId);
  };

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
                onReply={(parentId, newReply) =>
                  handleReply(parentId, null, newReply)
                }
                currentUser={currentUser}
                replyingTo={msg.user.username}
              />
            )}

            {msg.replies.map((reply) => (
              <React.Fragment key={reply.id}>
                <div className="contianer">
                  <button className="score-box">
                    <img className="icon-plus"
                      src="./images/icon-plus.svg"
                      alt="plus"
                      onClick={() => handlePlus(msg.id, reply.id)}
                    />
                    <h5>{reply.score}</h5>
                    <img className="icon-minus"
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
                      replyId={reply.id}
                      onReply={(parentId, newReply) =>
                        handleReply(parentId, reply.id, newReply)
                      }
                      currentUser={currentUser}
                      replyingTo={reply.user.username}
                    />
                  </div>
                )}

                {reply.replies &&
                  reply.replies.map((nestedReply) => (
                    <React.Fragment key={nestedReply.id}>
                      <div className="contianer">
                        <button className="score-box">
                          <img
                            src="./images/icon-plus.svg"
                            alt="plus"
                            onClick={() => handlePlus(msg.id, nestedReply.id)}
                          />
                          <h5>{nestedReply.score}</h5>
                          <img
                            src="./images/icon-minus.svg"
                            alt="minus"
                            onClick={() => handleMinus(msg.id, nestedReply.id)}
                          />
                        </button>
                        <div className="content-box">
                          <div className="innerbox">
                            <div className="amyrobson">
                              <img
                                className="image-amyrobson"
                                src={nestedReply.user.image.png}
                                alt={nestedReply.user.username}
                              />
                              <h5>{nestedReply.user.username}</h5>
                              <h5>
                                <span>{nestedReply.createdAt}</span>
                              </h5>
                            </div>
                            <div className="reply1">
                              {currentUser &&
                              nestedReply.user.username === currentUser.username ? (
                                <div className="edit-delete-container">
                                  <Delete
                                    commentId={nestedReply.id}
                                    onDelete={handleDeleteComment}
                                  />
                                  <img
                                    className="icon-edit1"
                                    src="./images/icon-edit.svg"
                                    alt="update"
                                    onClick={() => setEditingCommentId(nestedReply.id)}
                                  />
                                  <h5>Edit</h5>
                                </div>
                              ) : (
                                <>
                                  <img
                                    className="icon-reply"
                                    src="./images/icon-reply.svg"
                                    alt="reply"
                                    onClick={() =>
                                      setReplyContext(msg.id, nestedReply.id)
                                    }
                                  />
                                  <h5 onClick={() =>
                                      setReplyContext(msg.id, nestedReply.id)
                                    }>
                                    Reply
                                  </h5>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="para">
                            {editingCommentId === nestedReply.id ? (
                              <Edit
                                comment={nestedReply}
                                onUpdate={handleUpdateComment}
                                onCancel={() => setEditingCommentId(null)}
                              />
                            ) : (
                              <p>
                                {nestedReply.replyingTo && (
                                  <span className="replying-to">
                                    @{nestedReply.replyingTo}
                                  </span>
                                )}{" "}
                                {nestedReply.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {replyingToCommentId === msg.id &&
                        replyingToReplyId === nestedReply.id && (
                          <div className="nested-reply-container">
                            <Reply
                              parentId={msg.id}
                              replyId={nestedReply.id}
                              onReply={(parentId, newReply) =>
                                handleReply(parentId, nestedReply.id, newReply)
                              }
                              currentUser={currentUser}
                              replyingTo={nestedReply.user.username}
                            />
                          </div>
                        )}
                    </React.Fragment>
                  ))}
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