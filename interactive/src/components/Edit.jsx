import React, { useState } from "react";
import "../styles/Edit.css";

const Edit = ({ comment, onUpdate, onCancel }) => {
  const [editedText, setEditedText] = useState(comment.content);

  const handleUpdate = () => {
    if (editedText.trim() === "") return;
    onUpdate(comment.id, editedText);
  };

  return (
    <div className="edit-container">
      <textarea
        className="edit-textarea"
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
      />
      <div className="edit-actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="update-btn" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
};

export default Edit;
