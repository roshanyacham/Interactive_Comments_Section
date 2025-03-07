import React, { useState, useCallback, memo } from "react";
import "../styles/Edit.css";

const Edit = memo(({ comment, onUpdate, onCancel }) => {
  const [editedText, setEditedText] = useState(comment.content);

  const handleTextChange = useCallback((e) => {
    setEditedText(e.target.value);
  }, []);

  const handleUpdate = useCallback(() => {
    const trimmedText = editedText.trim();
    if (!trimmedText) return;
    
    if (trimmedText === comment.content) {
      onCancel();
      return;
    }
    onUpdate(comment.id, trimmedText);
  }, [editedText, comment.id, comment.content, onUpdate, onCancel]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onCancel();
    if (e.key === 'Enter' && e.ctrlKey) handleUpdate();
  }, [onCancel, handleUpdate]);

  return (
    <div className="edit-container">
      <textarea
        className="edit-textarea"
        value={editedText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Edit your comment..."
        autoFocus
      />
      <div className="edit-actions">
        <button 
          className="cancel-btn" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="update-btn" 
          onClick={handleUpdate}
          disabled={!editedText.trim() || editedText.trim() === comment.content}
        >
          Update
        </button>
      </div>
    </div>
  );
});

Edit.displayName = 'Edit';

export default Edit;