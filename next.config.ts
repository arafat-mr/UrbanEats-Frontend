import type { NextConfig } from "next";
import './src/env'
const nextConfig: NextConfig = {
  /* config options here */

  async rewrites(){
  return  [
    {
      source:'/api/auth/:path*',
      destination:`https://urban-eats-backend.vercel.app/api/:path*`
    }
  ]
}
}

export default nextConfig;


