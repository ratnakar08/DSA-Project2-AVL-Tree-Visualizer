# 🌳 DSA Project 2 – Self-Balancing BST (AVL Tree Visualizer)

**Course:** Data Structures and Algorithms  
**Project:** Self-Balancing Binary Search Tree (AVL Tree)  
**Live Demo:** *(Optional – add your GitHub Pages link here)*  
**AVL Code Reference:** [View on Ideone](https://ideone.com/EMY6gV)

---

## 📘 Introduction

A **Binary Search Tree (BST)** allows efficient searching, insertion, and deletion when balanced.  
However, inserting nodes in sorted order can make the BST **skewed**, degrading its efficiency to *O(n)*.  

To prevent this, we use **self-balancing trees** such as the **AVL Tree**, which automatically performs **rotations** to maintain near-perfect balance.

---

## ⚙️ Time Complexity of BST Operations

| Operation | Best / Average Case | Worst Case (Unbalanced BST) |
|------------|--------------------|------------------------------|
| **Search** | O(log n) | O(n) |
| **Insertion** | O(log n) | O(n) |
| **Deletion** | O(log n) | O(n) |

A balanced tree keeps height ≈ log₂(n), ensuring logarithmic performance for all key operations.

---

## 🌿 Why Do We Need a Balanced BST?

In a skewed BST (all nodes on one side), operations degrade to linear time.  
A **balanced BST** keeps the tree height minimal and performance optimal.

Balanced BSTs ensure:
- Consistent O(log n) complexity.
- Faster data retrieval.
- Efficient use of memory and traversal operations.

---

## 🌳 Introduction to AVL Trees

The **AVL Tree** (Adelson-Velsky and Landis, 1962) is the first self-balancing binary search tree.  
It maintains the following **balance property**:

> **Balance Factor = height(left subtree) – height(right subtree)**

For every node,  
`Balance Factor ∈ { -1, 0, +1 }`

If any node’s balance factor goes outside this range, the tree **rotates** to restore balance.

---

## 🧭 Detecting Imbalance

After every insertion or deletion:
1. Traverse upward from the modified node.
2. Update heights.
3. Check the **balance factor** of each ancestor.
4. If it becomes > +1 or < –1, an imbalance has occurred.
5. Determine the type of imbalance (LL, RR, LR, or RL).
6. Perform the appropriate rotation to rebalance the tree.

---

## 🔄 Types of Rotations and Their Fixes

| Case | Type of Imbalance | Fix (Rotation) | Diagram |
|------|-------------------|----------------|----------|
| **LL (Left-Left)** | New node inserted in left subtree of left child | Right Rotation | ![LL Rotation](assets/LL_rotation.png) |
| **RR (Right-Right)** | New node inserted in right subtree of right child | Left Rotation | ![RR Rotation](assets/RR_rotation.png) |
| **LR (Left-Right)** | New node inserted in right subtree of left child | Left Rotation + Right Rotation | ![LR Rotation](assets/LR_rotation.png) |
| **RL (Right-Left)** | New node inserted in left subtree of right child | Right Rotation + Left Rotation | ![RL Rotation](assets/RL_rotation.png) |

---

## 🧮 AVL Tree Insertion Pseudocode

```text
function insert(node, key):
    if node == null:
        return new Node(key)

    if key < node.key:
        node.left = insert(node.left, key)
    else if key > node.key:
        node.right = insert(node.right, key)
    else:
        return node   # duplicates ignored

    # Update height
    node.height = 1 + max(height(node.left), height(node.right))

    balance = height(node.left) - height(node.right)

    # Perform rotations if imbalance occurs
    if balance > 1 and key < node.left.key:
        return rightRotate(node)      # LL Case
    if balance < -1 and key > node.right.key:
        return leftRotate(node)       # RR Case
    if balance > 1 and key > node.left.key:
        node.left = leftRotate(node.left)
        return rightRotate(node)      # LR Case
    if balance < -1 and key < node.right.key:
        node.right = rightRotate(node.right)
        return leftRotate(node)       # RL Case

    return node
