/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')
dotenv.config()

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [process.env.DOMAINS]
    }
}

module.exports = nextConfig
