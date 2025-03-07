import React, { useCallback, memo } from "react";
import "../styles/Delete.css";

const DeleteModal = memo(({ onClose, onConfirm }) => (
  <div className="modal-overlay">
    <div className="Delete">
      <div className="item1">
        <h1>Delete comment</h1>
        <p>
          Are you sure you want to delete this comment? 
          This will remove the comment and can't be undone.
        </p>
      </div>
      <div className="item2">
        <button onClick={onClose}>NO, CANCEL</button>
        <button onClick={onConfirm}>YES, DELETE</button>
      </div>
    </div>
  </div>
));

const Delete = ({ commentId, onDelete }) => {
  const [showModal, setShowModal] = React.useState(false);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);
  
  const handleConfirmDelete = useCallback(() => {
    onDelete(commentId);
    closeModal();
  }, [commentId, onDelete, closeModal]);

  return (
    <>
      <button 
        className="delete-button" 
        onClick={openModal}
        aria-label="Delete comment"
      >
        <img
          className="icon-delete"
          src="./images/icon-delete.svg"
          alt="delete icon"
        />
        <h5>Delete</h5>
      </button>
      
      {showModal && (
        <DeleteModal 
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default memo(Delete);