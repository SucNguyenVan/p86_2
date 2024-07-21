import { _decorator, Component, Node, EventTarget, Script } from "cc";
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();

@ccclass("MainHouseController")
export class MainHouseController extends Component {
  level: number = 1;

  @property({ type: Node })
  houseLevel1: Node = null;

  @property({ type: Node })
  houseLevel2: Node = null;

  clickHouse() {
    this.node.parent.emit("clickHouse");
  }

  upgradeHouse() {
    this.level = this.level + 1;
  }

  displayHouse() {
    this.houseLevel1.active = false;
    this.houseLevel2.active = false;
    if (this.level === 1) {
      this.houseLevel1.active = true;
    } else if (this.level === 2) {
      this.houseLevel2.active = true;
    }
  }
  start() {
    this.displayHouse();
    this.node.on(Node.EventType.TOUCH_START, this.clickHouse, this);
  }

  protected onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_START, this.clickHouse, this);
  }
}
