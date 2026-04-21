
**RATE LIMITER SERVICE**


▶️ **Steps to Run the Project**

1️⃣ **Clone the Repository**
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2️⃣ **Install Dependencies**
npm install

3️⃣ **Setup Redis**
- Use Cloud Redis
- Use Redis Cloud / Upstash
- Copy the connection URL

4️⃣ **Configure Environment Variables**
- Create a .env.local file in root:
- REDIS_URL=your_redis_connection_url

5️⃣ **Start the Application**
- npm run dev
- 👉 Server will run on:
- http://localhost:3000


🧪 **Testing APIs Using Postman**
🔹 Base URL
- http://localhost:3000
🔥 **1. Test Main Requests API (Rate Limited)**
**Endpoint
****POST /api/requests**

**Steps in Postman**
 - Open Postman
 -   Select POST method
   -   Enter URL:
      -  http://localhost:3000/api/requests
      -    Go to Body → raw → JSON
- **Add sample request body:
{
  "userId": "user-1",
  "action": "test-request"
}**
Click Send

- ✅**Expected Behavior**
First few requests → 200 OK
After limit exceeded → 429 Too Many Requests

- 🧪 **How to Properly Test Rate Limiting**
Click Send multiple times quickly (10–15 times)
You should start seeing:
429 Too Many Requests

👉 This proves rate limiting is working

- 🔁 **2. Test Retry Queue API**
Endpoint
POST /api/retry
Steps in Postman
  Select POST
    Enter URL:
       http://localhost:3000/api/retry
         Go to Body → raw → JSON
**Add:
{
  "task": "retry-job",
  "attempt": 1
}**
Click Send
- ✅ **Expected Behavior**
- Request gets added to Redis queue
- Worker (worker.ts) processes it
- You’ll see logs in terminal

🔍 **How to Verify**
- Check your terminal running Next.js:
- Processing job: retry-job
👉 This confirms queue + retry logic works

📊 **3. Test Stats API**
- Endpoint
- GET /api/stats
- Steps in Postman
- Select GET
- Enter URL:
- http://localhost:3000/api/stats
- Click Send

✅ **Expected Response Example**
**{
  "totalRequests": 15,
  "rateLimited": 5,
  "queuedJobs": 3
}**

👉 This shows:
Total API hits
Rate-limited requests
Queue size




📈 **What I Would Improve With More Time (Rate Limiter Service)**

⚙️ **1. Advanced Rate Limiting Algorithms**
- Current implementation likely uses a fixed window counter
- Improve with:
- Sliding Window Log → more accurate control
- Token Bucket / Leaky Bucket → smoother traffic handling
- This prevents sudden bursts at window boundaries

🎯 **2. Granular & Dynamic Limits**
- Add support for:
- Per-user limits
- Per-IP limits
- Per-endpoint limits
- Enable dynamic configuration (e.g., premium users get higher limits)

⚡ **3. Distributed Rate Limiting**
- Ensure consistency across multiple server instances
- Use Redis with:
- Atomic operations (INCR, EXPIRE)
- Lua scripts for strong consistency
- This makes it scalable in multi-instance deployments

🧠 **4. Smarter Key Design**
- Improve Redis key structure:
- rate_limit:{userId}:{endpoint}
- Helps:
- Better tracking
- Easier debugging
- More control over limits

📊 **5. Observability & Metrics**
- Track:
- Requests per second
- Rate-limited requests
- Burst traffic patterns
- Integrate:
- Prometheus + Grafana
- Helps in real-time monitoring and tuning

🔐 **6. Abuse & Security Protection**
- Detect suspicious patterns:
- Rapid bursts
- Bot-like behavior
- Add:
- Temporary IP bans
- CAPTCHA trigger (if needed)

🔁 **7. Graceful Degradation**
- Instead of hard blocking:
- Return Retry-After headers
- Provide fallback responses
- Improves user experience under load

⚡ **8. Performance Optimization**
- Use:
- Redis pipelining
- Lua scripts to reduce network calls
- Reduce latency in high-throughput systems

🧪 **9. Testing Under Load**
- Simulate real-world traffic using:
- k6 / JMeter
- Validate:
- Accuracy of rate limits
- Behavior under concurrency



🧠 **Design Decisions (Rate Limiter Service)**

⚡ **1. Using Redis as the Core Store**
- Chose Redis because:
- In-memory → low latency
- Supports atomic operations like INCR, EXPIRE
- Ideal for high-throughput systems

- 👉 This ensures fast and consistent rate limit checks.

⏱️ **2. Fixed Window Counter Approach**
- Implemented a fixed time window (e.g., per minute)
- Each request:
- Increments a counter
- Counter resets after TTL expires
- Why chosen:
- Simple to implement
- Efficient for most use cases
- Minimal overhead
- Trade-off:
Allows burst traffic at window boundaries

🔐 **3. Atomic Operations for Concurrency Safety**
- Used Redis commands like:
- INCR
- EXPIRE
👉 Ensures:
- No race conditions
- Accurate counting under concurrent requests

🧩 **4. Key Design Strategy**
- Example key:
rate_limit:{userId}
- Why:
- Easy to track per-user usage
- Scalable and extendable to:
- rate_limit:{userId}:{endpoint}

⚖️ **5. Stateless API Design**
- Rate limiter logic is stateless at application level
- All state stored in Redis

👉 **Benefits:**
- Easy horizontal scaling
- Multiple instances share same limit state

🚫 **6. Hard Limit Enforcement**
- Once limit is exceeded:
- API returns 429 Too Many Requests

👉 Simple and predictable behavior for clients

🔁**7. **TTL-Based Reset Mechanism****
- Used Redis TTL (EXPIRE) for automatic reset

👉 **Avoids:**
- Manual cleanup
- Extra cron jobs

⚙️ **8. Lightweight Middleware Approach**
- Rate limiting applied at API layer (before business logic)

👉**Benefits:**
- Protects backend resources early
- Reduces unnecessary processing
