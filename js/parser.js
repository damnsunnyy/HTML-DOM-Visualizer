/**
 * HTML Parser
 * 
 * Custom HTML parser that converts HTML strings into a tree structure.
 * Handles elements, text nodes, comments, attributes, and void elements.
 */

class HTMLParser {
  constructor(html) {
    this.html = html;
    this.position = 0;
    this.length = html.length;
  }

  /**
   * Parse the HTML string into a DOM tree structure
   * @returns {Object} Root node of the tree
   */
  parse() {
    const root = this.createNode('document', null);
    this.parseNodes(root);
    return root;
  }

  /**
   * Create a node object
   * @param {string} type - Node type: 'document', 'element', 'text', 'comment'
   * @param {string} tagName - Tag name for element nodes
   * @returns {Object} Node object
   */
  createNode(type, tagName = null) {
    return {
      type,
      tagName,
      attributes: {},
      children: [],
      content: '', // For text/comment nodes
      parent: null
    };
  }

  /**
   * Parse child nodes recursively
   * @param {Object} parentNode - Parent node to add children to
   */
  parseNodes(parentNode) {
    while (this.position < this.length) {
      // Skip whitespace between tags
      this.skipWhitespace();

      if (this.position >= this.length) break;

      // Check for different node types
      if (this.peek() === '<') {
        if (this.peekString('<!--')) {
          // Parse comment
          this.parseComment(parentNode);
        } else if (this.peekString('</')) {
          // Closing tag - stop parsing children
          break;
        } else if (this.peekString('<!DOCTYPE', true)) {
          // Skip DOCTYPE declaration
          this.skipUntil('>');
          this.position++; // Skip the '>'
        } else {
          // Parse element
          const element = this.parseElement();
          if (element) {
            element.parent = parentNode;
            parentNode.children.push(element);
          }
        }
      } else {
        // Parse text node
        const textNode = this.parseTextNode();
        if (textNode) {
          textNode.parent = parentNode;
          parentNode.children.push(textNode);
        }
      }
    }
  }

  /**
   * Parse an HTML element
   * @returns {Object|null} Element node or null if parsing fails
   */
  parseElement() {
    if (this.peek() !== '<') return null;

    this.position++; // Skip '<'

    // Get tag name
    const tagName = this.parseTagName();
    if (!tagName) return null;

    const node = this.createNode('element', tagName.toLowerCase());

    // Parse attributes
    this.parseAttributes(node);

    // Skip whitespace
    this.skipWhitespace();

    // Check for self-closing tag
    if (this.peekString('/>')) {
      this.position += 2;
      return node;
    }

    // Check if this is a void element
    if (this.isVoidElement(node.tagName)) {
      // Consume the closing '>'
      if (this.peek() === '>') {
        this.position++;
      }
      return node;
    }

    // Consume closing '>'
    if (this.peek() === '>') {
      this.position++;
    } else {
      return node; // Malformed, but continue
    }

    // Parse child nodes
    this.parseNodes(node);

    // Parse closing tag
    this.skipWhitespace();
    if (this.peekString('</')) {
      this.position += 2; // Skip '</'
      this.parseTagName(); // Skip closing tag name
      this.skipWhitespace();
      if (this.peek() === '>') {
        this.position++;
      }
    }

    return node;
  }

  /**
   * Parse tag name
   * @returns {string} Tag name
   */
  parseTagName() {
    const start = this.position;
    while (this.position < this.length) {
      const char = this.peek();
      if (char === '>' || char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '/') {
        break;
      }
      this.position++;
    }
    return this.html.substring(start, this.position).trim();
  }

