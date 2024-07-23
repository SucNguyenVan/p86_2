import { _decorator, Component, Node, Vec3, Touch, EventTarget, UITransform } from "cc";
const { ccclass, property } = _decorator;
import eventTarget from "./Manager/EventManager";

@ccclass("TreeScript")
export class TreeScript extends Component {
  onTreeClicked() {
    const treePositionInWorld = this.node.worldPosition.clone();
    eventTarget.emit("treeClicked", treePositionInWorld);
  }
  onLoad() {
    eventTarget.on("actionChopWood", () => {
      this.onTreeClicked();
    });
  }
}
