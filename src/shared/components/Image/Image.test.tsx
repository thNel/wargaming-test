import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Image } from "./Image";

describe("Image", () => {
  it("finishes loading and forwards the image ref, native props, and load event", () => {
    const imageRef = createRef<HTMLImageElement>();
    const handleLoad = vi.fn();

    render(<Image alt="Ship" loading="lazy" onLoad={handleLoad} ref={imageRef} src="/ship.png" />);

    const image = screen.getByRole("img", { name: "Ship" });

    expect(image.parentElement).toHaveAttribute("aria-busy", "true");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(imageRef.current).toBe(image);

    fireEvent.load(image);

    expect(image.parentElement).not.toHaveAttribute("aria-busy");
    expect(handleLoad).toHaveBeenCalledOnce();
  });

  it("forwards the loading strategy selected by the consumer", () => {
    render(<Image alt="Ship" loading="eager" src="/ship.png" />);

    expect(screen.getByRole("img", { name: "Ship" })).toHaveAttribute("loading", "eager");
  });

  it("replaces a failed image with an accessible fallback that keeps its dimensions", () => {
    const handleError = vi.fn();

    render(<Image alt="Ship" h={18} onError={handleError} src="/ship.png" w={26} />);
    fireEvent.error(screen.getByRole("img", { name: "Ship" }));

    const fallback = screen.getByRole("img", { name: "Ship" });

    expect(fallback.tagName).toBe("DIV");
    expect(fallback).toHaveStyle({ height: "18px", width: "26px" });
    expect(handleError).toHaveBeenCalledOnce();
  });

  it("retries a failed source when it is selected again after another source", () => {
    const { rerender } = render(<Image alt="Ship" src="/first.png" />);

    fireEvent.error(screen.getByRole("img", { name: "Ship" }));
    rerender(<Image alt="Ship" src="/second.png" />);
    fireEvent.load(screen.getByRole("img", { name: "Ship" }));
    rerender(<Image alt="Ship" src="/first.png" />);

    const retriedImage = screen.getByRole("img", { name: "Ship" });

    expect(retriedImage).toHaveAttribute("src", "/first.png");
    expect(retriedImage.parentElement).toHaveAttribute("aria-busy", "true");

    fireEvent.load(retriedImage);

    expect(retriedImage.parentElement).not.toHaveAttribute("aria-busy");
  });

  it("starts a fresh loading state when returning to an earlier source", () => {
    const { rerender } = render(<Image alt="Ship" src="/first.png" />);

    fireEvent.load(screen.getByRole("img", { name: "Ship" }));
    rerender(<Image alt="Ship" src="/second.png" />);
    rerender(<Image alt="Ship" src="/first.png" />);

    expect(screen.getByRole("img", { name: "Ship" }).parentElement).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("keeps a decorative fallback hidden from assistive technology", () => {
    const { container } = render(<Image alt="" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the skeleton visible while its controlled loading state is active", () => {
    const { rerender } = render(<Image alt="Ship" isLoading src="/ship.png" />);

    fireEvent.load(screen.getByRole("img", { name: "Ship" }));

    expect(screen.getByRole("img", { name: "Ship" }).parentElement).toHaveAttribute(
      "aria-busy",
      "true",
    );

    rerender(<Image alt="Ship" isLoading={false} src="/ship.png" />);

    expect(screen.getByRole("img", { name: "Ship" }).parentElement).not.toHaveAttribute(
      "aria-busy",
    );
  });
});
