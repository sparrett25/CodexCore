// /src/utils/markdown.js
export function renderMarkdown(md = "") {
  // Very small, no-deps renderer (headings, bold/italic, links, lists, paragraphs)
  let html = md.trim();

  // Escape HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Headings ###### … #
  html = html.replace(/^######\s?(.*)$/gm, "<h6>$1</h6>")
             .replace(/^#####\s?(.*)$/gm, "<h5>$1</h5>")
             .replace(/^####\s?(.*)$/gm, "<h4>$1</h4>")
             .replace(/^###\s?(.*)$/gm, "<h3>$1</h3>")
             .replace(/^##\s?(.*)$/gm, "<h2>$1</h2>")
             .replace(/^#\s?(.*)$/gm, "<h1>$1</h1>");

  // Bold **text** and Italic *text*
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
             .replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Unordered lists
  html = html.replace(/^(?:\s*[-*]\s.+\n?)+/gm, block => {
    const items = block.trim().split(/\n/).map(line => line.replace(/^\s*[-*]\s/, "").trim());
    return `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
  });

  // Paragraphs: wrap remaining lines that aren't already block elements
  html = html.replace(/^(?!<h\d|<ul|<\/ul>|<li|<\/li>)(.+)$/gm, "<p>$1</p>");

  return html;
}
