import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  testPathIgnorePatterns: ['/node_modules/', '/test/fixtures/'],
  testRegex: ['/test/index.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
};

export default jestConfig;
