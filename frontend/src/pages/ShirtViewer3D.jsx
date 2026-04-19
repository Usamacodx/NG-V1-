import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ShirtViewer3D() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Get design data from route state
    const { frontImage, backImage, shirtColor } = location.state || {};

    if (!frontImage && !backImage) {
      setError('No design data available. Please customize a shirt first.');
      setLoading(false);
      return;
    }

    // Check if Three.js is available
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => {
        initializeScene(frontImage, backImage, shirtColor);
      };
      script.onerror = () => {
        setError('Failed to load 3D library');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initializeScene(frontImage, backImage, shirtColor);
    }

    return () => {
      // Cleanup
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [location.state]);

  const initializeScene = (frontImage, backImage, shirtColor) => {
    try {
      const THREE = window.THREE;
      const container = containerRef.current;
      
      if (!container) return;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 3;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Create shirt model using planes
      const shirtGroup = new THREE.Group();

      // Create front panel
      const frontGeometry = new THREE.PlaneGeometry(2, 2.5);
      const frontMaterial = new THREE.MeshPhongMaterial({
        color: shirtColor || 0xffffff,
        shininess: 30,
        side: THREE.FrontSide,
      });
      const frontPanelMesh = new THREE.Mesh(frontGeometry, frontMaterial);
      frontPanelMesh.position.z = 0.1;
      frontPanelMesh.userData.isFront = true;

      // Create back panel
      const backGeometry = new THREE.PlaneGeometry(2, 2.5);
      const backMaterial = new THREE.MeshPhongMaterial({
        color: shirtColor || 0xffffff,
        shininess: 30,
        side: THREE.FrontSide,
      });
      const backPanelMesh = new THREE.Mesh(backGeometry, backMaterial);
      backPanelMesh.position.z = -0.1;
      backPanelMesh.rotation.y = Math.PI;
      backPanelMesh.userData.isBack = true;

      shirtGroup.add(frontPanelMesh);
      shirtGroup.add(backPanelMesh);

      // Load and apply textures with better error handling
      const textureLoader = new THREE.TextureLoader();
      const textureLoadPromises = [];

      if (frontImage) {
        const frontTexturePromise = new Promise((resolve) => {
          textureLoader.load(
            frontImage,
            (texture) => {
              texture.magFilter = THREE.LinearFilter;
              texture.minFilter = THREE.LinearFilter;
              texture.anisotropy = renderer.capabilities.maxAnisotropy;
              frontPanelMesh.material.map = texture;
              frontPanelMesh.material.needsUpdate = true;
              frontPanelMesh.material.color.set(0xffffff); // Show texture fully
              resolve();
            },
            undefined,
            (error) => {
              console.warn('Failed to load front texture:', error);
              resolve();
            }
          );
        });
        textureLoadPromises.push(frontTexturePromise);
      }

      if (backImage) {
        const backTexturePromise = new Promise((resolve) => {
          textureLoader.load(
            backImage,
            (texture) => {
              texture.magFilter = THREE.LinearFilter;
              texture.minFilter = THREE.LinearFilter;
              texture.anisotropy = renderer.capabilities.maxAnisotropy;
              backPanelMesh.material.map = texture;
              backPanelMesh.material.needsUpdate = true;
              backPanelMesh.material.color.set(0xffffff); // Show texture fully
              resolve();
            },
            undefined,
            (error) => {
              console.warn('Failed to load back texture:', error);
              resolve();
            }
          );
        });
        textureLoadPromises.push(backTexturePromise);
      }

      // Wait for textures to load
      Promise.all(textureLoadPromises).catch((err) => {
        console.warn('Texture loading completed with some errors:', err);
      });

      scene.add(shirtGroup);

      // Create sleeves (simple cylinders for visual effect)
      const sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
      const sleeveMaterial = new THREE.MeshPhongMaterial({
        color: shirtColor || 0xffffff,
        shininess: 30,
      });

      const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
      leftSleeve.position.set(-1.2, 0.5, 0);
      leftSleeve.rotation.z = Math.PI / 2;

      const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
      rightSleeve.position.set(1.2, 0.5, 0);
      rightSleeve.rotation.z = Math.PI / 2;

      shirtGroup.add(leftSleeve);
      shirtGroup.add(rightSleeve);

      scene.add(shirtGroup);

      // Mouse controls
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let rotation = { x: 0, y: 0 };

      renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;

          rotation.y += deltaX * 0.01;
          rotation.x += deltaY * 0.01;

          shirtGroup.rotation.y = rotation.y;
          shirtGroup.rotation.x = rotation.x;

          previousMousePosition = { x: e.clientX, y: e.clientY };
        }
      });

      renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
      });

      renderer.domElement.addEventListener('mouseleave', () => {
        isDragging = false;
      });

      // Zoom with scroll
      renderer.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const currentZ = camera.position.z;
        const newZ = e.deltaY > 0 ? currentZ + zoomSpeed : currentZ - zoomSpeed;
        camera.position.z = Math.max(1, Math.min(8, newZ));
      }, { passive: false });

      // Auto-rotate
      let autoRotateSpeed = 0.005;
      let isAutoRotating = true;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        if (isAutoRotating && !isDragging) {
          shirtGroup.rotation.y += autoRotateSpeed;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      setLoading(false);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('mousedown', null);
        renderer.domElement.removeEventListener('mousemove', null);
        renderer.domElement.removeEventListener('mouseup', null);
        renderer.domElement.removeEventListener('mouseleave', null);
        renderer.domElement.removeEventListener('wheel', null);
      };
    } catch (err) {
      console.error('Error initializing 3D scene:', err);
      setError('Failed to initialize 3D viewer: ' + err.message);
      setLoading(false);
    }
  };

  const handleScreenshot = () => {
    if (rendererRef.current) {
      rendererRef.current.render(window.THREE.scene, window.THREE.camera);
      const link = document.createElement('a');
      link.href = rendererRef.current.domElement.toDataURL('image/png');
      link.download = `shirt-3d-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
          <div style={styles.headerTitleSection}>
            <h1 style={styles.title}>🎨 3D Shirt Preview</h1>
            <p style={styles.subtitle}>Interactive view of your customized design</p>
          </div>
        </div>
        <button onClick={handleScreenshot} style={styles.screenshotButton}>
          📸 Screenshot
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>⚠️ {error}</p>
          <button onClick={() => navigate(-1)} style={styles.errorButton}>
            Return to Customization
          </button>
        </div>
      )}

      {loading && !error && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading 3D viewer...</p>
        </div>
      )}

      <div style={styles.mainContent}>
        {/* LEFT PANEL - INFO */}
        <div style={styles.leftPanel}>
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>📋 Design Info</h3>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Front Design:</span>
              <span style={styles.infoValue}>✓ Customized</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Back Design:</span>
              <span style={styles.infoValue}>✓ Customized</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Status:</span>
              <span style={styles.infoValue} style={{color: '#4CAF50'}}>Ready</span>
            </div>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>🎮 Controls</h3>
            <div style={styles.controlItem}>
              <span style={styles.controlIcon}>🖱️</span>
              <span style={styles.controlText}>Drag to rotate</span>
            </div>
            <div style={styles.controlItem}>
              <span style={styles.controlIcon}>🔄</span>
              <span style={styles.controlText}>Scroll to zoom</span>
            </div>
            <div style={styles.controlItem}>
              <span style={styles.controlIcon}>⏸️</span>
              <span style={styles.controlText}>Hover to pause</span>
            </div>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>✨ Features</h3>
            <div style={styles.featureItem}>✓ Auto-rotate</div>
            <div style={styles.featureItem}>✓ 360° view</div>
            <div style={styles.featureItem}>✓ HD textures</div>
            <div style={styles.featureItem}>✓ Realistic lighting</div>
          </div>

          <button 
            onClick={() => navigate(-1)} 
            style={styles.editButton}
          >
            ✏️ Edit Design
          </button>
        </div>

        {/* CENTER - 3D CANVAS */}
        <div style={styles.centerSection}>
          <div style={styles.canvasWrapper}>
            <div ref={containerRef} style={styles.canvas} />
          </div>
        </div>

        {/* RIGHT PANEL - TIPS */}
        <div style={styles.rightPanel}>
          <div style={styles.tipsCard}>
            <h3 style={styles.cardTitle}>💡 Tips</h3>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>1.</span>
              <span style={styles.tipText}>Rotate the shirt to see all angles</span>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>2.</span>
              <span style={styles.tipText}>Use your mouse to explore the design</span>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>3.</span>
              <span style={styles.tipText}>Zoom in to see fine details</span>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>4.</span>
              <span style={styles.tipText}>Take a screenshot when satisfied</span>
            </div>
          </div>

          <div style={styles.tipsCard}>
            <h3 style={styles.cardTitle}>✅ Next Steps</h3>
            <p style={styles.nextStepText}>
              Satisfied with your design?
            </p>
            <button 
              onClick={() => navigate(-1)} 
              style={styles.nextStepButton}
            >
              Proceed to Cart
            </button>
          </div>

          <div style={styles.tipsCard}>
            <h3 style={styles.cardTitle}>📸 Screenshot</h3>
            <p style={styles.nextStepText}>
              Capture your 3D view
            </p>
            <button 
              onClick={handleScreenshot} 
              style={styles.screenshotActionButton}
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          🚀 Powered by Three.js | 3D Preview Technology
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
    borderBottom: '3px solid #764ba2',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flex: 1,
  },
  headerTitleSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: '0',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '5px 0 0 0',
    fontSize: '13px',
    opacity: 0.9,
    fontWeight: '300',
  },
  backButton: {
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  screenshotButton: {
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#667eea',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 280px',
    gap: '20px',
    flex: 1,
    padding: '20px',
    overflow: 'hidden',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
  },
  centerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    overflow: 'hidden',
  },
  canvasWrapper: {
    flex: 1,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
    border: '2px solid #e0e7ff',
  },
  canvas: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: '10px',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: '18px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '2px solid #e0e7ff',
    transition: 'all 0.3s ease',
  },
  tipsCard: {
    backgroundColor: '#fff',
    padding: '18px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '2px solid #e0e7ff',
    transition: 'all 0.3s ease',
  },
  cardTitle: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    fontWeight: '700',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '13px',
  },
  infoLabel: {
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    color: '#667eea',
    fontWeight: '600',
  },
  controlItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    fontSize: '13px',
  },
  controlIcon: {
    fontSize: '18px',
    minWidth: '24px',
  },
  controlText: {
    color: '#555',
  },
  featureItem: {
    padding: '8px 0',
    fontSize: '13px',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tipItem: {
    display: 'flex',
    gap: '10px',
    padding: '12px 0',
    fontSize: '13px',
    color: '#555',
  },
  tipIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '28px',
    height: '28px',
    backgroundColor: '#667eea',
    color: '#fff',
    borderRadius: '50%',
    fontWeight: 'bold',
    fontSize: '12px',
    flexShrink: 0,
  },
  tipText: {
    lineHeight: '1.4',
  },
  nextStepText: {
    margin: '0 0 12px 0',
    fontSize: '13px',
    color: '#666',
  },
  editButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    marginTop: 'auto',
  },
  nextStepButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#764ba2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)',
  },
  screenshotActionButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
  },
  errorBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
    backgroundColor: '#ffebee',
    borderRadius: '12px',
    border: '2px solid #ef5350',
    padding: '40px 20px',
  },
  errorText: {
    margin: '0 0 20px 0',
    color: '#c62828',
    fontSize: '16px',
    fontWeight: '500',
  },
  errorButton: {
    padding: '12px 20px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
  },
  loadingBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e0e7ff',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: '#667eea',
    fontWeight: '500',
  },
  footer: {
    padding: '15px 30px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e7ff',
    textAlign: 'center',
  },
  footerText: {
    margin: '0',
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
  },
};

// Add animation keyframes
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    button {
      transition: all 0.3s ease;
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    button:active {
      transform: translateY(0);
    }
  `;
  if (document.head) {
    document.head.appendChild(styleSheet);
  }
}
