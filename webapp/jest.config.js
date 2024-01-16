module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.ts$": "ts-jest"
  },
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    "@/(.*)": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ['mock-local-storage'],

};
