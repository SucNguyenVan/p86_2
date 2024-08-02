import { _decorator, Component, Node, sys } from "cc";
const { ccclass, property } = _decorator;

declare var mraid: {
  open: (url: string) => void;
  close?: () => void;
  expand?: () => void;
  resize?: () => void;
  getState?: () => string;
  isViewable?: () => boolean;
  addEventListener?: (event: string, listener: () => void) => void;
  removeEventListener?: (event: string, listener: () => void) => void;
};

@ccclass("DownloadController")
export class DownloadController extends Component {
  @property
  androidLink =
    "https://play.google.com/store/apps/details?id=com.cscmobi.farm2.adventure";
  @property
  iosLink =
    "https://apps.apple.com/vn/app/gemstone-island-farm-game/id6478664088";
  mindworks = false;
  getLink() {
    if (sys.os === sys.OS.ANDROID) {
      return this.androidLink;
    }
    if (sys.os === sys.OS.IOS) {
      return this.iosLink;
    }
    return "";
  }
  onDownloadAction(){
    // if (this.mindworks) {

    //   window?.install && window?.install();
    //   window?.gameEnd && window?.gameEnd();
    // }
    let link = "https://play.google.com/store/apps/details?id=com.cscmobi.farm2.adventure";
    if (sys.os === sys.OS.ANDROID) {
        link = "https://play.google.com/store/apps/details?id=com.cscmobi.farm2.adventure";
      }
      if (sys.os === sys.OS.IOS) {
        link = "https://apps.apple.com/vn/app/gemstone-island-farm-game/id6478664088"
      }
    // if (!link) return 
    if (typeof mraid !== "undefined" && mraid.open) {
      mraid.open(link);
    } else {
      window.open(link);
    }
    //   window.open("https://play.google.com/store/apps/details?id=com.cscmobi.farm2.adventure")
  }
  onDownload() {
    if(this.mindworks){ // mintegral
      window?.install && window?.install();
      window?.gameEnd && window?.gameEnd();
    }else if(window?.dapi?.openStoreUrl){ //ironsource
      window?.dapi?.openStoreUrl()
    }else{  // unity and applovin
      this.onDownloadAction()
    }
  }
  protected onLoad(): void {
    this.node.on(Node.EventType.TOUCH_START, this.onDownload, this);
  }
}
