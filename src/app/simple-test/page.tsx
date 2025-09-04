export default function SimpleTest() {
  return (
    <div style={{ padding: '40px', background: 'black', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px' }}>Simple Test Page</h1>
      <p>If you can see this, the server is working!</p>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Quick Links:</h2>
        <ul>
          <li><a href="/test-proxy-images" style={{ color: 'cyan' }}>Test Proxy Images</a></li>
          <li><a href="/agents/nina/bot" style={{ color: 'cyan' }}>Nina Bot</a></li>
          <li><a href="/agents/sue/curate" style={{ color: 'cyan' }}>SUE Curate</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Test Image via Proxy:</h2>
        <img 
          src="/api/proxy-image?url=https%3A%2F%2Fctlygyrkibupejllgglr.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Feden%2Fabraham%2Feverydays%2F0001%2Fimage.jpg"
          alt="Abraham Test"
          style={{ width: '300px', height: '300px', border: '2px solid white' }}
        />
      </div>
    </div>
  );
}