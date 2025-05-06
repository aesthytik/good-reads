import { renderHook } from "@testing-library/react";
import { act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial value", 500));
    expect(result.current).toBe("initial value");
  });

  it("updates value after specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } }
    );

    // Change the value
    rerender({ value: "new value", delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe("initial value");

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe("new value");
  });

  it("does not update if unmounted", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } }
    );

    // Change the value
    rerender({ value: "new value", delay: 500 });

    // Unmount before delay completes
    unmount();

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should remain the same
    expect(result.current).toBe("initial value");
  });

  it("cancels previous timer on new value", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } }
    );

    // Change value first time
    rerender({ value: "first update", delay: 500 });

    // Wait partial time
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Change value again before first delay completes
    rerender({ value: "second update", delay: 500 });

    // Wait for first delay to complete
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Value should not be the first update
    expect(result.current).not.toBe("first update");

    // Wait for second delay to complete
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Value should now be the second update
    expect(result.current).toBe("second update");
  });

  it("handles different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial value", delay: 500 } }
    );

    // Change value with different delay
    rerender({ value: "new value", delay: 1000 });

    // Advance time by original delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should not have changed yet
    expect(result.current).toBe("initial value");

    // Advance remaining time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe("new value");
  });
});
