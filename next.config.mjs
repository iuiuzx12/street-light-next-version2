import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    //output: 'standalone',
    //reactStrictMode: false,
    reactStrictMode: true,
    target: 'serverless',
    generateEtags: false,
};
 
export default withNextIntl(nextConfig);