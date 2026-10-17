# Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### Step 1: Open the Application
Navigate to the project directory and run:

```bash
cd /tmp/html-dom-visualizer
python3 -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

### Step 2: Load Sample HTML
Click the **"Sample"** button in the top-right corner of the left panel.

### Step 3: Parse the HTML
Click the **"Parse & Visualize"** button.

### Step 4: Explore the Tree
- Click the ▶ arrows to expand/collapse nodes
- Click any node to view its details in the right panel
- Switch between tabs (DOM Tree, Node Details, Statistics)

## 📝 Try These Examples

### Example 1: Simple Paragraph
```html
<p>Hello World!</p>
```

### Example 2: Blog Post
```html
<article>
  <header>
    <h1>Article Title</h1>
    <time>2024-01-01</time>
  </header>
  <section>
    <p>First paragraph</p>
    <p>Second paragraph</p>
  </section>
</article>
```

### Example 3: Form with Inputs
```html
<form>
  <input type="text" placeholder="Name">
  <input type="email" placeholder="Email">
  <textarea>Message</textarea>
  <button type="submit">Send</button>
</form>
```

### Example 4: Nested Lists
```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li>
      <a href="/docs">Docs</a>
      <ul>
        <li><a href="/docs/guide">Guide</a></li>
        <li><a href="/docs/api">API</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

## 🎯 Key Features to Try

### 1. **Expand All / Collapse All**
Use the ⬇ and ⬆ buttons next to the search box to expand or collapse all nodes at once.

### 2. **Search Nodes**
Type in the search box to find nodes by:
- Tag name (e.g., "button", "div")
- Attribute name (e.g., "class", "id")
- Attribute value (e.g., "btn", "container")
- Text content

Matching nodes will be highlighted and ancestors will automatically expand.

### 3. **View Node Details**
1. Click any node in the tree
2. Switch to the "Node Details" tab
3. See:
   - Node type
   - Tag name
   - All attributes
   - Number of children
   - Parent element
   - Full text content

### 4. **View Statistics**
Click the "Statistics" tab to see:
- Total nodes
- Element count
- Text nodes
- Comments
- Total attributes
- Tree depth

### 5. **Export as JSON**
- **Copy JSON**: Copies the entire tree structure to clipboard
- **Export**: Downloads the tree as a JSON file named `dom-tree.json`

## 🛠 Troubleshooting

### Issue: Browser shows blank page
**Solution**: Make sure the HTTP server is running and accessible at http://localhost:8000

### Issue: Parsing seems stuck
**Solution**: Very large HTML (>1MB) may take a moment. Wait for it to complete.

### Issue: Search not finding nodes
**Solution**: Search is case-insensitive. Try different keywords or try exact attribute names.

### Issue: JSON export not working
**Solution**: Check browser console for errors. Make sure you have permission to download files.

## 📱 Responsive Design

The application works on all screen sizes:
- **Desktop**: Full side-by-side layout
- **Tablet**: Stacked layout, switch between input and output
- **Mobile**: Vertical layout optimized for touch

## ⌨️ Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE 11 | ❌ Not supported |

## 🎨 Customization

To change the color theme, edit `style.css` and modify the CSS variables:

```css
:root {
  --color-bg-primary: #1e1e1e;      /* Main background */
  --color-accent: #007acc;           /* Highlight color */
  --color-element: #ce9178;          /* Element tag color */
  --color-tag: #569cd6;              /* Tag name color */
  --color-text-node: #4ec9b0;        /* Text node color */
}
```

## 📚 Learn More

- See [README.md](README.md) for comprehensive documentation
- See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for architecture details
- Check [TEST_CASES.md](TEST_CASES.md) for test coverage

## 🐛 Found a Bug?

The application is built to be robust, but if you encounter issues:

1. Check the browser console for errors (F12)
2. Try with simpler HTML to isolate the issue
3. Review the parser logic in `js/parser.js`
4. Check the test cases for similar scenarios

## 🎓 Learning Resources

### Understanding the Parser
The HTML parser in `js/parser.js` demonstrates:
- Character-by-character tokenization
- Recursive descent parsing
- Attribute extraction
- Tree building algorithms

### Understanding the Tree Utilities
The `js/tree.js` file shows:
- Tree traversal algorithms
- Statistics calculation
- Search and filtering
- JSON serialization

### Understanding the UI
The `js/app.js` file demonstrates:
- DOM manipulation
- Event handling
- State management
- Component rendering

## ✨ Tips and Tricks

1. **Keyboard Navigation**: Use Tab to navigate buttons
2. **Long HTML**: For very long HTML, use Collapse All first, then expand specific sections
3. **Complex Nesting**: The tree automatically highlights depth with indentation
4. **Multiple Tests**: Paste different HTML examples without clearing to run multiple tests
5. **Export Workflow**: Copy JSON and paste into tools like:
   - JSON viewers
   - Text editors
   - JSON formatting tools
   - Data visualization tools

## 🚀 Next Steps

1. Explore the sample HTML by clicking "Sample"
2. Try entering your own HTML
3. Experiment with search
4. View statistics
5. Export the tree as JSON
6. Examine the source code to understand how it works

Enjoy the HTML DOM Tree Visualizer! 🌳
