import * as fs from 'fs';
import * as path from 'path';

import { convert } from '../src/markdown2telegram';

const testDataFolder = 'tests/testData';

interface TestCase {
    name: string;
    inputFile: string;
    expectedFile: string;
}

const readTestCases = (): TestCase[] => {
    const regex = /^\d{2}-.*\.in\.txt$/;
  
    const allFiles = fs.readdirSync(testDataFolder).filter(entry => fs.statSync(path.join(testDataFolder, entry)).isFile());
    const inputFiles = allFiles.filter(file => regex.test(file));
    const inputFilesWithOutputFiles = inputFiles.filter(f => fs.existsSync(path.join(testDataFolder, f.slice(0, -7) + '.out.txt')));

    return inputFilesWithOutputFiles.map(inputFile => ({
        name: inputFile.slice(3, -7).replace('-', ' '),
        inputFile: inputFile,
        expectedFile: inputFile.slice(0, -7) + '.out.txt'
    }));
}

describe('Converter', () => {
    const testCases = readTestCases();

    testCases.forEach(testCase =>
        test(testCase.name, () => {
            const input = fs.readFileSync(path.join(testDataFolder, testCase.inputFile), 'utf-8');
            const expected = fs.readFileSync(path.join(testDataFolder, testCase.expectedFile), 'utf-8');
            expect(convert(input)).toBe(expected);
        })
    );
});