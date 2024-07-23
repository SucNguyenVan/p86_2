import { _decorator, Component, Node } from "cc";
import eventTarget from "../Manager/EventManager";
const { ccclass, property } = _decorator;

@ccclass("OptionSelect")
export class OptionSelect extends Component {
  @property(Node)
  tomatoSelect: Node = null;
  @property(Node)
  cornSelect: Node = null;

  select(type: string) {
    eventTarget.emit("setTypeTree", type)
    eventTarget.emit("onStartBuildCage")
    this.node.active = false
  }
  setUp() {
    this.tomatoSelect.on(
      Node.EventType.TOUCH_START,
      () => {
        this.select("tomato");
      },
      this
    );
    this.cornSelect.on(
      Node.EventType.TOUCH_START,
      () => {
        this.select("corn");
      },
      this
    );
  }
  start() {
    this.setUp();
  }

  protected onDestroy(): void {
      this.tomatoSelect.off(Node.EventType.TOUCH_START)
      this.cornSelect.off(Node.EventType.TOUCH_START)
  }
}
