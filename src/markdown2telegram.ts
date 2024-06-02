import { marked, MarkedOptions, Token, Tokens } from 'marked';

import { ecsunesc } from './common';

export const convert = (text: string): string => {
    const options: MarkedOptions = {
        async: false,
        breaks: true,
        gfm: true,
        pedantic: false,
        silent: false
    };
    const tokens = marked.lexer(text, options);

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
            target.push(ecsunesc(token.raw));
    }
}

// todo: Tokens.Tag?
// todo: Tokens.Generic?
const processors: Map<string, (token: Token, target: string[]) => void> = new Map([
    [ 'space', (t, s) => processSpace(t as Tokens.Space, s) ],
    [ 'code', (t, s) => processCode(t as Tokens.Code, s) ],
    [ 'heading', (t, s) => processHeading(t as Tokens.Heading, s) ],
    //[ 'table', (t, s) => s.push(t.raw) ],
    //[ 'hr', (t, s) => s.push(t.raw) ],
    //[ 'blockquote', (t, s) => s.push(t.raw) ],
    [ 'list', (t, s) => processList(t as Tokens.List, s) ],
    //[ 'list_item', (t, s) => s.push(t.raw) ],
    [ 'paragraph', (t, s) => processParagraph(t as Tokens.Paragraph, s) ],
    //[ 'html', (t, s) => s.push(t.raw) ],
    [ 'text', (t, s) => processText(t as Tokens.Text, s) ],
    //[ 'def', (t, s) => s.push(t.raw) ],
    //[ 'escape', (t, s) => s.push(t.raw) ],
    [ 'link', (t, s) => processLink(t as Tokens.Link, s) ],
    //[ 'image', (t, s) => s.push(t.raw) ],
    [ 'strong', (t, s) => processStrong(t as Tokens.Strong, s) ],
    [ 'em', (t, s) => processEm(t as Tokens.Em, s) ],
    [ 'codespan', (t, s) => processCodespan(t as Tokens.Codespan, s) ],
    [ 'br', (t, s) => processBr(t as Tokens.Br, s) ],
    [ 'del', (t, s) => processDel(t as Tokens.Del, s) ]
]);

function processSpace(token: Tokens.Space, target: string[]) {
    target.push('\n');
}

function processCode(token: Tokens.Code, target: string[]) {
    // todo: codeblockstyle
    // todo: escaped

    target.push('```');
    if (token.lang != null && token.lang !== '')
        target.push(token.lang);
    target.push('\n');
    if (token.text != null && token.text !== '')
        target.push(token.text);
    target.push('\n```\n');
}

function processHeading(token: Tokens.Heading, target: string[]) {
    target.push('▎*');

    if (token.tokens == null || token.tokens.length == 0)
        target.push(ecsunesc(token.text));
    else
        processTokens(token.tokens, target);

    target.push('*\n\n');
}

function processList(token: Tokens.List, target: string[]) {
    const itemsCount = token.items.length;

    if (itemsCount == 0) {
        target.push(ecsunesc(token.raw));
        return;
    }

    // todo: multilevel
    if (!token.ordered) {
        for (let i = 0; i < itemsCount; i++) {
            processBulletListItem(token.items[i], token.items[i].loose && (i + 1 !== itemsCount), target);
        }
        return;
    }

    // todo: wrong order
    if (token.ordered) {
        for (let i = 0; i < itemsCount; i++) {
            processOrderedListItem(i + 1, token.items[i], token.items[i].loose && (i + 1 !== itemsCount), target);
        }
        return;
    }

    // todo: item.task
    // todo: item.checked
    target.push(ecsunesc(token.raw));
}

function processBulletListItem(token: Tokens.ListItem, loose: boolean, target: string[]) {
    target.push('• ');

    if (token.tokens == null || token.tokens.length == 0)
        target.push(ecsunesc(token.text));
    else
        processTokens(token.tokens, target);

    target.push('\n');
    if (loose)
        target.push('\n');
}

function processOrderedListItem(index: number, token: Tokens.ListItem, loose: boolean, target: string[]) {
    target.push(index.toString());
    target.push('\\. ');

    if (token.tokens == null || token.tokens.length == 0)
        target.push(ecsunesc(token.text));
    else
        processTokens(token.tokens, target);

    target.push('\n');
    if (loose)
        target.push('\n');
}

function processParagraph(token: Tokens.Paragraph, target: string[]) {
    if (token.tokens == null || token.tokens.length == 0)
        target.push(ecsunesc(token.text));
    else
        processTokens(token.tokens, target);

    target.push('\n');
}

function processText(token: Tokens.Text, target: string[]) {
    if (token.tokens == null || token.tokens.length == 0) {
        target.push(ecsunesc(token.text));
        return;
    }

    processTokens(token.tokens, target);
}

function processLink(token: Tokens.Link, target: string[]) {
    if (token.raw == token.href) {
        target.push(ecsunesc(token.href));
        return;
    }

    if (token.tokens != null && token.tokens.length != 0) {
        target.push('[');
        processTokens(token.tokens, target);
        target.push('](');
        target.push(token.href);
        target.push(')');
        return;
    }

    if (token.text != null) {
        target.push('[');
        target.push(ecsunesc(token.text));
        target.push('](');
        target.push(token.href);
        target.push(')');
        return;
    }

    if (token.title != null) {
        target.push('[');
        target.push(ecsunesc(token.title));
        target.push('](');
        target.push(token.href);
        target.push(')');
        return;
    }

    target.push(ecsunesc(token.href));
}

function processStrong(token: Tokens.Strong, target: string[]) {
    target.push('*');

    if (token.tokens == null || token.tokens.length == 0)
        target.push(ecsunesc(token.text));
    else
        processTokens(token.tokens, target);

    target.push('*');
}

function processEm(token: Tokens.Em, target: string[]) {
    target.push('_');

    if (token.tokens == null || token.tokens.length == 0)
        target.push(ecsunesc(token.text));
    else
        processTokens(token.tokens, target);

    target.push('_');
}

function processCodespan(token: Tokens.Codespan, target: string[]) {
    target.push('`');
    target.push(token.text);
    target.push('`');
}

function processBr(token: Tokens.Br, target:string[]) {
    target.push('\n');
}

function processDel(token: Tokens.Del, target: string[]) {
    console.log(token);
    target.push('~');

    if (token.tokens == null || token.tokens.length == 0)
        target.push(ecsunesc(token.text));
    else
        processTokens(token.tokens, target);

    target.push('~');
}