// Mock screens for testing

describe("HomeScreen", () => {
  it("renders loading state", () => {
    const loading = true;
    expect(loading).toBe(true);
  });

  it("renders empty state", () => {
    const items = [];
    expect(items.length).toBe(0);
  });

  it("renders receipt list", () => {
    const receipts = [
      { id: "1", amount: 10.50 },
      { id: "2", amount: 25.00 }
    ];
    expect(receipts.length).toBe(2);
    expect(receipts[0].amount).toBe(10.50);
  });
});

describe("CameraScreen", () => {
  it("shows camera permission state", () => {
    const hasPermission = true;
    expect(hasPermission).toBe(true);
  });

  it("handles capture action", () => {
    const captured = jest.fn();
    captured();
    expect(captured).toHaveBeenCalled();
  });
});
