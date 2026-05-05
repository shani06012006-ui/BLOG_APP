import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';

function BlogDetail() {
  const { id } = useParams();
  const { blogs, deleteBlog } = useContext(BlogContext);
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog) return (
    <div className="center">
      <p>Blog not found.</p>
      <button className="btn btn-outline" onClick={() => navigate('/blogs')}>← Back</button>
    </div>
  );

  const handleDelete = async () => {
    await deleteBlog(blog.id);
    navigate('/blogs');
  };

  return (
    <div className="container">
      <button className="btn btn-ghost" onClick={() => navigate('/blogs')}>← Back</button>
      <div className="detail-card">
        <h1>{blog.title}</h1>
        <span className="blog-date">
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </span>
        <div className="divider"></div>
        <p className="body-text">{blog.body}</p>
        <div className="detail-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/edit/${blog.id}`)}>
             Edit Blog
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
             Delete Blog
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;