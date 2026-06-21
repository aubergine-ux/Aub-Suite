// --- 1. DOM ELEMENTS ---
const editor = document.getElementById('markdown-input');
const preview = document.getElementById('preview-output');

const btnDownloadMd = document.getElementById('bdmd');
const btnDownloadHtml = document.getElementById('bdhtml');
const btnClear = document.getElementById('bclear');

const statWords = document.getElementById('sword');
const statChars = document.getElementById('schars');
const statReadTime = document.getElementById('srt');

const btnTheme = document.getElementById('bdark');

function renderHTML(markdownText) {
    let cleanText = markdownText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const blocks = cleanText.split(/\n\s*\n/);

    const processedBlocks = blocks.map(block => {
        let trimmed = block.trim();
        if (!trimmed) return '';

        if (trimmed.startsWith('# ')) {
            return `<h1>${trimmed.replace(/^#\s+/, '')}</h1>`;
        }
        if (trimmed.startsWith('## ')) {
            return `<h2>${trimmed.replace(/^##\s+/, '')}</h2>`;
        }

        trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        trimmed = trimmed.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    });

    preview.innerHTML = processedBlocks.join('\n');
}

function updateAnalytics(text) {
    const charCount = text.length;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    let readTimeStr = "0m";
    if (wordCount > 0) {
        const minutes = wordCount / 200;
        readTimeStr = minutes < 1 ? "< 1m" : `${Math.ceil(minutes)}m`;
    }

    statChars.innerText = `Characters: ${charCount}`;
    statWords.innerText = `Words: ${wordCount}`;
    statReadTime.innerText = `Read Time: ${readTimeStr}`;
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}


editor.addEventListener('input', () => {
    const rawText = editor.value;
    renderHTML(rawText);
    updateAnalytics(rawText);
    localStorage.setItem('markdown_content', rawText);
});

btnDownloadMd.addEventListener('click', () => {
    downloadFile(editor.value, 'document.md', 'text/markdown');
});

btnDownloadHtml.addEventListener('click', () => {
    const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Document</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.8;
            color: #1a1a1a;
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
        }
        h1, h2 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 0.3em; margin-top: 24px; }
        p { margin-bottom: 16px; }
        strong { color: #000; }
        em { color: #555; }
    </style>
</head>
<body>
    ${preview.innerHTML}
</body>
</html>`;

    downloadFile(completeHtml, 'document.html', 'text/html');
});

btnClear.addEventListener('click', () => {
    if(confirm("Are you Sure you want to CLEAR the Workspace?")) {
        editor.value = '';
        renderHTML('');
        updateAnalytics('');
        localStorage.removeItem('markdown_content');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedContent = localStorage.getItem('markdown_content');
    if (savedContent) {
        editor.value = savedContent;
        renderHTML(savedContent);
        updateAnalytics(savedContent);
    }
});

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        btnTheme.innerText = "Light Mode";
    } else {
        btnTheme.innerText = "Dark Mode";
    }
});