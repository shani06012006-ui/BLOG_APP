import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { createBlog } = useContext(BlogContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Both title and body are required.');
      return;
    }
    setSubmitting(true);
    try {
      await createBlog({ title, body });
      navigate('/blogs');
    } catch {
      setError('Failed to create blog. Make sure the backend is running.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/blogs')}>← Back</button>
        <h1>Create New Blog</h1>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Blog Title</label>
            <input
              type="text"
              placeholder="Enter an interesting title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Blog Content</label>
            <textarea
              placeholder="Write your blog content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/blogs')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : ' Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;