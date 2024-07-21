import { _decorator, Component, Node, EventTarget } from "cc";
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();

@ccclass("HouseController")
export class HouseController extends Component {
  @property({ type: Node })
  pointer: Node = null;

  @property({ type: Node })
  mainHouse: Node = null;

  @property({ type: Node })
  requireInfo: Node = null;

  @property({ type: Node })
  treeWood: Node = null;

  @property
  requireWood: number = 20;

  onEvent() {
    this.node.on("clickHouse", () => {
      this.pointer.active = false;
      this.requireInfo.active = true;
    });
  }

  protected onLoad(): void {
    this.onEvent();
    if (this.requireInfo) {
      this.requireInfo.active = false;
    }
    if (this.treeWood) {
      this.treeWood.active = false;
    }
  }

  start() {}

  update(deltaTime: number) {}
}
