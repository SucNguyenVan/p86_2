import { _decorator, Component, Node, EventTarget } from "cc";
const { ccclass, property } = _decorator;
import eventTarget from "../Manager/EventManager";

@ccclass("RequireController")
export class RequireController extends Component {
  start() {
    this.node.on(Node.EventType.TOUCH_START, () => {
      eventTarget.emit("moveToTree");
      this.node.active = false
    });
  }
}
