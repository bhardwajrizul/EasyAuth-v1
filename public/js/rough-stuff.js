import { annotate } from 'https://unpkg.com/rough-notation?module';
const n1 = document.querySelector('#userName');
const n2 = document.querySelector('#underlineStuff');

const a1 = annotate(n1, { type: 'highlight', color: '#bf2b6c', iterations: 1, animationDuration: 4000, strokeWidth: 1});
const a2 = annotate(n2, { type: 'underline', color: '#ff8066', iterations: 10, animationDuration: 10000, strokeWidth: 1, multiline: true});

a1.show();
a2.show();