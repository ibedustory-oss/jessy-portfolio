// GITHUB_PAGES=true builds for https://<user>.github.io/jessy-portfolio/
const isGithubPages = process.env.GITHUB_PAGES === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGithubPages ? '/jessy-portfolio' : '',
  assetPrefix: isGithubPages ? '/jessy-portfolio/' : undefined,
  env: {
    // next/image does not auto-prefix basePath onto public/ asset srcs
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? '/jessy-portfolio' : '',
  },
}

export default nextConfig
