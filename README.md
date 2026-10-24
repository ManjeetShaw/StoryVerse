Create AI-generated illustrated storybooks from your ideas.

StoryVerse is a full-stack web application that turns a user's story prompt into a multi-page storybook with generated text and illustrations. Users can create an account, generate books, and read saved stories in the browser.
Features
- User registration and login with JWT-based authentication
- AI-generated stories from a user-provided prompt
- Customizable page count, language, and illustration style
- AI-generated illustrations for story pages
- Personal bookshelf to view saved books
- Book reader with page-by-page story content
- Optional voice narration support
- Responsive React interface
Tech Stack
Frontend: React, Vite, Tailwind CSS, React Router, Lucide React
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Authentication: JSON Web Tokens (JWT), bcrypt
AI text generation: Google Gemini, with xAI Grok client support
Image generation: Cloudflare Workers AI — FLUX.1 schnell
Narration: ElevenLabs text-to-speech support
Project Structure
StoryVerse/
├── Frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── Backend/
    ├── scripts/
    └── src/
        ├── config/
        ├── middleware/
        ├── models/
        ├── public/images/
        ├── routes/
        ├── services/
        ├── story/
        └── utils/
Run Locally
Requirements
- Node.js 18 or later
- A MongoDB database (local or hosted)
- API credentials for the AI services you want to use
1. Start the backend
Open a terminal in the Backend directory:
npm install
Create a .env file in Backend/ and configure the required values:
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
Optional settings for alternate text generation and narration:
TEXT_MODEL=gemini-3.5-flash
GROK_API_KEY=your_grok_api_key
GROK_MODEL=grok-2-latest
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
DEFAULT_PAGE_COUNT=8
IMAGE_CONCURRENCY=3
Start the server:
npm run dev
The backend runs on http://localhost:5000 by default. Check http://localhost:5000/health to verify that it is running.
2. Start the frontend
Open another terminal in the Frontend directory:
npm install
Create a .env file in Frontend/ if you want to override the configured backend URL:
VITE_API_URL=http://localhost:5000
Start the Vite development server:
npm run dev
Open http://localhost:3000 in your browser.
Main API Routes
Method	Endpoint	Purpose
GET	/health	Check backend status
POST	/auth/register	Register a user
POST	/auth/login	Log in a user
POST	/books/generate	Generate a storybook (authentication required)
GET	/books	Get the logged-in user's books
GET	/books/:id	Retrieve a book by ID
DELETE	/books/:id	Delete a book (authentication required)


How It Works
1. The user enters a story idea and chooses options such as language, page count, and art style.
2. The backend sends the prompt to the configured text-generation service.
3. The image-generation service creates illustrations for the story pages.
4. The backend processes the generated pages and saves the book data in MongoDB.
5. The frontend displays the saved book in the reader and makes it available from the user's bookshelf.
Environment and Security
- Keep API keys, database credentials, and JWT_SECRET in environment variables.
- Do not commit .env files or expose secrets in frontend code.
- AI generation requires valid credentials and may take time depending on the selected page count and provider availability.
