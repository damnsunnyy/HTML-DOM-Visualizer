/**
 * Tree Utilities
 * 
 * Helper functions for working with the DOM tree structure
 */

class TreeUtils {
  /**
   * Count total nodes in tree
   * @param {Object} node - Node to start counting from
   * @returns {number} Total number of nodes
   */
  static countNodes(node) {
    let count = 1;
    if (node.children) {
      for (const child of node.children) {
        count += this.countNodes(child);
      }
    }
    return count;
  }

  /**
   * Get depth of tree
   * @param {Object} node - Root node
   * @returns {number} Maximum depth
   */
  static getDepth(node) {
    if (!node.children || node.children.length === 0) {
      return 0;
    }
    let maxDepth = 0;
    for (const child of node.children) {
      maxDepth = Math.max(maxDepth, this.getDepth(child));
    }
    return maxDepth + 1;
  }

  /**
   * Get statistics about the tree
   * @param {Object} root - Root node
   * @returns {Object} Statistics object
   */
  static getStatistics(root) {
    let elementCount = 0;
    let textCount = 0;
    let commentCount = 0;
    let attributeCount = 0;

    function traverse(node) {
      if (node.type === 'element') {
        elementCount++;
        attributeCount += Object.keys(node.attributes).length;
      } else if (node.type === 'text') {
        textCount++;
      } else if (node.type === 'comment') {
        commentCount++;
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }

    traverse(root);

    return {
      totalNodes: this.countNodes(root),
      elementCount,
      textCount,
      commentCount,
      attributeCount,
      depth: this.getDepth(root)
    };
  }

  /**
   * Find nodes by tag name
   * @param {Object} node - Node to search from
   * @param {string} tagName - Tag name to search for
   * @returns {Array} Array of matching nodes
   */
  static findByTagName(node, tagName) {
    const results = [];
    
    function traverse(n) {
      if (n.type === 'element' && n.tagName === tagName.toLowerCase()) {
        results.push(n);
      }
      if (n.children) {
        for (const child of n.children) {
          traverse(child);
        }
      }
    }

    traverse(node);
    return results;
  }

  /**
   * Find nodes by attribute
   * @param {Object} node - Node to search from
   * @param {string} attrName - Attribute name to search for
   * @param {string} attrValue - Optional attribute value to match
   * @returns {Array} Array of matching nodes
   */
  static findByAttribute(node, attrName, attrValue = null) {
    const results = [];
    
    function traverse(n) {
      if (n.type === 'element' && attrName in n.attributes) {
        if (attrValue === null || n.attributes[attrName] === attrValue) {
          results.push(n);
        }
      }
      if (n.children) {
        for (const child of n.children) {
          traverse(child);
        }
      }
    }

    traverse(node);
    return results;
  }

  /**
   * Convert tree to JSON string
   * @param {Object} node - Node to convert
   * @returns {string} JSON representation
   */
  static toJSON(node) {
    const nodeData = {
      type: node.type,
      tagName: node.tagName,
      attributes: node.attributes,
      content: node.content
    };

    if (node.children && node.children.length > 0) {
      nodeData.children = node.children.map(child => JSON.parse(this.toJSON(child)));
    }

    return JSON.stringify(nodeData);
  }

  /**
   * Get node summary text for display
   * @param {Object} node - Node to summarize
   * @returns {string} Summary text
   */
  static getNodeSummary(node) {
    if (node.type === 'document') {
      return 'document';
    } else if (node.type === 'element') {
      let summary = `<${node.tagName}`;
      const attrKeys = Object.keys(node.attributes);
      if (attrKeys.length > 0) {
        summary += ` [${attrKeys.length} attr]`;
      }
      return summary + '>';
    } else if (node.type === 'text') {
      const text = node.content.trim();
      if (text.length === 0) return '#text (whitespace)';
      return `#text "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
    } else if (node.type === 'comment') {
      return `<!-- ${node.content.trim().substring(0, 30)}... -->`;
    }
    return 'unknown';
  }

  /**
   * Get detailed node information
   * @param {Object} node - Node to inspect
   * @returns {Object} Detailed information
   */
  static getNodeDetails(node) {
    const details = {
      type: node.type,
      tagName: node.tagName || 'N/A',
      attributes: { ...node.attributes },
      children: node.children ? node.children.length : 0,
      content: node.type === 'text' || node.type === 'comment' ? node.content : 'N/A'
    };

    if (node.parent) {
      details.parentTag = node.parent.tagName || node.parent.type;
    }

    return details;
  }
}
