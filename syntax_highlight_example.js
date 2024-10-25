// Generate code snippet
//
// 

import * as fs from 'fs';
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
themes: ['slack-dark', 'min-light', 'andromeeda', 'github-light-default', 'material-theme-lighter'],
langs: ['c']
})

// langs: [JSON.parse(fs.readFileSync("./c3-grammar.json", "utf-8"))],

// Throw error, `javascript` is not loaded
await highlighter.loadLanguage(
    // "c",
JSON.parse(fs.readFileSync("./c3-grammar.json", "utf-8"))
) // load the language

let example = highlighter.codeToHtml(
// `import std::io;

// fn void! test()
// {
//     // Return an Excuse by adding '?' after the fault.
//     return IoError.FILE_NOT_FOUND?;
// }

// fn void main(String[] args)
// {
//     // If the Optional is empty, assign the
//     // Excuse to a variable:
//     if (catch excuse = test())
//     {
//         io::printfn("test() gave an Excuse: %s", excuse);
//     }
// }`,
// `fn void! main()
// {
//     int* x = mem::new(int);
//     // Free memory on scope exit
//     defer free(x); 

//     io::printfn("x: %s", *x);
// }`,
`<*
 @require x > 0 "x gt 0" 
*>
fn float divide(int x)
{
    return 1.0f / foo;
}`,
    { 
        lang: 'c3', 
        // theme: 'slack-dark' 
        themes: { 
            light: 'min-light',
            // light: 'github-light-default',
            dark: 'andromeeda',
        }
    }
)


console.log(example)

// example from `node syntax_highlight_example.js`
// replaced {} with their HTML escapes 

// } is &#125;
// { is &#123;

// // white or
// #ffffff is replaced with rgb(249 250 251)

