function escapeChars(str: string): string {
    return str.replace(/([_*[\]()>#+\-=|{}.!~`\\])/g, '\\$1');
};

const unescapeReplacements: {[index: string]: string} = {
    '&gt;': '>',
    '&lt;': '<',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': '\''
};

const escapedCharsRegEx = new RegExp(/&gt;|&lt;|&amp;|&quot;|&#39;/g);

function unescapeString(str: string): string {
    return str.replace(escapedCharsRegEx, (match) => unescapeReplacements[match]);
}

export function ecsunesc(str: string): string {
    return escapeChars(unescapeString(str));
}