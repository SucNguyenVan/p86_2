import { _decorator, Component, Vec3, tween, Node, sp, UITransform, Vec2 } from "cc";
import eventTarget from "./Manager/EventManager"; // Đảm bảo đường dẫn chính xác
const { ccclass, property } = _decorator;

@ccclass("NvcScript")
export class NvcScript extends Component {
  private isMoving: boolean = false;
  @property
  speed = 200

  onTreeClicked(treePositionInWorld: Vec3) {
    this.moveToPosition(treePositionInWorld);
  }

  playNVCAnimation(animationName: string) {
    const skeleton = this.node.getComponent(sp.Skeleton);
    if (skeleton && animationName) {
      skeleton.setAnimation(0, animationName, true);
    } else if (!animationName) {
      skeleton.setAnimation(0, "idle", true);
    }
  }

  moveToPosition(targetPosition: Vec3) {
    if (this.isMoving) return; // Tránh việc di chuyển nhiều lần cùng lúc

    this.isMoving = true;

    // const offset = 30; // Khoảng cách từ `tree`
    // const nvcPosition = this.node.worldPosition;
    // const direction = targetPosition
    //   .clone()
    //   .subtract(nvcPosition)
    //   .normalize()
    //   .multiplyScalar(offset);
    // const newPosition = targetPosition.clone().subtract(direction);
    this.playNVCAnimation("walk");
    tween(this.node)
      .to(2.5, { position: targetPosition }) // Thời gian di chuyển
      .call(() => {
        this.scheduleOnce(() => {
          this.playNVCAnimation("chop_loop");
        }, 2);
        this.isMoving = false; // Hoàn tất di chuyển
      })
      .start();
  }

  moveTo(
    targetWorldPosition: Vec3,
    animationInEnd: string = "",
    timeDelay: number = 0
  ) {
    console.log({ targetWorldPosition });

    // Lấy tọa độ thế giới của node hiện tại (nvc)
    const nvcWorldPosition = this.node.getWorldPosition();

    // Tính toán vector hướng từ nvc đến targetWorldPosition , tức là tạo ra 1 vector theo đúng hướng từ vị trí node đến vị trí cần đến nhưng có độ dài là 1
    const direction = targetWorldPosition
      .clone()
      .subtract(nvcWorldPosition)
      .normalize();

    // Tính toán vị trí đích cách targetWorldPosition 80 đơn vị
    const distance = 80;
    const targetAdjustedWorldPosition = targetWorldPosition
      .clone()
      .subtract(direction.multiplyScalar(distance)); //direction.multiplyScalar(distance) đơn giản là nhân vector gốc lên distance lần thôi, xong lấy khoảng cách và trừ đi là ra vị trí chính xác cần di chuyển đến

    // Chuyển đổi vị trí đích thành tọa độ cục bộ của node hiện tại
    const targetLocalPosition = this.node.parent
      .getComponent(UITransform)
      .convertToNodeSpaceAR(targetAdjustedWorldPosition);
    // const distanceMove = (new Vec2(targetLocalPosition.x, targetLocalPosition.y)).length()
    // console.log({distanceMove})
    // console.log(targetLocalPosition.length())
    const timeToMove = targetLocalPosition.length() / this.speed
    // Di chuyển node đến vị trí đích
    this.playNVCAnimation("walk");
    tween(this.node)
      .to(timeToMove, { position: targetLocalPosition }) // Thời gian di chuyển 2 giây, có thể thay đổi
      .call(() => {
        if (animationInEnd) {
          this.playNVCAnimation(animationInEnd);
        }
        this.scheduleOnce(() => {
          eventTarget.emit("nvcMoveEnd");
        }, timeDelay);
      })
      .start();
  }

  onLoad() {
    // Đăng ký sự kiện từ EventManager
    // eventTarget.on("treeClicked", this.onTreeClicked, this);
    eventTarget.on("nvcMoveTo", this.moveTo, this);
  }

  onDestroy() {
    // Hủy đăng ký sự kiện khi đối tượng bị hủy
    eventTarget.off("treeClicked", this.onTreeClicked, this);
  }
}
