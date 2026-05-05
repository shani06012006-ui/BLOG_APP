import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';

function BlogList() {
  const { blogs, loading, error, deleteBlog } = useContext(BlogContext);
  const navigate = useNavigate();

  if (loading) return <div className="center"><div className="spinner"></div></div>;
  if (error) return <div className="center"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>All Blogs</h1>
        <button className="btn btn-primary" onClick={() => navigate('/createblog')}>
          + New Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <p>📭 No blogs yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/createblog')}>
            Create your first blog
          </button>
        </div>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="blog-card-body" onClick={() => navigate(`/blogs/${blog.id}`)}>
                <h2>{blog.title}</h2>
                <p>{blog.body.length > 120 ? blog.body.substring(0, 120) + '...' : blog.body}</p>
                <span className="blog-date">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </span>
              </div>
              <div className="blog-card-actions">
                <button className="btn btn-outline" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  Read
                </button>
                <button className="btn btn-outline" onClick={() => navigate(`/edit/${blog.id}`)}>
                   Edit
                </button>
                <button className="btn btn-danger" onClick={() => deleteBlog(blog.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;