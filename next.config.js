/** @type {import('next').NextConfig} */

const nextConfig =  {
    env: {
      leagueId: '764',
      serverUrl: "https://tplapp.onrender.com/",
      DATABASE_URL: 'mysql://foszeeyiimlxqi0l5rjt:pscale_pw_Gs6UkFbuZYvE0HabC4SeqvZCZ41RGUpaFCI5TIsFcpW@aws.connect.psdb.cloud/tpl-dashboard-db?ssl={"rejectUnauthorized":true}'
    },
    reactStrictMode: false,
  }
module.exports = nextConfig
