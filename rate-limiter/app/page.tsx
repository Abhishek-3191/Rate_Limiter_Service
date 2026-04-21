export default function Home() {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>🚀 Rate Limited API Service</h1>
      <p>This project exposes backend APIs:</p>

      <ul>
        <li>POST /api/request</li>
        <li>GET /api/stats</li>
        <li>POST /api/retry</li>
      </ul>

      <p>👉 Use Postman or curl to test the APIs.</p>
    </div>
  );
}