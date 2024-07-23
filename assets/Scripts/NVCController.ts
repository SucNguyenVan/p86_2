import { _decorator, Component, Vec3, tween, Node, sp, UITransform } from "cc";
import eventTarget from "./Manager/EventManager"; // Đảm bảo đường dẫn chính xác
const { ccclass } = _decorator;

@ccclass("NvcScript")
export class NvcScript extends Component {
  private isMoving: boolean = false;

  onTreeClicked(treePositionInWorld: Vec3) {
    this.moveToPosition(treePositionInWorld);
  }

  moveToPosition(targetPosition: Vec3) {
    if (this.isMoving) return; // Tránh việc di chuyển nhiều lần cùng lúc

    this.isMoving = true;

    const offset = 30; // Khoảng cách từ `tree`
    const nvcPosition = this.node.worldPosition;
    const direction = targetPosition.clone()
      .subtract(nvcPosition)
      .normalize()
      .multiplyScalar(offset);
    const newPosition = targetPosition.clone().subtract(direction);
    this.playAnimation("walk");
    tween(this.node)
      .to(2.5, { position: targetPosition }) // Thời gian di chuyển 
      .call(() => {
        this.scheduleOnce(() => {
          this.playAnimation("chop_loop");
        }, 2); 
        this.isMoving = false; // Hoàn tất di chuyển
      })
      .start();
  }

  playAnimation(animationName: string) {
    const skeleton = this.node.getComponent(sp.Skeleton);
    if (skeleton) {
      skeleton.setAnimation(0, animationName, true);
    }
  }

  onLoad() {
    // Đăng ký sự kiện từ EventManager
    eventTarget.on("treeClicked", this.onTreeClicked, this);
  }

  onDestroy() {
    // Hủy đăng ký sự kiện khi đối tượng bị hủy
    eventTarget.off("treeClicked", this.onTreeClicked, this);
  }
}
