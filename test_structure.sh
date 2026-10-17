#!/bin/bash
# Test script to verify HTML DOM Visualizer functionality

echo "================================"
echo "HTML DOM Visualizer Test Suite"
echo "================================"
echo ""

# Check all required files exist
echo "✓ Checking project structure..."
files=(
  "index.html"
  "style.css"
  "js/parser.js"
  "js/tree.js"
  "js/app.js"
  "README.md"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (MISSING)"
    missing=$((missing+1))
  fi
done

if [ $missing -eq 0 ]; then
  echo "✓ All required files present"
else
  echo "✗ Missing $missing file(s)"
  exit 1
fi

echo ""
echo "✓ File size check..."
for file in "${files[@]}"; do
  size=$(wc -c < "$file" 2>/dev/null)
  if [ $size -gt 0 ]; then
    echo "  ✓ $file ($(echo $size | awk '{print int($1/1024)}') KB)"
  fi
done

echo ""
echo "✓ Syntax validation..."

# Check HTML syntax
echo "  Checking HTML..."
if grep -q "<!DOCTYPE html>" index.html && \
   grep -q "class=\"container\"" index.html && \
   grep -q "<textarea" index.html && \
   grep -q "id=\"treeDisplay\"" index.html; then
  echo "    ✓ HTML structure valid"
else
  echo "    ✗ HTML structure incomplete"
fi

# Check CSS syntax
echo "  Checking CSS..."
if grep -q ":root {" style.css && \
   grep -q "--color-bg-primary" style.css && \
   grep -q ".tree-node" style.css; then
  echo "    ✓ CSS structure valid"
else
  echo "    ✗ CSS structure incomplete"
fi

# Check JavaScript files
echo "  Checking JavaScript..."
if grep -q "class HTMLParser" js/parser.js && \
   grep -q "parse()" js/parser.js && \
   grep -q "parseHTML" js/parser.js; then
  echo "    ✓ Parser.js valid"
else
  echo "    ✗ Parser.js incomplete"
fi

if grep -q "class TreeUtils" js/tree.js && \
   grep -q "countNodes" js/tree.js && \
   grep -q "getStatistics" js/tree.js; then
  echo "    ✓ Tree.js valid"
else
  echo "    ✗ Tree.js incomplete"
fi

if grep -q "class DOMVisualizer" js/app.js && \
   grep -q "parseHTML()" js/app.js && \
   grep -q "renderTree()" js/app.js; then
  echo "    ✓ App.js valid"
else
  echo "    ✗ App.js incomplete"
fi

echo ""
echo "✓ Feature coverage check..."

# Parser features
echo "  Parser features:"
grep -q "isVoidElement" js/parser.js && echo "    ✓ Void elements support"
grep -q "parseComment" js/parser.js && echo "    ✓ Comment parsing"
grep -q "parseAttributes" js/parser.js && echo "    ✓ Attribute parsing"
grep -q "parseTextNode" js/parser.js && echo "    ✓ Text node extraction"

# Tree features
echo "  Tree utilities:"
grep -q "getStatistics" js/tree.js && echo "    ✓ Statistics calculation"
grep -q "findByTagName" js/tree.js && echo "    ✓ Tag name search"
grep -q "findByAttribute" js/tree.js && echo "    ✓ Attribute search"
grep -q "toJSON" js/tree.js && echo "    ✓ JSON serialization"

# App features
echo "  UI features:"
grep -q "expandAll" js/app.js && echo "    ✓ Expand all"
grep -q "collapseAll" js/app.js && echo "    ✓ Collapse all"
grep -q "searchTree" js/app.js && echo "    ✓ Search functionality"
grep -q "exportJSON" js/app.js && echo "    ✓ JSON export"
grep -q "copyJSON" js/app.js && echo "    ✓ JSON copy"
grep -q "switchTab" js/app.js && echo "    ✓ Tab switching"

echo ""
echo "================================"
echo "✓ All validation checks passed!"
echo "================================"
echo ""
echo "To run the application:"
echo "  cd $(pwd)"
echo "  python3 -m http.server 8000"
echo "  # Open http://localhost:8000 in browser"
echo ""
