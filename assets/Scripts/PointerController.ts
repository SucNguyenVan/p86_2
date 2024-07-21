import { _decorator, Component, Vec3, tween, v3, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PointerMovement2D")
export class PointerMovement2D extends Component {
  private startPosition: Vec3 = v3();
  private endPosition: Vec3 = v3();

  @property({ type: Number })
  private moveDistance: number = 30;

  @property
  private moveDuration: number = 0.5;

  start() {
    // Lấy vị trí ban đầu của node pointer
    this.startPosition.set(this.node.position);

    // Tạo vị trí đích dựa trên moveDistance
    this.endPosition.set(this.startPosition);
    this.endPosition.y += this.moveDistance;

    this.startMoving();
  }

  startMoving() {
    // Sử dụng tween để tạo chuyển động lên xuống liên tục
    tween(this.node)
      .to(this.moveDuration, { position: this.endPosition })
      .to(this.moveDuration, { position: this.startPosition })
      .union()
      .repeatForever()
      .start();
  }
}
