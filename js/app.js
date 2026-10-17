/**
 * DOM Tree Visualizer Application
 * 
 * Main application logic for HTML parsing and tree visualization
 */

class DOMVisualizer {
  constructor() {
    this.currentTree = null;
    this.expandedNodes = new Set();
    this.selectedNode = null;
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.setupElements();
    this.setupEventListeners();
  }

  /**
   * Setup DOM element references
   */
  setupElements() {
    this.htmlInput = document.getElementById('htmlInput');
    this.parseBtn = document.getElementById('parseBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.sampleBtn = document.getElementById('sampleBtn');
    this.treeContainer = document.getElementById('treeContainer');
    this.treeDisplay = document.getElementById('treeDisplay');
    this.nodeInfo = document.getElementById('nodeInfo');
    this.stats = document.getElementById('stats');
    this.expandAllBtn = document.getElementById('expandAllBtn');
    this.collapseAllBtn = document.getElementById('collapseAllBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.copyBtn = document.getElementById('copyBtn');
    this.searchInput = document.getElementById('searchInput');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.parseBtn.addEventListener('click', () => this.parseHTML());
    this.clearBtn.addEventListener('click', () => this.clearInput());
    this.sampleBtn.addEventListener('click', () => this.loadSample());
    this.expandAllBtn.addEventListener('click', () => this.expandAll());
    this.collapseAllBtn.addEventListener('click', () => this.collapseAll());
    this.exportBtn.addEventListener('click', () => this.exportJSON());
    this.copyBtn.addEventListener('click', () => this.copyJSON());
    this.searchInput.addEventListener('input', () => this.searchTree());

    // Setup tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });
  }

  /**
   * Switch tab
   * @param {string} tabName - Tab name
   */
  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
  }

  /**
   * Load sample HTML
   */
  loadSample() {
    this.htmlInput.value = `<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <div id="app" class="container">
      <h1>Hello World</h1>
      <p>This is a <strong>sample</strong> HTML page.</p>
      <img src="image.jpg" alt="Sample Image">
      <button class="btn btn-primary">Click Me</button>
    </div>
  </body>
</html>`;
    this.parseHTML();
  }

  /**
   * Clear input
   */
  clearInput() {
    this.htmlInput.value = '';
    this.treeDisplay.innerHTML = '<p class="empty-state">Parse HTML to see the DOM tree</p>';
    this.nodeInfo.innerHTML = '<p class="empty-state">Select a node to view details</p>';
    this.stats.innerHTML = '';
    this.currentTree = null;
    this.expandedNodes.clear();
    this.selectedNode = null;
  }

  /**
   * Parse HTML and generate tree
   */
  parseHTML() {
    const html = this.htmlInput.value.trim();

    if (!html) {
      this.treeDisplay.innerHTML = '<p class="empty-state">Please enter HTML code</p>';
      this.nodeInfo.innerHTML = '<p class="empty-state">Select a node to view details</p>';
      this.stats.innerHTML = '';
      this.currentTree = null;
      return;
    }

    try {
      // Parse HTML
      this.currentTree = parseHTML(html);
      
      // Clear selection
      this.selectedNode = null;
      this.expandedNodes.clear();
      
      // Render tree
      this.renderTree();
      
      // Show statistics
      this.updateStats();
      
      // Clear node info
      this.nodeInfo.innerHTML = '<p class="empty-state">Select a node to view details</p>';
    } catch (error) {
      this.treeDisplay.innerHTML = `<p class="error">Error parsing HTML: ${error.message}</p>`;
      this.nodeInfo.innerHTML = '<p class="empty-state">Error occurred during parsing</p>';
    }
  }

  /**
   * Render the tree in the DOM
   */
  renderTree() {
    if (!this.currentTree) {
      this.treeDisplay.innerHTML = '<p class="empty-state">No tree to display</p>';
      return;
    }

    const treeHTML = this.createNodeElement(this.currentTree, true);
    this.treeDisplay.innerHTML = '';
    this.treeDisplay.appendChild(treeHTML);
  }

  /**
   * Create DOM element for a tree node
   * @param {Object} node - Tree node
   * @param {boolean} isRoot - Whether this is the root node
   * @returns {HTMLElement} Node element
   */
  createNodeElement(node, isRoot = false) {
    const nodeId = `node-${Math.random().toString(36).substr(2, 9)}`;
    const isExpanded = this.expandedNodes.has(node);
    const hasChildren = node.children && node.children.length > 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'tree-node-wrapper';

    const nodeDiv = document.createElement('div');
    nodeDiv.className = `tree-node ${this.selectedNode === node ? 'selected' : ''}`;
    nodeDiv.dataset.nodeId = nodeId;

    // Expandable icon
    if (hasChildren) {
      const toggle = document.createElement('span');
      toggle.className = `tree-toggle ${isExpanded ? 'expanded' : ''}`;
      toggle.innerHTML = '▶';
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNode(node);
      });
      nodeDiv.appendChild(toggle);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'tree-spacer';
      nodeDiv.appendChild(spacer);
    }

    // Node content
    const content = document.createElement('span');
    content.className = `tree-content node-type-${node.type}`;
    content.textContent = TreeUtils.getNodeSummary(node);
    nodeDiv.appendChild(content);

    // Add click listener
    nodeDiv.addEventListener('click', () => this.selectNode(node));

    wrapper.appendChild(nodeDiv);

    // Children
    if (hasChildren && isExpanded) {
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'tree-children';

      for (const child of node.children) {
        childrenDiv.appendChild(this.createNodeElement(child, false));
      }

      wrapper.appendChild(childrenDiv);
    }

