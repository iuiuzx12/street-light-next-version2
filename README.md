# Next

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

## Build Docker

First, run the development server:

## Run windows

cp .next/static to .next/standalone/.next/static
cp .env to .next/standalone/.env

```bash
docker build -t street-light-nextjs:0.0.5 .
```

```bash
NEXT_PUBLIC_PROJECT_ID=MYLOCAL
NEXT_PUBLIC_PROJECT_FULL_NAME=MYLOCAL
SECRET_KEY=mysecretkey
API_URL=http://127.0.0.1:8080
NEXT_PUBLIC_MAP_TYPE=mobile_pole_rtu
NEXT_PUBLIC_MAP_URL=http://127.0.0.1:8080/data/thai/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_LAT=00.617485099126284
NEXT_PUBLIC_MAP_LONG=00.66207970634422
NEXT_PUBLIC_MAP_ZOOM=12
NEXT_PUBLIC_MAP_KM=20
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
