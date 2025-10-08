const tree = new AVLTree();
let animating = false;
const ANIM_DURATION = 900;
const VERTICAL_STEP = 100;
const NODE_RADIUS = 25;

document.getElementById("insertBtn").addEventListener("click", addNumber);
document.getElementById("numberInput").addEventListener("keydown", e => {
  if (e.key === "Enter") addNumber();
});

function addNumber() {
  if (animating) return;
  const input = document.getElementById("numberInput");
  const val = input.value.trim();
  if (!val) return;
  const num = Number(val);
  input.value = "";

  // Phase 1: BST insert only
  const oldPos = computeLayoutPositions(tree.root);
  tree.insertBST(num);
  const newPos = computeLayoutPositions(tree.root);

  animating = true;

  // Animate insertion
  animateLayoutTransition(oldPos, newPos, num, null, () => {
    // After insertion -> Phase 2: Balance (rotations)
    const rotation = tree.balance();
    if (rotation) {
      const afterBalance = computeLayoutPositions(tree.root);
      animateLayoutTransition(newPos, afterBalance, null, rotation, () => {
        animating = false;
      });
    } else {
      animating = false;
    }
  });
}

function computeLayoutPositions(root) {
  const area = document.getElementById("treeArea");
  const width = area.clientWidth;
  const positions = {};
  const startX = width / 2, startY = 20;

  function helper(node, x, y, gap) {
    if (!node) return;
    positions[node.data] = { x, y };
    if (node.left) helper(node.left, x - gap, y + VERTICAL_STEP, Math.max(50, gap / 1.7));
    if (node.right) helper(node.right, x + gap, y + VERTICAL_STEP, Math.max(50, gap / 1.7));
  }

  helper(root, startX, startY, Math.max(width / 4, 120));
  return positions;
}

function animateLayoutTransition(oldPos, newPos, insertedVal, rotation, onFinish) {
  const area = document.getElementById("treeArea");
  const display = document.getElementById("treeDisplay");
  const svg = document.getElementById("treeLines");

  display.innerHTML = "";
  svg.innerHTML = "";
  const width = area.clientWidth, height = area.clientHeight;
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const nodes = {};
  for (const key in newPos) {
    const v = Number(key);
    const el = document.createElement("div");
    el.className = "node";
    el.textContent = v;
    el.dataset.value = v;

    if (oldPos[v]) {
      el.style.left = oldPos[v].x - NODE_RADIUS + "px";
      el.style.top = oldPos[v].y + "px";
    } else {
      el.classList.add("new");
      el.style.left = width / 2 - NODE_RADIUS + "px";
      el.style.top = "0px";
    }
    display.appendChild(el);
    nodes[v] = el;
  }

  // Animate to new positions
  setTimeout(() => {
    for (const key in newPos) {
      const v = Number(key);
      const el = nodes[v];
      const np = newPos[v];
      el.style.left = np.x - NODE_RADIUS + "px";
      el.style.top = np.y + "px";
      if (el.classList.contains("new")) {
        setTimeout(() => el.classList.remove("new"), ANIM_DURATION);
      }
    }

    // Rotation highlight
    if (rotation) {
  const pivot = nodes[rotation.pivot];
  if (pivot) {
    const ROTATION_DURATION = 2000; // slower rotation animation (2s)
    pivot.classList.add("rotating");

    // Temporarily slow down transition for all nodes during rotation
    Object.values(nodes).forEach(el => {
      el.style.transitionDuration = ROTATION_DURATION + "ms";
    });

    setTimeout(() => {
      pivot.classList.remove("rotating");
      // Reset transitions back to normal speed
      Object.values(nodes).forEach(el => {
        el.style.transitionDuration = ANIM_DURATION + "ms";
      });
    }, ROTATION_DURATION);
  }
}


    setTimeout(() => {
      svg.innerHTML = "";
      drawEdgesFromPositions(newPos, svg);
      if (onFinish) onFinish();
    }, ANIM_DURATION + 50);
  }, 30);
}

function drawEdgesFromPositions(posMap, svg) {
  function helper(node) {
    if (!node) return;
    const p = posMap[node.data];
    if (node.left) {
      const c = posMap[node.left.data];
      drawCurve(svg, p.x, p.y + NODE_RADIUS, c.x, c.y - NODE_RADIUS);
      helper(node.left);
    }
    if (node.right) {
      const c = posMap[node.right.data];
      drawCurve(svg, p.x, p.y + NODE_RADIUS, c.x, c.y - NODE_RADIUS);
      helper(node.right);
    }
  }
  helper(tree.root);
}

function drawCurve(svg, x1, y1, x2, y2) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  path.setAttribute("d", d);
  path.setAttribute("class", "pathLine");
  svg.appendChild(path);
}
