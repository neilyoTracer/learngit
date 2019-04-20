function createTreeData(data) {
  let i = 0,
    tree = [{ id: 0, parentId: null, children: [], type: 1 }],
    levelInfo = {};
  while (data.length) {
    if (data[i].parentId === 0) {
      tree[0].children.push({
        id: data[i].id,
        parentId: 0,
        children: [],
        type: 2
      });
      levelInfo[data[i].id] = [tree[0].children.length - 1];
      data.splice(i, 1);
      i--;
    } else {
      let lvlArr = levelInfo[data[i].parentId];
      if (lvlArr) {
        let obj = tree[0].children[lvlArr[0]];
        for (let j = 1; j < lvlArr.length; j++) {
          obj = obj.children[lvlArr[j]];
        }

        obj.children.push({
          id: data[i].id,
          parentId: data[i].parentId,
          children: [],
          type: lvlArr.length + 2
        });
        levelInfo[data[i].id] = lvlArr.concat([obj.children.length - 1]);
        data.splice(i, 1);
        i--;
      }
    }
    i++;
    if (i > data.length - 1) {
      i = 0;
    }
  }
  return tree;
}