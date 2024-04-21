import React, { useState, useEffect } from 'react';
import './CommentsSection.css'; // Import CSS for styling

interface Comment {
  id: number;
  text: string;
  postedAt: string;
  userId: string;
  authorName: string;
}

interface CommentsSectionProps {
  recipeId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ recipeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const userIdas = localStorage.getItem('userId');
  const userName = localStorage.getItem('username');

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://localhost:7063/api/Recipe/${recipeId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      // Convert postedAt to a more human-readable format
      const formattedComments = data.map((comment: Comment) => ({
        ...comment,
        postedAt: formatDate(comment.postedAt)
      }));
      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    // Fetch comments for the recipe from the API
    fetchComments();
  }, [recipeId]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    try {
      const response = await fetch(`https://localhost:7063/api/Recipe/${recipeId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            UserId: userIdas,
            RecipeId: recipeId,
            Comment: newComment,
            AuthorName: userName
        })
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      // Refresh comments after adding a new comment
      setNewComment('');
      fetchComments(); // Corrected to call fetchComments function
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to format the postedAt time
  const formatDate = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(timeString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id} className="comment-item">
            <div className="comment-header">
              <p className="comment-author">{comment.authorName}</p>
              <p className="comment-posted-at">Posted {comment.postedAt}</p>
            </div>
            <p className="comment-text">{comment.text}</p>
          </li>
        ))}
      </ul>
      <div className="enterComment">
        <textarea
            className="comment-input"
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleCommentChange}
        />
        <button className="comment-button" onClick={handleSubmitComment}>Send</button>
      </div>
    </div>
  );
};

export default CommentsSection;
