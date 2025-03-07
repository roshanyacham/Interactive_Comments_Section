import React, { useState } from "react";
import "../styles/Delete.css";

const Delete = ({ commentId, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const handleConfirmDelete = () => {
    onDelete(commentId);
    closeModal();
  };
  return (
    <>
      <button className="delete-button" onClick={openModal}>
        <img className="icon-delete" src="./images/icon-delete.svg" alt="delete" />
        <h5>Delete</h5>
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="Delete">
            <div className="item1">
              <h1>Delete comment</h1>
              <p>Are you sure you want to delete this <br></br> comment? This will remove the comment <br></br>and can't be undone.</p>
            </div>
            <div className="item2">
              <button onClick={closeModal}>NO, CANCEL</button>
              <button onClick={handleConfirmDelete}>YES, DELETE</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Delete;
