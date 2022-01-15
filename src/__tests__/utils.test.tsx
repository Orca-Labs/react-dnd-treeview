import React from "react";
import { NodeModel, NodeRender, TreeState } from "../types";
import {
  mutateTreeWithIndex,
  compareItems,
  getTreeItem,
  isDroppable,
  isAncestor,
  getModifiedIndex,
  getDescendants,
} from "../utils";

const treeData: NodeModel[] = [
  {
    id: 1,
    parent: 0,
    droppable: true,
    text: "Folder 1",
  },
  {
    id: 2,
    parent: 1,
    droppable: false,
    text: "File 1-1",
    data: {
      fileType: "csv",
      fileSize: "0.5MB",
    },
  },
  {
    id: 3,
    parent: 1,
    droppable: false,
    text: "File 1-2",
    data: {
      fileType: "text",
      fileSize: "4.8MB",
    },
  },
  {
    id: 4,
    parent: 0,
    droppable: true,
    text: "Folder 2",
  },
  {
    id: 5,
    parent: 4,
    droppable: true,
    text: "Folder 2-1",
  },
  {
    id: 6,
    parent: 5,
    droppable: false,
    text: "File 2-1-1",
    data: {
      fileType: "image",
      fileSize: "2.1MB",
    },
  },
  {
    id: 7,
    parent: 0,
    droppable: false,
    text: "File 3",
    data: {
      fileType: "image",
      fileSize: "0.8MB",
    },
  },
];

describe("utilities test", () => {
  test("mutate tree items", () => {
    const treeBefore: NodeModel[] = [
      {
        id: 1,
        parent: 0,
        droppable: true,
        text: "a",
      },
      {
        id: 2,
        parent: 0,
        droppable: true,
        text: "b",
      },
    ];

    const treeAfter: NodeModel[] = mutateTreeWithIndex(treeBefore, 2, 1, 0);

    treeBefore[1].text = "c";

    expect(treeAfter).toEqual([
      {
        id: 2,
        parent: 1,
        droppable: true,
        text: "b",
      },
      {
        id: 1,
        parent: 0,
        droppable: true,
        text: "a",
      },
    ]);
  });

  test("compare tree item order", () => {
    const nodeA: NodeModel = {
      id: 1,
      parent: 0,
      droppable: true,
      text: "a",
    };

    const nodeB: NodeModel = {
      id: 2,
      parent: 0,
      droppable: true,
      text: "b",
    };

    expect(compareItems(nodeA, nodeB)).toBe(-1);
    expect(compareItems(nodeB, nodeA)).toBe(1);
    expect(compareItems(nodeA, nodeA)).toBe(0);
  });

  test("get tree item by id", () => {
    const tree: NodeModel[] = [
      {
        id: 1,
        parent: 0,
        droppable: true,
        text: "a",
      },
    ];

    expect(getTreeItem(tree, 1)?.text).toBe("a");
    expect(getTreeItem(tree, 2)).toBe(undefined);
  });

  test("check the parent-child structure", () => {
    expect(isAncestor(treeData, 1, 2)).toBe(true);
    expect(isAncestor(treeData, 2, 1)).toBe(false);
    expect(isAncestor(treeData, 4, 6)).toBe(true);
    expect(isAncestor(treeData, 0, 6)).toBe(true);
  });

  test("check for drop availability", () => {
    const render: NodeRender<unknown> = (node) => {
      return <div>{node.text}</div>;
    };

    const treeContext: TreeState<unknown> = {
      tree: treeData,
      rootId: 0,
      render,
      listComponent: "ul",
      listItemComponent: "li",
      placeholderComponent: "li",
      sort: false,
      insertDroppableFirst: true,
      dropTargetOffset: 0,
      initialOpen: false,
      openIds: [],
      onDrop: () => undefined,
      onToggle: () => undefined,
    };

    expect(isDroppable(7, 7, treeContext)).toBe(false);
    expect(isDroppable(7, 1, treeContext)).toBe(true);
    expect(isDroppable(1, 1, treeContext)).toBe(false);
    expect(isDroppable(4, 5, treeContext)).toBe(false);
  });

  test("check modified indexes", () => {
    let [srcIndex, destIndex] = getModifiedIndex(treeData, 7, 0, 0);

    expect(srcIndex).toBe(6);
    expect(destIndex).toBe(0);

    [srcIndex, destIndex] = getModifiedIndex(treeData, 7, 1, 0);

    expect(srcIndex).toBe(6);
    expect(destIndex).toBe(0);

    [srcIndex, destIndex] = getModifiedIndex(treeData, 7, 0, 3);

    expect(srcIndex).toBe(6);
    expect(destIndex).toBe(6);

    [srcIndex, destIndex] = getModifiedIndex(treeData, 7, 0, 0);

    expect(srcIndex).toBe(6);
    expect(destIndex).toBe(0);

    [srcIndex, destIndex] = getModifiedIndex(treeData, 7, 0, 1);

    expect(srcIndex).toBe(6);
    expect(destIndex).toBe(3);

    [srcIndex, destIndex] = getModifiedIndex(treeData, 7, 5, 1);

    expect(srcIndex).toBe(6);
    expect(destIndex).toBe(6);

    [srcIndex, destIndex] = getModifiedIndex(treeData, 3, 5, 0);

    expect(srcIndex).toBe(2);
    expect(destIndex).toBe(0);
  });

  test("get descendant nodes by id", () => {
    let descendantIds = getDescendants(treeData, 1).map((n) => n.id);

    expect(descendantIds.includes(2)).toBe(true);
    expect(descendantIds.includes(3)).toBe(true);

    descendantIds = getDescendants(treeData, 4).map((n) => n.id);

    expect(descendantIds.includes(5)).toBe(true);
    expect(descendantIds.includes(6)).toBe(true);

    descendantIds = getDescendants(treeData, 7).map((n) => n.id);

    expect(descendantIds.length).toBe(0);
  });
});
