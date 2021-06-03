// https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

export const encodeHtml = (s: string): string => {
    return s
        // & --> &amp;
        .replace(/\&/g, '&amp;')
        // < --> &lt;
        .replace(/\</g, '&lt;')
        // > --> &gt;
        .replace(/\>/g, '&gt;')
        // " --> &quot;
        .replace(/\"/g, '&#x22;')
        // ' --> &#x27;
        .replace(/\'/g, '&#x27;');
};