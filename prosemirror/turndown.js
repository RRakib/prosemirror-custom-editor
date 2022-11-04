import TurndownService from 'turndown';

const turndown = new TurndownService();

turndown.addRule('underline', {
  filter: node =>
    node.nodeName === 'SPAN' && node.style.textDecoration === 'underline',
  replacement: content => `<u>${content}</u>`
});

export default turndown;
