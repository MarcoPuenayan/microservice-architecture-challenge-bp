import { injectWebComponent } from "./inject-web-component";

jest.mock("../../environments/environment", () => ({
  environment: { webComponents: ["https://example.com/web-component.js"] },
}));

describe("injectWebComponent", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should inject web components", () => {
    const spyCreateElement = jest
      .fn()
      .mockReturnValue({ src: "https://example.com/web-component.js" });
    const spyAppendChild = jest.fn();
    const spyQuerySelector = jest
      .fn()
      .mockReturnValue({ appendChild: spyAppendChild });

    jest.spyOn(globalThis, "document", "get").mockReturnValue({
      createElement: spyCreateElement,
      querySelector: spyQuerySelector,
    } as any);

    // Call the function
    injectWebComponent();
    
    expect(spyCreateElement).toBeCalled();
    expect(spyQuerySelector).toBeCalled();
    expect(spyAppendChild).toBeCalled();
  });

});
