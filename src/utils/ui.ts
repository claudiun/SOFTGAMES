export class FpsCounter {
  private text: HTMLDivElement;
  private lastTime = performance.now();
  private frames = 0;
  private fps = 0;
  constructor() {
    this.text = document.createElement("div");
    this.text.style.position = "fixed";
    this.text.style.top = "8px";
    this.text.style.left = "8px";
    this.text.style.color = "white";
    this.text.style.background = "rgba(0,0,0,0.5)";
    this.text.style.fontFamily = "monospace";
    this.text.style.fontSize = "16px";
    this.text.style.padding = "2px 8px";
    this.text.style.zIndex = "100";
    document.body.appendChild(this.text);
    requestAnimationFrame(this.update.bind(this));
  }
  update() {
    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
      this.text.textContent = `FPS: ${this.fps}`;
    }
    requestAnimationFrame(this.update.bind(this));
  }
  destroy() {
    this.text.remove();
  }
}

export class FullscreenButton {
  private btn: HTMLButtonElement;
  constructor() {
    this.btn = document.createElement("button");
    this.btn.textContent = "Fullscreen";
    this.btn.style.position = "fixed";
    this.btn.style.top = "8px";
    this.btn.style.right = "8px";
    this.btn.style.zIndex = "100";
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
