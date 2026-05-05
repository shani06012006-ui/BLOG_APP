import { useState, useContext } from 'react';
import useFetch from '../hooks/useFetch';
import { BlogContext } from '../context/BlogContext';

const API = 'http://localhost:5000';

function ApiTester() {
  const { blogs, deleteBlog } = useContext(BlogContext);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('POST');

  const { execute: postBlog, loading: posting } = useFetch(`${API}/blogs`, 'POST');
  const { execute: getBlogs, loading: getting } = useFetch(`${API}/blogs`, 'GET');

  const handlePost = async () => {
    if (!title || !body) return;
    const result = await postBlog({ title, body });
    setResponse(result);
    setTitle('');
    setBody('');
  };

  const handleGet = async () => {
    const result = await getBlogs();
    setResponse(result);
  };

  const handleDelete = async (id) => {
    await deleteBlog(id);
    setResponse({ message: `Blog ${id} deleted successfully` });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>🔌 API Tester</h1>
        <span className="api-base-url">Base URL: {API}</span>
      </div>

      {/* Tab Buttons */}
      <div className="tab-bar">
        {['POST', 'GET', 'DELETE'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn tab-${tab} ${activeTab === tab ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab); setResponse(null); }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tester-layout">
        {/* Left — Request */}
        <div className="tester-card">
          <h3>Request</h3>

          {activeTab === 'POST' && (
            <div className="tester-form">
              <div className="endpoint-bar">
                <span className="method-badge post">POST</span>
                <span className="endpoint">/blogs</span>
              </div>
              <div className="form-group">
                <label>title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>
              <div className="form-group">
                <label>body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter blog content"
                  rows={5}
                />
              </div>
              <button className="btn btn-primary" onClick={handlePost} disabled={posting}>
                {posting ? 'Sending...' : '▶ Send Request'}
              </button>
            </div>
          )}

          {activeTab === 'GET' && (
            <div className="tester-form">
              <div className="endpoint-bar">
                <span className="method-badge get">GET</span>
                <span className="endpoint">/blogs</span>
              </div>
              <p className="hint">Fetches all blogs from the backend.</p>
              <button className="btn btn-primary" onClick={handleGet} disabled={getting}>
                {getting ? 'Fetching...' : ' Send Request'}
              </button>
            </div>
          )}

          {activeTab === 'DELETE' && (
            <div className="tester-form">
              <div className="endpoint-bar">
                <span className="method-badge delete">DELETE</span>
                <span className="endpoint">/blogs/:id</span>
              </div>
              <p className="hint">Click Delete on any blog below to remove it.</p>
              <div className="delete-list">
                {blogs.length === 0 && <p className="empty-hint">No blogs available.</p>}
                {blogs.map((blog) => (
                  <div key={blog.id} className="delete-item">
                    <div>
                      <span className="id-badge">ID: {blog.id}</span>
                      <span className="delete-title">{blog.title}</span>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Response */}
        <div className="tester-card">
          <h3>Response</h3>
          {response ? (
            <pre className="response-box">
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : (
            <div className="response-empty">
              <p>Response will appear here after you send a request.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiTester;