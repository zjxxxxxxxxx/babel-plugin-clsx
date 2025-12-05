import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
  testRegex: ['/index.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
};

export default jestConfig;
