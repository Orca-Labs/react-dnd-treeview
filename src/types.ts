import { XYCoord } from "react-dnd";

export type NodeModel<T = unknown> = {
  id: number | string;
  parent: number | string;
  nodeType: "node" | "leaf";
  name: string;
  data?: T;
};

export type DragItem<T = unknown> = NodeModel<T> & {
  id: number | string;
  type: symbol;
  ref: React.MutableRefObject<HTMLElement>;
};

export type NodeRender = (
  data: NodeModel,
  depth: number,
  isOpen: boolean
) => React.ReactElement;

export type ClickHandler = (data: NodeModel) => void;

export type DropHandler = (
  id: NodeModel["id"],
  parent: NodeModel["id"]
) => void;

export type ToggleHandler = (id: NodeModel["id"]) => void;

export type Classes = {
  root?: string;
  container?: string;
  dragOver?: string;
};

export type TreeContext = {
  tree: NodeModel[];
  openIds: NodeModel["id"][];
  classes?: Classes;
  render: NodeRender;
  dragPreviewRender: DragPreviewRender;
  onClick: ClickHandler;
  onDrop: DropHandler;
};

export type DragLayerMonitorProps<T = unknown> = {
  item: DragItem<T>;
  clientOffset: XYCoord | null;
  isDragging: boolean;
};

export type DragPreviewRender = (
  monitorProps: DragLayerMonitorProps
) => React.ReactElement;

export type DragOverProps = {
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
};
