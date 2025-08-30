# nota [![Netlify Status](https://api.netlify.com/api/v1/badges/b7b659a5-5a7e-495d-9f3a-ea3443ea9bc7/deploy-status)](https://app.netlify.com/projects/notama/deploys)

nota is a super user-friendly note-taking app featuring an AI assistant that lets you ask anything about your notes. Inspired by the sleek look of [t3.chat](https://t3.chat), nota offers a seamless design experience powered by [shadcn/ui](https://ui.shadcn.com/).

> **Live Demo:** Check out nota at [nota.ma](https://nota.ma)! (currently [notama.netlify.app](notama.netlify.app) until DNS Propagation takes effect.)

## Features

- **AI-Assisted Notes:** Ask questions about your notes and get smart, instant answers.
- **Modern, Seamless UI:** Inspired by t3.chat, nota delivers a beautiful, distraction-free interface.
- **Built with shadcn/ui:** Leverages shadcn/ui for rapid, customizable component styling.
- **Simple & Intuitive:** Designed for everyone, with user experience front and center.

## Technologies Used

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/)
- **AI Assistant:** OpenAI API
- **Backend & Database:** Supabase
- **Authentication:** Supabase Auth
- **Hosting:** Netlify ([nota.ma](https://nota.ma))
- **Other:** t3 stack inspiration, modern state management

## Getting Started

To run nota locally:

1. **Set up a Supabase project:**

   - [Create a new project on Supabase](https://supabase.com/) and configure your database and authentication.
   - Alternatively, *reach out to me* to collaborate using the pre-existing Supabase project.
2. **Configure local environment variables:**

   - Copy `.env.example` to `.env.local`.
   - Add your Supabase URL, anon/public key, and other required environment variables.
3. **Install dependencies and start the app:**

   ```bash
   git clone https://github.com/kilyess/nota.git
   cd nota
   npm install
   npm run dev
   ```

## Inspiration

nota's UI is inspired by the clean, chat-focused design of t3.chat, reimagined for seamless note-taking and AI-powered assistance.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the Apache-2.0 license.
