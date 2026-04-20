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

        // Helper function to normalize hex colors for comparison
        const normalizeColor = (color) => {
          if (!color) return null;
          color = color.trim().toLowerCase();
          
          // Handle named colors
          const colorMap = {
            'white': '#ffffff',
            'black': '#000000',
            'none': 'none',
          };
          if (colorMap[color]) return colorMap[color];
          
          // Handle 3-digit hex (e.g., #000 -> #000000)
          if (color.match(/^#[0-9a-f]{3}$/)) {
            return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
          }
          
          return color;
        };

        // Parse SVG and insert into container first
        containerRef.current.innerHTML = svgText;

        // Find the SVG element
        const svgElement = containerRef.current.querySelector("svg");
        if (!svgElement) {
          throw new Error("SVG element not found");
        }

        // Collect all unique fill colors to find the shirt color
        const fillColors = new Set();
        const allElements = containerRef.current.querySelectorAll("*");
        
        console.log(`SVG Loading for ${view}: Total elements found:`, allElements.length);
        
        allElements.forEach((element) => {
          const fill = element.getAttribute("fill");
          const style = element.getAttribute("style") || "";
          
          if (fill) {
            const normalized = normalizeColor(fill);
            if (normalized && normalized !== 'none') {
              fillColors.add(normalized);
            }
          }
          
          // Also check style attribute for fill
          const styleMatch = style.match(/fill:\s*([^;]+)/i);
          if (styleMatch) {
            const normalized = normalizeColor(styleMatch[1].trim());
            if (normalized && normalized !== 'none') {
              fillColors.add(normalized);
            }
          }
        });

        console.log(`SVG Color Detection for ${view}: All detected colors:`, Array.from(fillColors));

        // Find the shirt color (any color that's not white/transparent)
        const colorToReplace = Array.from(fillColors).find((color) => {
          return color !== '#ffffff' && color !== '#fff' && color !== 'white' && 
                 color !== 'transparent' && color !== 'rgba(0,0,0,0)' && color !== 'none';
        });

        console.log(`SVG Color Detection for ${view}: Selected color to replace:`, colorToReplace);

        // Replace the detected shirt color with the selected color
        if (colorToReplace) {
          console.log(`SVG Color Detection for ${view}: Replacing ${colorToReplace} with ${shirtColor}`);
          allElements.forEach((element) => {
            const fill = element.getAttribute("fill");
            if (fill && normalizeColor(fill) === colorToReplace) {
              element.setAttribute("fill", shirtColor);
            }
            
            // Also check and update style attribute
            const style = element.getAttribute("style") || "";
            const styleMatch = style.match(/fill:\s*([^;]+)/i);
            if (styleMatch && normalizeColor(styleMatch[1].trim()) === colorToReplace) {
              const updatedStyle = style.replace(
                /fill:\s*[^;]+/i,
                `fill: ${shirtColor}`
              );
              element.setAttribute("style", updatedStyle);
            }
          });
        } else {
          // Fallback: if only black and white found, replace black
          console.log(`SVG Color Detection for ${view}: No custom color found, attempting to replace black`);
          allElements.forEach((element) => {
            const fill = element.getAttribute("fill");
            if (fill === "#000000" || fill === "#000" || normalizeColor(fill) === '#000000') {
              element.setAttribute("fill", shirtColor);
            }
          });
        }

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
