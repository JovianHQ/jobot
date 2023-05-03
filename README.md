# Jobot - The AI That Does Everything\*

[![](https://i.imgur.com/1sPbh8y.png)](https://jobot.dev)

This repository contains the source code for [Jobot](https://jobot.dev), a general purpose, programmable & extensible AI being developed by [Jovian](https://jovian.com), using state of the art machine learning models and APIs. Follow the development of Jobot here: https://howtobuildanai.com

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
- ✅ REST API
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

## API Access

Aside from the [web app](https://jobot.jovian.com), you can access Jobot via the following API endpoints to build your own AI-powered applications:

### Send OTP to Email

Use this endpoint generate a per-user API key. It sends an OTP to a user's email for generating an API key.

**API endpoint**: https://jobot.jovian.com/api/auth/send-otp

**Method**: POST

**Request Body (JSON)**:

```
{
    "email": string
}
```

**Response**:

```
{
    "message": "Verification code sent"
}
```

### Verify OTP & Generate API Key

Use this endpoint to verify the OTP entered by the user and generate an API key that you can use for future requests.

**API endpoint**: https://jobot.jovian.com/api/auth/verify-otp

**Method**: POST

**Request Body (JSON)**:

```
{
    "email": string,
    "code": string
}
```

**Response**:

```
{
  "apiKey": {
    "key": "2211cf69-36bc-4c6d-9081-ae06a03fd235",
    "user_id": "1234",
    "name": "API Key - Thu Sep 30 2021 11:51:50 GMT-0700 (Pacific Daylight Time)",
  }
}
```

Use the `key` in the `Authorization` header for endpoints requiring user authentication.


## Chat Completions

Use this to send messages to the ChatGPT API and get back a response. Include an authorization header with a valid Jobot API key. It's identical to [OpenAI's chat completions API](https://platform.openai.com/docs/api-reference/chat/create).


**Request:**

```
POST /chat
Content-Type: application/json
Authorization: Bearer API_KEY

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hi there!"
    }
  ],
  "stream": false
}
```

If `stream` is true, the response will be streamed token by token.

**Response**:
```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: OPTIONS,GET,POST
Access-Control-Allow-Headers: x-requested-with,content-type

{
  "id": "cmpl-2yV4sKhw1JDD9Nf28XNuKlEJ",
  "object": "text_completion",
  "created": 1644693056,
  "model": "text-davinci-002",
  "choices": [
    {
      "text": "Hello! How can I assist you today?",
      "index": 0,
      "logprobs": null,
      "finish_reason": "stopped"
    }
  ]
}
```

### List Conversations

TODO


### Create Conversation

TODO


### Retrieve Conversation Messages

TODO


### Update Conversation

TODO


### Retrieve Skills

`GET https://jobot.jovian.com/api/skills` (unauthenticated): Provides a list of all available skills as JSON


### Retrieve a User's Skills

`GET https://jobot.jovian.com/api/:username/skills` (uauthneticated): Provides a list of skills provided by a user as JSON



### Retrieve a Single Skill

`GET https://jobot.jovian.com/api/:username/:skill` (authenticated): Use it to get the details for
   a specific skill



### Start Conversation for a Skill

Use it to send input data and messages to a specific skill

`POST https://jobot.jovian.com/api/:username/:skill` (authenticated) 

**Authentication Headers**: Create an API key at [https://jobot.jovian.com/account](https://jobot.jovian.com/account) and include it as an `"Authorization"` header with value `"Bearer API_KEY"`

**Request Body**: (similar to [OpenAI chat completions](https://platform.openai.com/docs/api-reference/chat/create) but can include an `inputData` key for initial inputs that are used to create system and user prompt)

```json
{
  "inputData": {
    "topic": "NextJS",
    "difficulty": "Medium"
  },
  "messages": [
    {
      "role": "assistant",
      "content": "What is the purpose of the `_app.js` file in a Next.js project?\n\na) It is used for server-side rendering of the entire application\nb) It is used to customize the `App` component used by Next.js\nc) It is used to configure the routing of the Next.js application\nd) It is used to define the endpoints of the application's API\n\nPlease answer with the corresponding letter of the correct option."
    },
    {
      "role": "user",
      "content": "D. Who are you?"
    }
  ]
}
```

**Response Body** (similar to [OpenAI chat completions](https://platform.openai.com/docs/api-reference/chat/create)):

```json
{
  "id": "chatcmpl-79anDx2EENOfDIFmieHWkaJwR7Bwu",
  "object": "chat.completion",
  "created": 1682520739,
  "model": "gpt-3.5-turbo-0301",
  "usage": {
    "prompt_tokens": 327,
    "completion_tokens": 33,
    "total_tokens": 360
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "I am Jobot, an AI assistant created by Jovian. My purpose is to help users test their understanding of a topic by asking them multiple choice questions."
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

Apart from the web app, you can interact with Jobot via a REST API. The following endpoints are supported:


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

3. Create 2 tables `skills` and `profiles` on the [Supabase Dashboard](https://app.supabase.com/project/_/database/tables) with the following columns:

<img width="1083" alt="image" src="https://user-images.githubusercontent.com/1560745/233788441-18da5e96-2149-4a04-a311-4a93e8e4e1ae.png">

<img width="1228" alt="image" src="https://user-images.githubusercontent.com/1560745/233788449-588f9898-e00b-47ba-b4e2-063ea11687e2.png">

`profiles` table:

| Name       | Description    | Data Type         | Format  |
| ---------- | -------------- | ----------------- | ------- |
| id         | No description | uuid              | uuid    |
| username   | No description | character varying | varchar |
| first_name | No description | character varying | varchar |
| last_name  | No description | character varying | varchar |
| avatar_url | No description | character varying | varchar |

`skills` table:

| Name          | Description                               | Data Type                | Format      |
| ------------- | ----------------------------------------- | ------------------------ | ----------- |
| id            | No description                            | bigint                   | int8        |
| created_at    | No description                            | timestamp with time zone | timestamptz |
| updated_at    | No description                            | timestamp with time zone | timestamptz |
| user_id       | References the users's ID from auth.users | uuid                     | uuid        |
| slug          | No description                            | character varying        | varchar     |
| title         | No description                            | character varying        | varchar     |
| description   | No description                            | character varying        | varchar     |
| system_prompt | No description                            | character varying        | varchar     |
| user_prompt   | No description                            | character varying        | varchar     |
| inputs        | No description                            | jsonb                    | jsonb       |

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
