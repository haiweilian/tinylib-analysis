// 缓存的 key 集合
const keys = new Set();
// 最大缓存个数
const max = 5;

// 添加缓存
function add(key) {
  if (keys.has(key)) {
    // 如果缓存中存在： 把这个 key 从集合中删除再添加，保持 key 的活跃度。
    // 旧：[1, 2, 3]
    // add(1)
    // 新：[2, 3, 1]
    keys.delete(key);
    keys.add(key);
  } else {
    // 如果缓存中存在：则添加一个缓存
    keys.add(key);
    // 如果缓存个数大于最大的缓存数，则删除最久不用的 key。
    // 最久是 key 集合中的第一个，因为每次命中缓存都会从新添加到后面。
    if (keys.size > max) {
      keys.delete(keys.values().next().value);
    }
  }
  console.log([...keys]);
}

add(1); // [1]
add(2); // [1, 2]
add(3); // [1, 2, 3]
add(1); // [2, 3, 1]

add(4); // [2, 3, 1, 4]
add(5); // [3, 1, 4, 5, 6] 最大缓存 5，最久不使用 2 的删除了。