  /**
   * Parse attributes of an element
   * @param {Object} node - Element node to add attributes to
   */
  parseAttributes(node) {
    while (this.position < this.length) {
      this.skipWhitespace();

      if (this.peek() === '>' || this.peekString('/>')) {
        break;
      }

      // Parse attribute name
      const attrName = this.parseAttributeName();
      if (!attrName) break;

      this.skipWhitespace();

      let attrValue = '';

      // Check for attribute value
      if (this.peek() === '=') {
        this.position++; // Skip '='
        this.skipWhitespace();

        // Parse attribute value
        const quote = this.peek();
        if (quote === '"' || quote === "'") {
          this.position++; // Skip opening quote
          attrValue = this.parseQuotedString(quote);
          this.position++; // Skip closing quote
        } else {
          // Unquoted attribute value
          attrValue = this.parseUnquotedAttributeValue();
        }
      }

      node.attributes[attrName.toLowerCase()] = attrValue;
    }
  }

  /**
   * Parse attribute name
   * @returns {string} Attribute name
   */
  parseAttributeName() {
    const start = this.position;
    while (this.position < this.length) {
      const char = this.peek();
      if (char === '=' || char === '>' || char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '/') {
        break;
      }
      this.position++;
    }
    return this.html.substring(start, this.position).trim();
  }

  /**
   * Parse quoted attribute value
   * @param {string} quote - Quote character (' or ")
   * @returns {string} Attribute value
   */
  parseQuotedString(quote) {
    const start = this.position;
    while (this.position < this.length && this.peek() !== quote) {
      this.position++;
    }
    return this.html.substring(start, this.position);
  }

  /**
   * Parse unquoted attribute value
   * @returns {string} Attribute value
   */
  parseUnquotedAttributeValue() {
    const start = this.position;
    while (this.position < this.length) {
      const char = this.peek();
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '>' || char === '/') {
        break;
      }
      this.position++;
    }
    return this.html.substring(start, this.position);
  }

  /**
   * Parse a text node
   * @returns {Object|null} Text node or null if empty
   */
  parseTextNode() {
    const start = this.position;
    while (this.position < this.length && this.peek() !== '<') {
      this.position++;
    }

    const content = this.html.substring(start, this.position);
    
    // Only create text node if content is not purely whitespace
    if (content.trim()) {
      const node = this.createNode('text', null);
      node.content = content;
      return node;
    }

    return null;
  }

  /**
   * Parse a comment node
   * @param {Object} parentNode - Parent node to add comment to
   */
  parseComment(parentNode) {
    if (!this.peekString('<!--')) return;

    this.position += 4; // Skip '<!--'

    const start = this.position;
    while (this.position < this.length) {
      if (this.peekString('-->')) {
        break;
      }
      this.position++;
    }

    const content = this.html.substring(start, this.position);
    const node = this.createNode('comment', null);
    node.content = content;
    node.parent = parentNode;
    parentNode.children.push(node);

    this.position += 3; // Skip '-->'
  }

  /**
   * Check if a tag is a void element (self-closing)
   * @param {string} tagName - Tag name
   * @returns {boolean} True if void element
   */
  isVoidElement(tagName) {
    const voidElements = [
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ];
    return voidElements.includes(tagName.toLowerCase());
  }

  /**
   * Get character at current position
   * @returns {string} Character
   */
  peek() {
    return this.html.charAt(this.position);
  }

  /**
   * Check if upcoming string matches
   * @param {string} str - String to check
   * @param {boolean} caseSensitive - Whether to check case-sensitively
   * @returns {boolean} True if string matches
   */
  peekString(str, caseSensitive = false) {
    const substr = this.html.substring(this.position, this.position + str.length);
    return caseSensitive ? substr === str : substr.toLowerCase() === str.toLowerCase();
  }

  /**
   * Skip whitespace characters
   */
  skipWhitespace() {
    while (this.position < this.length) {
      const char = this.peek();
      if (char !== ' ' && char !== '\t' && char !== '\n' && char !== '\r') {
        break;
      }
      this.position++;
    }
  }

  /**
   * Skip until a character is found
   * @param {string} char - Character to skip until
   */
  skipUntil(char) {
    while (this.position < this.length && this.peek() !== char) {
      this.position++;
    }
  }
}

/**
 * Parse HTML string into a tree structure
 * @param {string} html - HTML string to parse
 * @returns {Object} Root node of the tree
 */
function parseHTML(html) {
  const parser = new HTMLParser(html);
  return parser.parse();
}
