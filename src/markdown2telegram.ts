import { marked } from 'marked';

export const convert = (text: string): string => {
    const tokens = marked.lexer(text);

    const result: string[] = [];

    tokens.forEach(t => result.push(t.raw));

    return result.toString();
}