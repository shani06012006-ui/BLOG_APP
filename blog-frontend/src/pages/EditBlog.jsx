import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';

function EditBlog() {
  const { id } = useParams();
  const { blogs, updateBlog } = useContext(BlogContext);
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.id === parseInt(id));

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setBody(blog.body);
    }
  }, [blog]);

  if (!blog) return <div className="center">Blog not found.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Both fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      await updateBlog(parseInt(id), { title, body });
      navigate(`/blogs/${id}`);
    } catch {
      setError('Failed to update blog.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-page-header">
        <button className="btn btn-ghost" onClick={() => navigate(`/blogs/${id}`)}>← Back</button>
        <h1>Edit Blog</h1>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Blog Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Blog Content</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(`/blogs/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;