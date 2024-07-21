import { _decorator, Component, Node, Vec3, Touch, EventTarget } from "cc";
const { ccclass, property } = _decorator;
import eventTarget from "./Manager/EventManager";

@ccclass("TreeScript")
export class TreeScript extends Component {
  onTreeClicked() {
    const treePositionInWorld = this.node.getWorldPosition();
    console.log({ treePositionInWorld });
    eventTarget.emit("treeClicked", treePositionInWorld);
  }

  onLoad() {
    // this.node.on(Node.EventType.TOUCH_END, this.onTreeClicked, this);
    eventTarget.on("actionChopWood", () => {
      console.log("action chop wood");
      this.onTreeClicked();
    });
  }

  onDestroy() {
    this.node.off(Node.EventType.TOUCH_END, this.onTreeClicked, this);
  }
}
