FormGen AI – AI-Powered Dynamic Form Generator
A full-stack web application that lets users generate dynamic, shareable forms using natural language prompts, with context-aware memory, image uploads, and submission tracking.

✅ Setup Instructions
1. Clone the Repository
bash
12
2. Install Dependencies
bash
1
3. Environment Variables
Create a .env.local file in the root with the following:

env
12345678910111213
🔑 Get your Groq API key: https://console.groq.com/keys
🌐 Set up MongoDB Atlas: https://cloud.mongodb.com (allow public IP for dev)
☁️ Create Cloudinary account: https://cloudinary.com/console

4. Run the Development Server
bash
1
Visit http://localhost:3000 to use the app.

💬 Example Prompts & Generated Form Samples
Prompt:
"Internship application form with name, email, resume upload, and GitHub profile link"

Generated JSON Schema:
json
1234567891011121314
Prompt:
"Customer feedback survey with rating (1-5), comments, and optional profile picture"

Generated JSON Schema:
json
12345678910111213
🧠 Architecture Notes: Context-Aware Memory Retrieval
To avoid sending thousands of past form schemas to the LLM (which would exceed token limits), the system uses a lightweight semantic retrieval layer:

Metadata Storage: Each generated form is stored in MongoDB with:
userId
prompt (original user request)
purpose (e.g., “job application”, “survey”)
Full schema
Relevance Scoring: When a new prompt arrives:
Extract keywords (e.g., “internship”, “resume”, “GitHub”)
Compare against past prompt and purpose fields
Assign relevance score based on keyword overlap
Top-K Selection: Only the top 5 most relevant forms are selected.
Context Injection: A minimal summary ({ purpose, fields }) of these forms is injected into the LLM prompt.
✅ This ensures the AI receives useful context without bloating the prompt.

🔜 Future: Replace keyword matching with vector embeddings (e.g., Pinecone + all-MiniLM-L6-v2).

🚀 Scalability Handling
Challenge
Solution
100k+ forms per user
Only recent 100 forms are considered for retrieval (configurable)
LLM token limits
Context trimmed to top-5 forms; each summarized to <100 tokens
Latency
Retrieval is O(100) — fast even at scale; caching possible
Database load
MongoDB Atlas scales automatically; indexes on userId + createdAt
This design ensures the system remains responsive and cost-effective even with massive form histories.

⚠️ Limitations
Image Uploads
Frontend uses basic <input type="file">
Cloudinary upload endpoint exists (/api/upload) but is not yet integrated into form submission flow
Files are not auto-uploaded on selection
Validation Rules
Only basic HTML5 validation (required, email, etc.)
No custom rules (min/max length, regex, etc.)
Context Retrieval
Uses keyword matching (not true semantic search)
May miss nuanced relevance in complex prompts
Submission Dashboard
Forms are listed, but individual submissions are not yet displayed per form
🔮 Future Improvements
✅ Integrate Cloudinary Upload in public form submission flow
✅ Add Zod-based validation rules in schema (min/max, pattern, etc.)
✅ Show submissions grouped by form in dashboard
🚀 Replace keyword retrieval with Pinecone vector search
🌐 Deploy to Vercel with MongoDB Atlas and Cloudinary production accounts
📊 Add analytics: submission counts, field completion rates
🔒 Add form expiration & access control (private vs public forms)
🎨 Rich form builder UI for manual schema editing
🛠️ Tech Stack
Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, React Hook Form
Backend: Next.js API Routes (light serverless backend)
Database: MongoDB Atlas
AI: Groq + llama-3.1-8b-instant (free, fast, production-ready)
Media: Cloudinary (free tier)
Auth: Custom JWT with HTTP-only cookies
