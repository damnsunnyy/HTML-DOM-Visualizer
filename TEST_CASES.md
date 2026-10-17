/**
 * Test Cases for HTML DOM Tree Visualizer
 * 
 * This file documents all test cases verified for the application
 */

// Test Case 1: Simple element with text
const TEST_1 = `<div>Hello</div>`;

// Test Case 2: Nested elements with attributes and whitespace
const TEST_2 = `<div class="container">
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</div>`;

// Test Case 3: Full HTML document with head and body
const TEST_3 = `<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <div id="app">
      <button class="btn">Click</button>
    </div>
  </body>
</html>`;

// Test Case 4: Void elements and multiple siblings
const TEST_4 = `<div>
  <p>One</p>
  <p>Two</p>
  <img src="test.jpg" alt="Test">
  <br>
</div>`;

// Test Case 5: Comments, attributes, and mixed content
const TEST_5 = `<!-- Comment -->

<div data-id="123" class="box">
  Hello <strong>world</strong>
</div>`;

// Test Case 6: Multiple attributes and complex nesting
const TEST_6 = `<div class="container" id="main" data-value="test">
  <header class="header">
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h1>Article Title</h1>
      <p>First paragraph with <em>emphasis</em> and <strong>strong</strong> text.</p>
      <p>Second paragraph.</p>
    </article>
  </main>
</div>`;

// Test Case 7: Self-closing tags
const TEST_7 = `<form>
  <input type="text" placeholder="Enter text">
  <input type="checkbox" checked>
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="style.css">
  <br />
</form>`;

// Test Case 8: Malformed HTML (unclosed tags, missing quotes)
const TEST_8 = `<div>
  <p>This paragraph is not closed
  <p>Second paragraph
  <span class=test>No quotes
</div>`;

// Test Case 9: Deeply nested structure
const TEST_9 = `<div>
  <div>
    <div>
      <div>
        <div>
          <p>Deeply nested text</p>
        </div>
      </div>
    </div>
  </div>
</div>`;

// Test Case 10: Multiple comments and whitespace
const TEST_10 = `<!-- Header comment -->
<div>
  <!-- Nested comment -->
  <h1>Title</h1>
  <!-- Footer comment -->
</div>`;

/**
 * Expected output structure for Test 1:
 * 
 * document
 * └── div
 *     └── "Hello"
 */

/**
 * Expected output structure for Test 3:
 * 
 * document
 * └── html
 *     ├── head
 *     │   └── title
 *     │       └── "Test"
 *     └── body
 *         └── div [id="app"]
 *             └── button [class="btn"]
 *                 └── "Click"
 */

/**
 * Verification checklist:
 * ✓ Simple elements render correctly
 * ✓ Text nodes are captured
 * ✓ Attributes are preserved
 * ✓ Nested elements maintain hierarchy
 * ✓ Comments are parsed
 * ✓ Void elements (img, br, input, meta, link) handled
 * ✓ Multiple siblings are listed
 * ✓ Whitespace between tags doesn't create unwanted text nodes
 * ✓ Complex nested structures work
 * ✓ Malformed HTML is handled gracefully
 * ✓ Tree expand/collapse functionality works
 * ✓ Node selection and details display works
 * ✓ Statistics are calculated correctly
 * ✓ Search functionality finds nodes
 * ✓ Export/Copy JSON works
 * ✓ Dark theme renders correctly
 * ✓ Responsive layout works
 */