    return wrapper;
  }

  /**
   * Toggle node expansion
   * @param {Object} node - Node to toggle
   */
  toggleNode(node) {
    if (this.expandedNodes.has(node)) {
      this.expandedNodes.delete(node);
    } else {
      this.expandedNodes.add(node);
    }
    this.renderTree();
  }

  /**
   * Select a node and show details
   * @param {Object} node - Node to select
   */
  selectNode(node) {
    this.selectedNode = node;
    this.renderTree();
    this.showNodeDetails(node);
  }

  /**
   * Show node details in the info panel
   * @param {Object} node - Node to display
   */
  showNodeDetails(node) {
    const details = TreeUtils.getNodeDetails(node);

    let html = `<div class="node-details">
      <div class="detail-section">
        <h3>Node Information</h3>
        <div class="detail-item">
          <span class="detail-label">Type:</span>
          <span class="detail-value">${details.type}</span>
        </div>`;

    if (details.tagName !== 'N/A') {
      html += `<div class="detail-item">
        <span class="detail-label">Tag:</span>
        <span class="detail-value">&lt;${details.tagName}&gt;</span>
      </div>`;
    }

    html += `<div class="detail-item">
      <span class="detail-label">Children:</span>
      <span class="detail-value">${details.children}</span>
    </div>`;

    if (details.parentTag) {
      html += `<div class="detail-item">
        <span class="detail-label">Parent:</span>
        <span class="detail-value">&lt;${details.parentTag}&gt;</span>
      </div>`;
    }

    html += '</div>';

    if (Object.keys(details.attributes).length > 0) {
      html += '<div class="detail-section"><h3>Attributes</h3>';
      for (const [key, value] of Object.entries(details.attributes)) {
        html += `<div class="detail-item attribute">
          <span class="detail-label">${key}:</span>
          <span class="detail-value">"${value}"</span>
        </div>`;
      }
      html += '</div>';
    }

    if (details.content !== 'N/A') {
      html += `<div class="detail-section">
        <h3>Content</h3>
        <div class="detail-content">
          <pre>${escapeHTML(details.content)}</pre>
        </div>
      </div>`;
    }

    html += '</div>';

    this.nodeInfo.innerHTML = html;
  }

  /**
   * Update statistics display
   */
  updateStats() {
    if (!this.currentTree) {
      this.stats.innerHTML = '';
      return;
    }

    const stats = TreeUtils.getStatistics(this.currentTree);

    let html = `<div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">Total Nodes</div>
        <div class="stat-value">${stats.totalNodes}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Elements</div>
        <div class="stat-value">${stats.elementCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Text Nodes</div>
        <div class="stat-value">${stats.textCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Comments</div>
        <div class="stat-value">${stats.commentCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Attributes</div>
        <div class="stat-value">${stats.attributeCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Max Depth</div>
        <div class="stat-value">${stats.depth}</div>
      </div>
    </div>`;

    this.stats.innerHTML = html;
  }

  /**
   * Expand all nodes
   */
  expandAll() {
    this.forEachNode(this.currentTree, (node) => {
      if (node.children && node.children.length > 0) {
        this.expandedNodes.add(node);
      }
    });
    this.renderTree();
  }

  /**
   * Collapse all nodes
   */
  collapseAll() {
    this.expandedNodes.clear();
    this.renderTree();
  }

  /**
   * Export tree as JSON file
   */
  exportJSON() {
    if (!this.currentTree) {
      alert('No tree to export');
      return;
    }

    const json = TreeUtils.toJSON(this.currentTree);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dom-tree.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Copy tree JSON to clipboard
   */
  copyJSON() {
    if (!this.currentTree) {
      alert('No tree to copy');
      return;
    }

    const json = TreeUtils.toJSON(this.currentTree);
    navigator.clipboard.writeText(json).then(() => {
      const btn = this.copyBtn;
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  }

  /**
   * Search nodes in tree
   */
  searchTree() {
    const query = this.searchInput.value.toLowerCase().trim();

    if (!query) {
      this.renderTree();
      return;
    }

    // Expand all nodes that match or contain matching nodes
    this.expandedNodes.clear();
    this.forEachNode(this.currentTree, (node) => {
      if (this.nodeMatches(node, query) || this.hasMatchingDescendant(node, query)) {
        if (node.children && node.children.length > 0) {
          this.expandedNodes.add(node);
        }
      }
    });

    // Highlight matching nodes during render
    this.currentSearchQuery = query;
    this.renderTree();
    this.currentSearchQuery = null;
  }

  /**
   * Check if node matches search query
   * @param {Object} node - Node to check
   * @param {string} query - Search query
   * @returns {boolean} True if matches
   */
  nodeMatches(node, query) {
    if (node.type === 'element') {
      if (node.tagName.includes(query)) return true;
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key.includes(query) || value.includes(query)) return true;
      }
    } else if (node.type === 'text') {
      if (node.content.toLowerCase().includes(query)) return true;
    } else if (node.type === 'comment') {
      if (node.content.toLowerCase().includes(query)) return true;
    }
    return false;
  }

  /**
   * Check if node has matching descendant
   * @param {Object} node - Node to check
   * @param {string} query - Search query
   * @returns {boolean} True if has matching descendant
   */
  hasMatchingDescendant(node, query) {
    if (!node.children) return false;
    for (const child of node.children) {
      if (this.nodeMatches(child, query) || this.hasMatchingDescendant(child, query)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Execute function for each node in tree
   * @param {Object} node - Starting node
   * @param {Function} fn - Function to execute
   */
  forEachNode(node, fn) {
    if (!node) return;
    fn(node);
    if (node.children) {
      for (const child of node.children) {
        this.forEachNode(child, fn);
      }
    }
  }
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DOMVisualizer();
});
