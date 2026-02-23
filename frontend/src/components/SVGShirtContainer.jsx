import { useState, useEffect, useRef } from "react";

/**
 * SVGShirtContainer Component
 * 
 * Loads an SVG shirt and applies dynamic color changes
 * Supports both:
 * - File paths: "/assets/shirts/shirt.svg"
 * - Base64 data URLs: "data:image/svg+xml;base64,..."
 * 
 * Props:
 * - svgUrl: Path to SVG file or base64 data URL
 * - shirtColor: Hex color code (e.g., "#FF0000")
 * - view: "front" or "back"
 */

export default function SVGShirtContainer({ svgUrl, shirtColor, view = "front" }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!svgUrl || !containerRef.current) return;

    const loadAndColorSVG = async () => {
      try {
        let svgText;

        // Check if it's a base64 data URL
        if (svgUrl.includes("data:image/svg+xml;base64")) {
          // Extract base64 string
          const base64String = svgUrl.split(",")[1];
          if (!base64String) {
            throw new Error("Invalid base64 SVG data");
          }

          // Decode base64 to text
          try {
            svgText = atob(base64String);
          } catch (e) {
            throw new Error("Failed to decode base64 SVG");
          }
        } else if (svgUrl.includes("data:image/svg+xml")) {
          // It's an inline SVG data URL (not base64)
          svgText = decodeURIComponent(svgUrl.split(",")[1]);
        } else {
          // It's a file path - fetch it
          const response = await fetch(svgUrl);
          if (!response.ok) {
            throw new Error(`Failed to load SVG: ${response.status}`);
          }
          svgText = await response.text();
        }

        // Replace the original fill color (#000000 black) with the selected color
        // This handles both fill="#000000" and fill='#000000' formats
        svgText = svgText
          .replace(/fill="#000000"/g, `fill="${shirtColor}"`)
          .replace(/fill='#000000'/g, `fill='${shirtColor}'`);

        // Parse SVG and insert into container
        containerRef.current.innerHTML = svgText;

        // Find the SVG element
        const svgElement = containerRef.current.querySelector("svg");
        if (!svgElement) {
          throw new Error("SVG element not found");
        }

        // Additional fallback: if any elements still have black fill, change them directly
        const allElements = containerRef.current.querySelectorAll("*");
        allElements.forEach((element) => {
          const fill = element.getAttribute("fill");
          if (fill === "#000000" || fill === "#000") {
            element.setAttribute("fill", shirtColor);
          }
        });

        setError(null);
      } catch (err) {
        console.error("SVG loading error:", err);
        setError(err.message);
      }
    };

    loadAndColorSVG();
  }, [svgUrl, shirtColor]);

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          border: "2px dashed #ff6b6b",
          borderRadius: "8px",
          color: "#ff6b6b",
          fontSize: "14px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        ❌ Error loading SVG: {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
