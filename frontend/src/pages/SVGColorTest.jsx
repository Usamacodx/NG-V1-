import { useState, useRef, useEffect } from "react";

/**
 * SVGColorTest Component
 * 
 * This is a test component to understand and implement SVG color-changing functionality.
 * It loads an SVG shirt and allows dynamic color changes to specific elements.
 * 
 * Key Elements:
 * - shirt-body-front / shirt-body-back: Main colorable elements
 * - sleeve-left-front / sleeve-right-front: Sleeve elements
 * - Other elements like buttons and seams remain unchanged
 */

export default function SVGColorTest() {
  const svgContainerRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [view, setView] = useState("front");
  const [colorableElements, setColorableElements] = useState([]);
  const [debugInfo, setDebugInfo] = useState("");

  // Color palette similar to CustomizationStudio
  const fabricColors = [
    { name: "Black", color: "#000000" },
    { name: "White", color: "#FFFFFF" },
    { name: "Navy", color: "#1E3A8A" },
    { name: "Gray", color: "#6B7280" },
    { name: "Red", color: "#EF4444" },
    { name: "Blue", color: "#3B82F6" },
    { name: "Green", color: "#10B981" },
    { name: "Orange", color: "#F97316" },
    { name: "Yellow", color: "#FACC15" },
    { name: "Turquoise", color: "#40E0D0" },
    { name: "Coral", color: "#FF7F50" },
    { name: "Magenta", color: "#FF00FF" },
    { name: "Purple", color: "#8B5CF6" },
    { name: "Cyan", color: "#22D3EE" },
    { name: "Olive", color: "#808000" },
    { name: "Maroon", color: "#800000" },
    { name: "Teal", color: "#008080" },
    { name: "Chocolate", color: "#D2691E" },
  ];

  // Load SVG on component mount
  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch("/assets/shirts/test-shirt.svg");
        if (!response.ok) {
          setDebugInfo(`❌ Failed to load SVG: ${response.status} ${response.statusText}`);
          return;
        }
        const svgText = await response.text();
        setSvgContent(svgText);
        setDebugInfo("✅ SVG loaded successfully");
      } catch (error) {
        setDebugInfo(`❌ Error loading SVG: ${error.message}`);
      }
    };

    loadSVG();
  }, []);

  // Update SVG when it's loaded or view changes
  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;

    // Create a temporary container to parse SVG
    const container = svgContainerRef.current;
    container.innerHTML = svgContent;

    // Find all colorable elements
    const elementsToColor = [
      `shirt-body-${view}`,
      `sleeve-left-${view}`,
      `sleeve-right-${view}`,
    ];

    setColorableElements(elementsToColor);

    // Log found elements
    const foundElements = elementsToColor.filter(id => container.querySelector(`#${id}`));
    setDebugInfo(`✅ SVG loaded. Found ${foundElements.length} colorable elements for ${view} view: ${foundElements.join(", ")}`);
  }, [svgContent, view]);

  // Apply color changes to SVG elements
  useEffect(() => {
    if (!svgContainerRef.current) return;

    const container = svgContainerRef.current;
    
    // Hide both views
    const frontView = container.querySelector("#front-view");
    const backView = container.querySelector("#back-view");
    
    if (frontView) frontView.style.display = view === "front" ? "block" : "none";
    if (backView) backView.style.display = view === "back" ? "block" : "none";

    // Apply color to all colorable elements and sleeves
    const elementsToColor = [
      `shirt-body-${view}`,
      `sleeve-left-${view}`,
      `sleeve-right-${view}`,
    ];

    elementsToColor.forEach((elementId) => {
      const element = container.querySelector(`#${elementId}`);
      if (element) {
        element.setAttribute("fill", selectedColor);
      }
    });

    setDebugInfo(`✅ Applied color ${selectedColor} to ${view} view`);
  }, [selectedColor, view, svgContent]);

  const handleDownloadSVG = () => {
    if (!svgContainerRef.current) return;

    const svg = svgContainerRef.current.querySelector("svg");
    if (!svg) {
      setDebugInfo("❌ SVG element not found");
      return;
    }

    // Clone and extract the current SVG
    const svgClone = svg.cloneNode(true);
    const svgXML = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgXML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `shirt-${view}-${selectedColor.replace("#", "")}.svg`;
    link.click();

    URL.revokeObjectURL(url);
    setDebugInfo(`✅ Downloaded shirt-${view}-${selectedColor.replace("#", "")}.svg`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎨 SVG Shirt Color Changer - Test Component</h1>
      
      <div style={styles.mainGrid}>
        {/* Left Panel - Controls */}
        <div style={styles.leftPanel}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎨 Color Palette</h3>
            <div style={styles.colorGrid}>
              {fabricColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.color)}
                  style={{
                    ...styles.colorButton,
                    backgroundColor: c.color,
                    border: selectedColor === c.color ? "3px solid #000" : "1px solid #ddd",
                  }}
                  title={c.name}
                />
              ))}
            </div>
            <p style={styles.selectedColorText}>
              Selected: <strong>{fabricColors.find(c => c.color === selectedColor)?.name || selectedColor}</strong>
            </p>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👕 View</h3>
            <div style={styles.viewButtons}>
              <button
                onClick={() => setView("front")}
                style={{
                  ...styles.viewButton,
                  backgroundColor: view === "front" ? "#000" : "#fff",
                  color: view === "front" ? "#fff" : "#000",
                }}
              >
                Front View
              </button>
              <button
                onClick={() => setView("back")}
                style={{
                  ...styles.viewButton,
                  backgroundColor: view === "back" ? "#000" : "#fff",
                  color: view === "back" ? "#fff" : "#000",
                }}
              >
                Back View
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>💾 Actions</h3>
            <button onClick={handleDownloadSVG} style={styles.downloadButton}>
              ⬇️ Download SVG
            </button>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>ℹ️ Debug Info</h3>
            <p style={styles.debugText}>{debugInfo}</p>
            <div style={styles.detailsBox}>
              <p style={styles.small}>
                <strong>Current View:</strong> {view.toUpperCase()}
              </p>
              <p style={styles.small}>
                <strong>Selected Color:</strong> {selectedColor}
              </p>
              <p style={styles.small}>
                <strong>Colorable Elements:</strong> {colorableElements.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - SVG Preview */}
        <div style={styles.rightPanel}>
          <div style={styles.previewCard}>
            <h3 style={styles.cardTitle}>Preview</h3>
            <div
              ref={svgContainerRef}
              style={styles.svgContainer}
            />
            {!svgContent && (
              <div style={styles.loadingText}>Loading SVG...</div>
            )}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <h3>📝 How This Works:</h3>
        <ul style={styles.infoList}>
          <li><strong>Colorable Elements:</strong> Only the shirt body and sleeves change color (IDs: shirt-body-front/back, sleeve-left, sleeve-right)</li>
          <li><strong>Static Elements:</strong> Buttons, seams, and neckline remain unchanged</li>
          <li><strong>View Toggle:</strong> Switch between front and back to test both sides independently</li>
          <li><strong>Download:</strong> Export the colored shirt as an SVG file</li>
          <li><strong>Integration:</strong> Once working, we'll integrate this logic into CustomizationStudio.jsx</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "30px",
    marginBottom: "30px",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  infoCard: {
    padding: "20px",
    border: "2px solid #ff6b6b",
    borderRadius: "8px",
    backgroundColor: "#ffe0e0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#000",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginBottom: "15px",
  },
  colorButton: {
    width: "100%",
    height: "40px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "1px solid #ddd",
    transition: "all 0.2s",
  },
  selectedColorText: {
    fontSize: "12px",
    color: "#666",
    marginTop: "10px",
    textAlign: "center",
  },
  viewButtons: {
    display: "flex",
    gap: "10px",
  },
  viewButton: {
    flex: 1,
    padding: "10px",
    border: "2px solid #000",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  downloadButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  previewCard: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  svgContainer: {
    width: "100%",
    height: "500px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
    padding: "50px",
  },
  debugText: {
    fontSize: "12px",
    color: "#d00",
    margin: "0 0 10px 0",
  },
  detailsBox: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "11px",
    color: "#333",
  },
  small: {
    margin: "5px 0",
    fontSize: "11px",
  },
  infoBox: {
    padding: "20px",
    border: "2px solid #0066cc",
    borderRadius: "8px",
    backgroundColor: "#e6f2ff",
  },
  infoList: {
    fontSize: "13px",
    lineHeight: "1.8",
    color: "#333",
    marginLeft: "20px",
  },
};
