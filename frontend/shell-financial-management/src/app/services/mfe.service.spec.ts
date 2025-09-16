import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { MfeService, MFEConfig } from "./mfe.service";
import { AuthService } from "./auth.service";

describe("MfeService", () => {
  let service: MfeService;
  let mockAuthService: jest.Mocked<AuthService>;

  const mockAuthState = {
    isAuthenticated: true,
    user: {
      id: "1",
      username: "admin",
      email: "admin@test.com",
      firstName: "Admin",
      lastName: "User",
      roles: ["admin"],
    },
    token: "mock-token",
  };

  beforeEach(() => {
    mockAuthService = {
      authState$: of(mockAuthState),
      getCurrentAuthState: jest.fn().mockReturnValue(mockAuthState),
    } as any;

    // Mock sessionStorage
    const mockStorage: { [key: string]: string } = {};
    jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation((key, value) => {
        mockStorage[key] = value;
      });
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => {
      delete mockStorage[key];
    });

    TestBed.configureTestingModule({
      providers: [
        MfeService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    service = TestBed.inject(MfeService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return MFE configurations", () => {
    const configs = service.getMFEConfigs();
    expect(configs).toHaveLength(4);
    expect(configs[0].id).toBe("clientes");
    expect(configs[1].id).toBe("cuentas");
    expect(configs[2].id).toBe("movimientos");
    expect(configs[3].id).toBe("reportes");
  });

  it("should get specific MFE config by id", () => {
    const clientesConfig = service.getMFEConfig("clientes");
    expect(clientesConfig).toBeDefined();
    expect(clientesConfig?.name).toBe("Gestión de Clientes");
    expect(clientesConfig?.url).toBeDefined(); // URL should come from environment

    const invalidConfig = service.getMFEConfig("invalid");
    expect(invalidConfig).toBeUndefined();
  });

  it("should load MFE and emit current MFE", (done) => {
    service.loadMFE("clientes");

    service.currentMFE.subscribe((mfe) => {
      if (mfe) {
        expect(mfe.id).toBe("clientes");
        expect(mfe.name).toBe("Gestión de Clientes");
        done();
      }
    });
  });

  it("should close MFE", (done) => {
    // First load an MFE
    service.loadMFE("clientes");

    // Then close it
    service.closeMFE();

    service.currentMFE.subscribe((mfe) => {
      if (mfe === null) {
        done();
      }
    });
  });

  it("should handle invalid MFE id", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    service.loadMFE("invalid-mfe-id");

    expect(consoleSpy).toHaveBeenCalledWith(
      "MFE with id 'invalid-mfe-id' not found"
    );

    consoleSpy.mockRestore();
  });

  it("should update session storage when auth state changes", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    // The service should have already updated storage on initialization
    expect(setItemSpy).toHaveBeenCalledWith("auth_token", "mock-token");
    expect(setItemSpy).toHaveBeenCalledWith(
      "user_data",
      JSON.stringify(mockAuthState.user)
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      "authentication",
      expect.stringContaining("mock-token")
    );
    expect(setItemSpy).toHaveBeenCalledWith("bp_auth_token", "mock-token");
    expect(setItemSpy).toHaveBeenCalledWith(
      "bp_user_info",
      JSON.stringify(mockAuthState.user)
    );
  });

  it("should clear session storage when not authenticated", () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

    // Create a new service instance with unauthenticated state
    const unauthenticatedState = {
      isAuthenticated: false,
      user: null,
      token: null,
    };

    mockAuthService.authState$ = of(unauthenticatedState);

    const newService = new MfeService(mockAuthService);

    expect(removeItemSpy).toHaveBeenCalledWith("auth_token");
    expect(removeItemSpy).toHaveBeenCalledWith("user_data");
    expect(removeItemSpy).toHaveBeenCalledWith("authentication");
    expect(removeItemSpy).toHaveBeenCalledWith("bp_auth_token");
    expect(removeItemSpy).toHaveBeenCalledWith("bp_user_info");
  });

  it("should validate MFE origins correctly", () => {
    // Access private method for testing
    const isValidOrigin = (service as any).isValidMFEOrigin.bind(service);

    expect(isValidOrigin("http://localhost:4201")).toBe(true);
    expect(isValidOrigin("http://localhost:63807")).toBe(true);
    expect(isValidOrigin("http://localhost:4201/some-path")).toBe(true);
    expect(isValidOrigin("http://malicious-site.com")).toBe(false);
    expect(isValidOrigin("https://example.com")).toBe(false);
  });

  it("should handle MFE messages correctly", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // Access private method for testing
    const handleMessage = (service as any).handleMFEMessage.bind(service);

    // Test READY message
    handleMessage({ type: "READY", source: "clientes" });
    expect(consoleSpy).toHaveBeenCalledWith("MFE clientes is ready");

    // Test NAVIGATION message
    handleMessage({ type: "NAVIGATION", payload: { url: "/some-route" } });
    expect(consoleSpy).toHaveBeenCalledWith("MFE navigation request:", {
      url: "/some-route",
    });

    // Test ERROR message
    const errorSpy = jest.spyOn(console, "error").mockImplementation();
    handleMessage({
      type: "ERROR",
      payload: { message: "Something went wrong" },
    });
    expect(errorSpy).toHaveBeenCalledWith("MFE error:", {
      message: "Something went wrong",
    });

    // Test unknown message type
    handleMessage({ type: "UNKNOWN" as any });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unhandled MFE message type:",
      "UNKNOWN"
    );

    consoleSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
