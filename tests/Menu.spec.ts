jest.mock("../src/ui/Button", () => {
  return {
    Button: jest.fn().mockImplementation(({ label, onClick }) => {
      return {
        label,
        onClick,
        addChild: jest.fn(),
        x: 0,
        y: 0,
      };
    }),
  };
});

jest.mock("pixi.js", () => {
  class MockContainer {
    children: any[] = [];
    addChild(child: any) {
      this.children.push(child);
      return child;
    }
    on(event: string, handler: any) {
      // No-op for event binding
      return this;
    }
  }
  class MockGraphics extends MockContainer {
    beginFill() {
      return this;
    }
    drawRoundedRect() {
      return this;
    }
    endFill() {
      return this;
    }
  }
  class MockText extends MockContainer {
    anchor = { set: jest.fn() };
    x = 0;
    y = 0;
    constructor() {
      super();
    }
  }
  class MockSprite extends MockContainer {
    width = 0;
    height = 0;
    constructor() {
      super();
    }
  }
  return {
    Application: jest.fn().mockImplementation(() => ({
      screen: { width: 800, height: 600 },
      ticker: { add: jest.fn() },
    })),
    Container: MockContainer,
    Graphics: MockGraphics,
    Text: MockText,
    Sprite: MockSprite,
  };
});

import * as PIXI from "pixi.js";
import { Menu } from "../src/ui/Menu";

describe("Menu", () => {
  let app: PIXI.Application;
  beforeEach(() => {
    app = new PIXI.Application({ width: 800, height: 600 });
  });

  it("should instantiate without errors", () => {
    expect(() => new Menu(app, () => {})).not.toThrow();
  });

  it("should render a button for each scene", () => {
    const menu = new Menu(app, () => {});
    expect(menu.children.length).toBe(3);
  });

  it("should call onSelect with the correct key when a button is clicked", () => {
    let selectedKey: string | null = null;
    const menu = new Menu(app, (key) => {
      selectedKey = key;
    });
    // Simulate click on the first button
    const firstButton: any = menu.children[0];
    firstButton.onClick();
    expect(selectedKey).toBe("aceofshadow");
  });

  it("should set correct labels for each button", () => {
    const menu = new Menu(app, () => {});
    const labels = menu.children.map((btn: any) => btn.label);
    expect(labels).toEqual(["Ace of Shadows", "Magic Words", "Phoenix Flame"]);
  });
});
