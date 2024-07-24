import { _decorator, Component, Node } from "cc";
import eventTarget from "../Manager/EventManager";
const { ccclass, property } = _decorator;

@ccclass("CageOptionSelect")
export class OptionSelect extends Component {
  @property(Node)
  pigSelect: Node = null;
  @property(Node)
  chickenSelect: Node = null;

  select(type: string) {
    this.node.active = false;
    eventTarget.emit("setTypeLivestock", type);
    this.scheduleOnce(() => {
      eventTarget.emit("turnOnBasket");
    }, 1);
  }
  setUp() {
    this.pigSelect.on(
      Node.EventType.TOUCH_START,
      () => {
        this.select("pig");
      },
      this
    );
    this.chickenSelect.on(
      Node.EventType.TOUCH_START,
      () => {
        this.select("chicken");
      },
      this
    );
  }
  start() {
    this.setUp();
  }

  protected onDestroy(): void {
    this.pigSelect.off(Node.EventType.TOUCH_START);
    this.chickenSelect.off(Node.EventType.TOUCH_START);
  }
}
