class AVLNode {
  constructor(data) {
    this.data = data;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
    this.lastRotation = null;
    this.lastInserted = null;
  }

  // ✅ Step 1: Insert node like plain BST
  insertBST(data) {
    this.lastInserted = data;
    this.root = this._insertBST(this.root, data);
  }

  _insertBST(node, data) {
    if (!node) return new AVLNode(data);
    if (data < node.data) node.left = this._insertBST(node.left, data);
    else if (data > node.data) node.right = this._insertBST(node.right, data);
    return node;
  }

  // ✅ Step 2: Balance tree & record rotation details
  balance() {
    this.lastRotation = null;
    this.root = this._balanceNode(this.root);
    return this.lastRotation;
  }

  _balanceNode(node) {
    if (!node) return null;
    node.left = this._balanceNode(node.left);
    node.right = this._balanceNode(node.right);
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));

    const balance = this._getBalance(node);

    if (balance > 1 && this._getBalance(node.left) >= 0) {
      this.lastRotation = { type: "Right", pivot: node.data };
      return this._rightRotate(node);
    }
    if (balance < -1 && this._getBalance(node.right) <= 0) {
      this.lastRotation = { type: "Left", pivot: node.data };
      return this._leftRotate(node);
    }
    if (balance > 1 && this._getBalance(node.left) < 0) {
      this.lastRotation = { type: "LeftRight", pivot: node.data };
      node.left = this._leftRotate(node.left);
      return this._rightRotate(node);
    }
    if (balance < -1 && this._getBalance(node.right) > 0) {
      this.lastRotation = { type: "RightLeft", pivot: node.data };
      node.right = this._rightRotate(node.right);
      return this._leftRotate(node);
    }

    return node;
  }

  _height(node) { return node ? node.height : 0; }
  _getBalance(node) { return node ? this._height(node.left) - this._height(node.right) : 0; }

  _rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = 1 + Math.max(this._height(y.left), this._height(y.right));
    x.height = 1 + Math.max(this._height(x.left), this._height(x.right));
    return x;
  }

  _leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = 1 + Math.max(this._height(x.left), this._height(x.right));
    y.height = 1 + Math.max(this._height(y.left), this._height(y.right));
    return y;
  }
}
