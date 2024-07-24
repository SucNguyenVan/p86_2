import { _decorator, Component, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;
import eventTarget from "../Manager/EventManager";

@ccclass("GardenController")
export class GardenController extends Component {
  @property(Node)
  gardenBase: Node = null;
  @property(Node)
  gardenTomato: Node = null;
  @property(Node)
  gardenCorn: Node = null;
  @property(Node)
  pointer: Node = null;
  @property(Node)
  optionSelect: Node = null;

  typeTree: string = "" //tomato or corn

  setUp() {
    this.gardenBase.active = true;
    this.gardenTomato.active = false;
    this.gardenCorn.active = false;
    this.pointer.active = false;
    this.optionSelect.active = false
    this.pointer.getComponent(UITransform).priority = 2
  }

  startBuildGarden() {
    this.pointer.active = true;
    this.gardenBase.on(Node.EventType.TOUCH_START,()=>{
        this.pointer.active = false
        this.optionSelect.active = true
    })
  }

  upgradeGarden(){
    if(!this.typeTree) return
    if(this.typeTree === "tomato"){
        this.gardenBase.active =false
        this.gardenTomato.active = true
    }else if(this.typeTree === "corn"){
        this.gardenBase.active =false
        this.gardenCorn.active = true
    }
    // this.scheduleOnce(()=>{
    //     eventTarget.emit("turnOnBasket")
    // }, 0.2)
  }
  doneHarvesting(){
    this.gardenBase.active = true
    this.gardenTomato.active = false
    this.gardenCorn.active = false
  }
  onLoad() {
    eventTarget.on("doneUpgradeHouse", () => {
      this.scheduleOnce(this.startBuildGarden, 0.5);
    });
    eventTarget.on("setTypeTree", (type)=>{
        this.typeTree = type
        this.upgradeGarden()
    })
    // eventTarget.on("onUpgradeGarden", this.upgradeGarden, this)
    eventTarget.on("doneHarvesting", this.doneHarvesting, this)
    this.setUp();
  }

  protected onDestroy(): void {
    eventTarget.off("doneUpgradeHouse");
    eventTarget.off("setTypeTree")
    // eventTarget.off("onUpgradeGarden")
  }
}
