/**
 * Verification Script
 * Tests the parser and tree utilities in isolation
 */

// Test the parser with various inputs
console.log('=== Parser Verification ===\n');

// Test 1: Simple element
console.log('Test 1: Simple element');
const html1 = '<div>Hello</div>';
const tree1 = parseHTML(html1);
console.log('Input:', html1);
console.log('Root node type:', tree1.type);
console.log('Root children:', tree1.children.length);
console.log('First child:', TreeUtils.getNodeSummary(tree1.children[0]));
console.log('');

// Test 2: Nested elements with attributes
console.log('Test 2: Nested elements');
const html2 = '<div class="container"><h1>Title</h1></div>';
const tree2 = parseHTML(html2);
console.log('Input:', html2);
const div = tree2.children[0];
console.log('Div tag:', div.tagName);
console.log('Div attributes:', div.attributes);
console.log('Div children:', div.children.length);
console.log('First child tag:', div.children[0].tagName);
console.log('');

// Test 3: Void elements
console.log('Test 3: Void elements');
const html3 = '<div><img src="test.jpg"><br></div>';
const tree3 = parseHTML(html3);
console.log('Input:', html3);
const divVoid = tree3.children[0];
console.log('Div children count:', divVoid.children.length);
console.log('Child 1:', TreeUtils.getNodeSummary(divVoid.children[0]));
console.log('Child 2:', TreeUtils.getNodeSummary(divVoid.children[1]));
console.log('');

// Test 4: Comments
console.log('Test 4: Comments');
const html4 = '<!-- Comment --><div>Text</div>';
const tree4 = parseHTML(html4);
console.log('Input:', html4);
console.log('Root children:', tree4.children.length);
console.log('Child 1 type:', tree4.children[0].type);
console.log('Child 2 type:', tree4.children[1].type);
console.log('');

// Test statistics
console.log('Test 5: Statistics');
const html5 = '<html><head><title>Test</title></head><body><div><h1>Hello</h1><p>World</p></div></body></html>';
const tree5 = parseHTML(html5);
const stats = TreeUtils.getStatistics(tree5);
console.log('Input: Full HTML document');
console.log('Statistics:', stats);
console.log('');

// Test search
console.log('Test 6: Search');
const results = TreeUtils.findByTagName(tree5, 'div');
console.log('Found div tags:', results.length);
const byClass = TreeUtils.findByAttribute(tree5, 'class');
console.log('Found elements with class:', byClass.length);
console.log('');

console.log('=== All verification tests completed ===');
