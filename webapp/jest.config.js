module.exports = {
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    "@/(.*)": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ['mock-local-storage']
};
