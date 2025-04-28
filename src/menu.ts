export class Menu {
  constructor(onSelect: (task: string) => void) {
    const menu = document.createElement("div");
    menu.style.position = "absolute";
    menu.style.top = "50%";
    menu.style.left = "50%";
    menu.style.transform = "translate(-50%, -50%)";
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.gap = "20px";
    menu.style.zIndex = "10";
    const tasks = [
      { name: "Ace of Shadows", key: "aceofshadow" },
      { name: "Magic Words", key: "magicwords" },
      { name: "Phoenix Flame", key: "phoenixflame" },
    ];
    tasks.forEach((task) => {
      const btn = document.createElement("button");
      btn.textContent = task.name;
      btn.onclick = () => onSelect(task.key);
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
    this.menu = menu;
  }
  destroy() {
    this.menu.remove();
  }
  private menu: HTMLDivElement;
}
