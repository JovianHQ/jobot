# Jobot - The AI That Does Everything\*

[![](https://i.imgur.com/1sPbh8y.png)](https://jobot.dev)

This repository contains the source code for [Jobot](https://jobot.dev), a general purpose, programmable & extensible AI being developed by [Jovian](https://jovian.com), using state of the art machine learning models and APIs. Follow the development of Jobot here: https://howotobuildanai.com

## Abilities

Jobot has (or will soon have) the following abilities:

- ✅ Intelligence (powered by GPT-3.5/4)
- ✅ Skills (preconfigured prompts)
- ⬜️ Hearing (powered by Whisper)
- ⬜️ Speech (powered by Neural2)
- ⬜️ Memory (powered by Databases/Embeddings)
- ⬜️ Creativitiy (powered by DALL-E 2)
- ⬜️ Vision (powered by GPT-4)

Users will also be able to create and publish their own skills ([see examples](https://jovian.com/jobot)) for various use cases.

## Interfaces

Jobot is (or will be) accessible to users in the following ways:

- ✅ Web Application
- ⬜️ REST API
- ⬜️ Discord Bot
- ⬜️ Slack Bot
- ⬜️ WhatsApp Bot
- ⬜️ iOS & Android App
- ⬜️ VS Code Extension
- ⬜️ Voice Assistant
- ⬜️ and much more...

Developers will also be able to build their own applications using Jobot's REST API. Starter templates will be provided for building various types of applications using Jobot.

## Tech Stack

Jobot uses the following technology stack:

- [OpenAI APIs](https://platform.openai.com/docs/api-reference)
- [React](https://react.dev/)
- [NextJS](https://nextjs.org/)
- [Vercel](https://vercel.com)
- [Supabase](https://supabase.com)
- [Tailwind](https://tailwindcss.com)
- [GitHub Codespaces](https://github.com/features/codespaces)

This is not an exhaustive list, please check the source code for a full list of dependencies.

## Contributing

Jobot is completely open-source and we welcome all forms of contributions from the community. Here's how you can contribute to Jobot:

- Report bugs & suggest features by [creating an issue](https://github.com/JovianHQ/jobot/issues)
- Fix bugs & add features by [opening a pull request](https://github.com/JovianHQ/jobot/pulls)
- To show your love for the project, [star this repository](https://github.com/JovianHQ/jobot)
- Ask a question or provide suggestions by [starting a discussion](https://jovian.com/learn/how-to-build-an-ai/discussions)
- Blog or tweet about the project to help spread the word

## Deployment

Follow these steps to deploy your own copy of Jobot the Vercel:

1. Fork [this repostory](https://github.com/jovianhq/jobot) to get your own copy of the source code

2. Sign up on https://platform.openai.com and generate an [Open API Key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)

3. Sign up on [Supabase](https://supabase.com) and set up a new project

   - Change [Signup & Login Email Templates](https://jovian.com/learn/how-to-build-an-ai) for your project to the following:
   
   Confirm Signup:
   
   ```
<h2>Confirm your signup</h2>

<p>Enter this code to sign up:</p>
<p>{{ .Token }}</p>

   ```
   
   Magic Link:
   ```
<h2>Verification Code</h2>

<p>Enter this verification code:</p>
<p>{{ .Token }}</p>
   ```

4. Sign up on [Vercel](https://vercel.com) and deploy Jobot's NextJS application

   - Follow [these instructions](https://vercel.com/docs/concepts/deployments/git#deploying-a-git-repository) and select `jobot-web` as the root directory

   - Make sure to set the following environment variables:

     - `NEXT_PUBLIC_SUPABASE_URL` - Your [Supabase Project URL](https://app.supabase.com/project/_/settings/api)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your [Supabase Anon API key](https://app.supabase.com/project/rbvvbmvfzbgqpqghtvgg/settings/api?)
     - `OPENAI_API_KEY` - Your OpenAI API key

5. (Optional) [Connect a custom domain](https://vercel.com/docs/concepts/projects/domains/add-a-domain) (e.g. https://jobot.dev ) to your Vercel project.

## Development

After you've deployed your own copy of Jobot, follow these additional steps to develop Jobot:

1. Clone your repository to your computer or open it online [using GitHub Codespaces](https://docs.github.com/en/codespaces/developing-in-codespaces/creating-a-codespace-for-a-repository#creating-a-codespace-for-a-repository)

   - If you're developing locally, make sure to install the latest versions of [Node.js](https://nodejs.org/en) and [Visual Studio Code](https://code.visualstudio.com/)

2. Open the repository on VS Code, launch the terminal, and run these commands:

   ```
   cd jobot-web     # enter NextJS project
   npm install      # install dependencies
   npm run dev      # run development server
   ```

   You should now be able to open up the application in a new browser tab and interact with it.

3. Create a file `.env.local` inside the `jobot-web` folder and add proper values for the following enviroment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=xxx
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   OPENAI_API_KEY=xxx
   ```

4. Make any desired code changes and the development server should refresh the application automatically

5. [Stage, commit, and push](https://zeroesandones.medium.com/how-to-commit-and-push-your-changes-to-your-github-repository-in-vscode-77a7a3d7dd02) your changes back to the GitHub repository when ready

6. If you've set up a Vercel project, any changes made to the `main` branch of your repository will get pushed automatically

**NOTE**: If you'd like to contribute your changes back to the original repository https://github.com/jovianhq/jobot, please [create a pull request from your fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork). We welcome community contributions to Jobot!

Check out our course for a deatailed walkthrough of the codebase: https://howotobuildanai.com

## Disclaimer

\* Jobot can't do "everything" just yet, but it soon will. 😉
