# HumanBit Assignment 1 & Assignment 2

Assignment 1 : Build a Dashboard to search Candidates from Linkedin based on Filters like Location, Company, Experience Level and Job Role.

Assignment 2: Created a Landing Page with Job Description Generator which create JD with help of AI and have filters to modify it on basis of Role, Company, Experience etc.

## Tech Stack

**Client:** Next.js, typescript, TailwindCSS

**API:** LinkedIn - Rapid API, OpenAI API

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Features Assignment 1

- Search Candidates
- Required/Core Filters
- Include/Exclude Functionality
- Proper display of selected Filters
- Filters Panel
- Result Panel

## Features Assignment 1

- Landing page
- Job Description Generator using Assignment
- Filters for Job Description
- Candidate list relevant to the JD generated

## Environment Variables

To run assignment 1, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_RAPIDAPI_KEY`
`NEXT_PUBLIC_RAPIDAPI_HOST`

To run assignment 2, you will need to add the following environment variables to your .env file

`RAPIDAPI_KEY`
`RAPIDAPI_HOST`
`OPENAI_API_KEY`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Demo

Assignment 1: [https://human-bit-assignment.vercel.app/](https://human-bit-assignment.vercel.app/)
Assignment 2: [https://human-bit-assignment-ohvf.vercel.app/](https://human-bit-assignment-ohvf.vercel.app/)
