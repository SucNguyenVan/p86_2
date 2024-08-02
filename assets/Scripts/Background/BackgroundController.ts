import {
  _decorator,
  Component,
  Node,
  Vec3,
  sp,
  tween,
  v2,
  Sprite,
  UITransform,
  v3,
} from "cc";
const { ccclass, property } = _decorator;
import eventTarget from "../Manager/EventManager";

@ccclass("BackgroundController")
export class BackgroundController extends Component {
  @property(Node)
  nvc: Node = null;
  @property(Node)
  tree: Node = null;
  @property(Node)
  house: Node = null;
  @property(Node)
  download: Node = null;
  @property(Node)
  basket: Node = null;
  @property(Node)
  foodResource: Node = null;
  @property(Node)
  meatResource: Node = null
  @property(Node)
  eggResource: Node = null

  duration = 1;
  livestockType = ""

  mindworks = true
  vungle = false

  playNVCAnimation(animationName: string) {
    const skeleton = this.nvc.getComponent(sp.Skeleton);
    if (skeleton && animationName) {
      skeleton.setAnimation(0, animationName, true);
    } else if (!animationName) {
      skeleton.setAnimation(0, "idle", true);
    }
  }

  nvcMoveTo(targetPosition: Vec3) {
    // const offset = 80; // Khoảng cách từ `tree`
    // const nvcPos = this.nvc.getPosition();
    // const direction = targetPosition
    //   .clone()
    //   .subtract(nvcPos)
    //   .normalize()
    //   .multiplyScalar(offset);
    // const newPosition = targetPosition.clone().subtract(direction);
    // this.playNVCAnimation("walk");
    // tween(this.nvc)
    //   .to(3, { position: newPosition })
    //   .call(() => {
    //     this.playNVCAnimation("chop_loop");
    //     this.scheduleOnce(() => {
    //       this.doneChopWood();
    //     }, 2); // Thay đổi thời gian nếu cần
    //   })
    //   .start();
  }

  actionGetResource(type = "", startPos: Vec3) {
    if (!type) return;
    const endPos = this.basket.position;
    // Khởi tạo node actionNode dựa trên loại resource
    if (type === "food") {
      this.foodResource.active = true;
      this.foodResource.setPosition(startPos);
    } else if(type === "pig") {
      this.meatResource.active = true;
      this.meatResource.setPosition(startPos)
    } else if(type === "chicken"){
      this.eggResource.active = true;
      this.eggResource.setPosition(startPos)
    } else {
      return
    }
    
    // Tạo tween cho node actionNode di chuyển thẳng từ startPos đến endPos
    let actionNode = type === "food" ? this.foodResource : (type ==="pig" ? this.meatResource : this.eggResource)
    let tweenAction = tween(actionNode)
      .to(this.duration, { position: endPos }, { easing: "sineInOut" })
      .call(() => {
        actionNode.active = false; 
        eventTarget.emit("doneHarvesting")
        this.scheduleOnce(()=>{
          this.download.active = true
          this.download.setSiblingIndex(this.node.children.length - 1)
          // this.download.getComponent(UITransform).priority = 10
        }, 1)
      });

    // Bắt đầu tweenAction
    tweenAction.start();
  }

  onClickBasket() {
    const pointer = this.basket.getChildByPath("Pointer");
    if (pointer) {
      pointer.active = false;
    }
    const gardenPos = this.node.getChildByPath("Garden")?.position;
    if (gardenPos) {
      this.actionGetResource("food", gardenPos);
    }
    const cagePos = this.node.getChildByPath("Cage")?.position;
    if(gardenPos){
      this.actionGetResource(this.livestockType, cagePos)
    }
    eventTarget.emit("onClickBasket")
  }

  onGetCageResource(type = ""){
    if(!type) return
    this.livestockType = type
    // if(type === "pig"){
    //   this.meatResource.active = true
    // }else if(type === "chicken"){
    //   this.eggResource.active = true
    // }
  }

  doneChopWood() {
    this.playNVCAnimation("idle");
    this.tree.active = false;
    eventTarget.emit("onUpgradeMainHouse");
  }

  protected onLoad(): void {
    this.download.active = false;
    this.basket.active = false;
    this.foodResource.active = false;
    this.meatResource.active = false
    this.eggResource.active = false
    eventTarget.on("moveToTree", () => {
      // this.nvcMoveTo(this.tree.position);
      eventTarget.emit("nvcMoveTo", this.tree.getWorldPosition(), "chop_loop", 2)
    });
    eventTarget.on("turnOnBasket", () => {
      this.basket.active = true;
    });
    eventTarget.on("onGetCageResource", this.onGetCageResource, this)
    this.basket.on(Node.EventType.TOUCH_START, this.onClickBasket, this);
    eventTarget.on("nvcMoveEnd", this.doneChopWood, this)
  }

  start() {
    this.nvc.getComponent(UITransform).priority = 10;
    if(this.mindworks){
      window?.gameReady && window?.gameReady()
    }
  }

  protected onDestroy(): void {
    eventTarget.off("moveToTree");
    eventTarget.off("turnOnBasket");
    eventTarget.off("onGetCageResource")
  }

  EventNetWork(){
    if(this.mindworks){
      window?.gameEnd && window?.gameEnd()
    }
    if(this.vungle){
      parent.postMessage("complete", '*')
    }
  }
}
