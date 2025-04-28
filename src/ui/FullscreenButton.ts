export class FullscreenButton {
  private btn: HTMLButtonElement;
  constructor() {
    this.btn = document.createElement("button");
    this.btn.textContent = "Fullscreen";
    this.btn.className = "fullscreen-button";
    document.body.appendChild(this.btn);
    this.btn.onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };
  }
  destroy() {
    this.btn.remove();
  }
}
