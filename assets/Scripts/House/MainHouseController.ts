import { _decorator, Component, Node, EventTarget, Script } from "cc";
const { ccclass, property } = _decorator;
import eventTarget from "../Manager/EventManager";

@ccclass("MainHouseController")
export class MainHouseController extends Component {
  @property
  levelHouse = 1;

  @property({ type: Node })
  houseLevel1: Node = null;

  @property({ type: Node })
  houseLevel2: Node = null;

  clickHouse() {
    this.node.parent.emit("clickHouse");
  }

  upgradeHouse() {
    this.levelHouse = this.levelHouse + 1;
    this.displayHouse()
    eventTarget.emit("doneUpgradeHouse")
  }

  displayHouse() {
    this.houseLevel1.active = false;
    this.houseLevel2.active = false;
    if (this.levelHouse === 1) {
      this.houseLevel1.active = true;
    } else if (this.levelHouse === 2) {
      this.houseLevel2.active = true;
    }
  }
  start() {
    this.levelHouse = 1
    this.displayHouse();
    this.node.on(Node.EventType.TOUCH_START, this.clickHouse, this);
    eventTarget.on("onUpgradeMainHouse", this.upgradeHouse, this)
  }

  protected onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_START, this.clickHouse, this);
    eventTarget.off("onUpgradeMainHouse", this.upgradeHouse, this)
  }
}
