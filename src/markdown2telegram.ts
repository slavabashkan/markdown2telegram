import { marked } from 'marked';

export const convert = (text: string): string => {
    const tokens = marked.lexer(text);
    return text;
}