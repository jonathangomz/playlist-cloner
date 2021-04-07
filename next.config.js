module.exports = {
  async redirects() {
    return [
      {
        source: '/cloner',
        destination: '/',
        has: [
          {
            type: 'cookie',
            key: 'token',
            value: '^\s*$'
          }
        ],
        permanent: false,
      }, {
        source: '/',
        destination: '/cloner',
        has: [
          {
            type: 'cookie',
            key: 'token',
            value: '^(?!\s*$).+'
          }
        ],
        permanent: false,
      },
    ]
  },
}