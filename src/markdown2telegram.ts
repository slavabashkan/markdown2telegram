import { marked, Token, Tokens } from 'marked';

export const convert = (text: string): string => {
    const tokens = marked.lexer(text);

    const result: string[] = [];

    processTokens(tokens, result);

    return result.join('');
}

function processTokens(tokens: Token[], target: string[]) {
    const tokensCount = tokens.length;
    for (let i = 0; i < tokensCount; i++) {
        const token = tokens[i];

        const processor = processors.get(token.type);
        if (processor != null)
            processor(token, target);
        else
            target.push(token.raw);                             
    }
}

// todo: Tokens.Tag?
// todo: Tokens.Generic?
const processors: Map<string, (token: Token, target: string[]) => void> = new Map([
    [ 'space', (t, s) => processSpace(t as Tokens.Space, s) ],
    //[ 'code', (t, s) => s.push(t.raw) ],
    //[ 'heading', (t, s) => s.push(t.raw) ],
    //[ 'table', (t, s) => s.push(t.raw) ],
    //[ 'hr', (t, s) => s.push(t.raw) ],
    //[ 'blockquote', (t, s) => s.push(t.raw) ],
    //[ 'list', (t, s) => s.push(t.raw) ],
    //[ 'list_item', (t, s) => s.push(t.raw) ],
    [ 'paragraph', (t, s) => processParagraph(t as Tokens.Paragraph, s) ],
    //[ 'html', (t, s) => s.push(t.raw) ],
    [ 'text', (t, s) => processText(t as Tokens.Text, s) ],
    //[ 'def', (t, s) => s.push(t.raw) ],
    //[ 'escape', (t, s) => s.push(t.raw) ],
    //[ 'link', (t, s) => s.push(t.raw) ],
    //[ 'image', (t, s) => s.push(t.raw) ],
    [ 'strong', (t, s) => processStrong(t as Tokens.Strong, s) ],
    //[ 'em', (t, s) => s.push(t.raw) ],
    //[ 'codespan', (t, s) => s.push(t.raw) ],
    //[ 'br', (t, s) => s.push(t.raw) ],
    //[ 'del', (t, s) => s.push(t.raw) ]
]);

function processSpace(token: Tokens.Space, target: string[]) {
    target.push(token.raw);
}

function processParagraph(token: Tokens.Paragraph, target: string[]) {
    if (token.tokens == null || token.tokens.length == 0) {
        target.push(token.text);
        return;
    }
    
    processTokens(token.tokens, target);
}

function processText(token: Tokens.Text, target: string[]) {
    if (token.tokens == null || token.tokens.length == 0) {
        target.push(token.text);
        return;
    }

    processTokens(token.tokens, target);
}

function processStrong(token: Tokens.Strong, target: string[]) {
    if (token.tokens == null || token.tokens.length == 0) {
        target.push(token.text);
        return;
    }

    target.push('*');
    processTokens(token.tokens, target);
    target.push('*');
}