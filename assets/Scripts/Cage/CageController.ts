import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;
import eventTarget from "../Manager/EventManager";

@ccclass("CageController")
export class CageController extends Component {
  @property(Node)
  pointer: Node = null;
  @property(Node)
  optionSelect: Node = null;
  @property(Node)
  cageBase: Node = null;
  @property(Node)
  pig: Node = null;
  @property(Node)
  chicken: Node = null;
  @property(Node)
  meatResource: Node = null;
  @property(Node)
  eggResource: Node = null;

  startBuildCage() {
    this.pointer.active = true;
    this.cageBase.on(Node.EventType.TOUCH_START, () => {
      this.optionSelect.active = true;
      this.pointer.active = false;
    });
  }

  setTypeLivestock(type) {
    if (type === "pig") {
      this.pig.active = true;
    } else if (type === "chicken") {
      this.chicken.active = true;
    }
    this.scheduleOnce(() => {
      eventTarget.emit("onUpgradeGarden");
      eventTarget.emit("onGetCageResource", type);
      // this.pig.active = false;
      // this.chicken.active = false;
      // if (type === "pig") {
      //   this.meatResource.active = true;
      // } else if (type === "chicken") {
      //   this.eggResource.active = true;
      // }
    }, 1);
  }

  setUp() {
    this.pointer.active = false;
    this.optionSelect.active = false;
    this.pig.active = false;
    this.chicken.active = false;
    this.meatResource.active = false;
    this.eggResource.active = false;
    eventTarget.on("onStartBuildCage", this.startBuildCage, this);
    eventTarget.on("setTypeLivestock", this.setTypeLivestock, this);
    eventTarget.on("doneHarvesting", () => {
      this.meatResource.active = false;
      this.eggResource.active = false;
    });
    eventTarget.on("onClickBasket", () => {
      this.pig.active = false
      this.chicken.active = false
      this.meatResource.active = false;
      this.eggResource.active = false;
    });
  }
  onLoad() {
    this.setUp();
  }

  protected onDestroy(): void {
    eventTarget.off("onStartBuildCage", this.startBuildCage, this);
    this.cageBase.off(Node.EventType.TOUCH_START);
  }
}
