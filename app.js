// Wind Load Calculator Application
class WindLoadCalculator {
  constructor() {
    this.elements = this.initializeElements();
    this.bindEvents();
    this.calculate();
    this.updateVisualization();
    this.startWindAnimation();
  }

  initializeElements() {
    return {
      // Input elements
      windSpeed: document.getElementById('windSpeed'),
      windSpeedInput: document.getElementById('windSpeedInput'),
      airDensity: document.getElementById('airDensity'),
      panelArea: document.getElementById('panelArea'),
      panelAreaInput: document.getElementById('panelAreaInput'),
      installAngle: document.getElementById('installAngle'),
      installAngleInput: document.getElementById('installAngleInput'),
      
      // Output elements
      windSpeedKmh: document.getElementById('windSpeedKmh'),
      windSpeedMph: document.getElementById('windSpeedMph'),
      dynamicPressure: document.getElementById('dynamicPressure'),
      dynamicPressureBar: document.getElementById('dynamicPressureBar'),
      effectiveAreaResult: document.getElementById('effectiveAreaResult'),
      areaPercentage: document.getElementById('areaPercentage'),
      windLoad: document.getElementById('windLoad'),
      safetyStatus: document.getElementById('safetyStatus'),
      safetyPointer: document.getElementById('safetyPointer'),
      
      // Visualization elements
      vizWindSpeed: document.getElementById('vizWindSpeed'),
      windSpeedBar: document.getElementById('windSpeedBar'),
      angleText: document.getElementById('angleText'),
      angleLine: document.getElementById('angleLine'),
      angleArc: document.getElementById('angleArc'),
      vizAngleText: document.getElementById('vizAngleText'),
      vizAngleArc: document.getElementById('vizAngleArc'),
      solarPanel: document.getElementById('solarPanel'),
      panelGroup: document.getElementById('panelGroup'),
      windArrows: document.getElementById('windArrows'),
      
      // Buttons
      presetBtns: document.querySelectorAll('.preset-btn'),
      scenarioBtns: document.querySelectorAll('.scenario-btn')
    };
  }

  bindEvents() {
    // Sync sliders with number inputs
    this.elements.windSpeed.addEventListener('input', (e) => {
      this.elements.windSpeedInput.value = e.target.value;
      this.calculate();
      this.updateVisualization();
    });
    
    this.elements.windSpeedInput.addEventListener('input', (e) => {
      this.elements.windSpeed.value = e.target.value;
      this.calculate();
      this.updateVisualization();
    });
    
    this.elements.panelArea.addEventListener('input', (e) => {
      this.elements.panelAreaInput.value = e.target.value;
      this.calculate();
      this.updateVisualization();
    });
    
    this.elements.panelAreaInput.addEventListener('input', (e) => {
      this.elements.panelArea.value = e.target.value;
      this.calculate();
      this.updateVisualization();
    });
    
    this.elements.installAngle.addEventListener('input', (e) => {
      this.elements.installAngleInput.value = e.target.value;
      this.calculate();
      this.updateVisualization();
      this.updateAngleIndicator();
    });
    
    this.elements.installAngleInput.addEventListener('input', (e) => {
      this.elements.installAngle.value = e.target.value;
      this.calculate();
      this.updateVisualization();
      this.updateAngleIndicator();
    });
    
    this.elements.airDensity.addEventListener('input', () => {
      this.calculate();
    });
    
    // Preset buttons
    this.elements.presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const area = e.target.dataset.area;
        this.elements.panelArea.value = area;
        this.elements.panelAreaInput.value = area;
        this.calculate();
        this.updateVisualization();
      });
    });
    
    // Scenario buttons
    this.elements.scenarioBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenario = e.target.dataset.scenario;
        this.loadScenario(scenario);
      });
    });
  }

  calculate() {
    const windSpeed = parseFloat(this.elements.windSpeed.value);
    const airDensity = parseFloat(this.elements.airDensity.value);
    const area = parseFloat(this.elements.panelArea.value);
    const angle = parseFloat(this.elements.installAngle.value);
    
    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;
    
    // Calculate dynamic pressure (Pa)
    const dynamicPressure = 0.5 * airDensity * Math.pow(windSpeed, 2);
    
    // Calculate effective area (m²)
    const effectiveArea = area * Math.sin(angleRad);
    
    // Calculate wind load (Pa)
    const windLoad = dynamicPressure;
    
    // Convert wind speed
    const windSpeedKmh = windSpeed * 3.6;
    const windSpeedMph = windSpeed * 2.237;
    
    // Calculate area percentage
    const areaPercentage = (effectiveArea / area) * 100;
    
    // Update display
    this.elements.windSpeedKmh.textContent = `= ${windSpeedKmh.toFixed(1)} km/h`;
    this.elements.windSpeedMph.textContent = `= ${windSpeedMph.toFixed(1)} mph`;
    this.elements.dynamicPressure.textContent = dynamicPressure.toFixed(2);
    this.elements.effectiveAreaResult.textContent = effectiveArea.toFixed(4);
    this.elements.areaPercentage.textContent = areaPercentage.toFixed(1);
    this.elements.windLoad.textContent = windLoad.toFixed(2);
    
    // Update dynamic pressure bar
    const maxPressure = 3000; // Max for visualization
    const pressurePercent = Math.min((dynamicPressure / maxPressure) * 100, 100);
    this.elements.dynamicPressureBar.style.width = `${pressurePercent}%`;
    
    // Update safety assessment
    this.updateSafetyAssessment(windLoad);
    
    return {
      windSpeed,
      dynamicPressure,
      effectiveArea,
      windLoad,
      areaPercentage,
      windSpeedKmh,
      windSpeedMph
    };
  }

  updateSafetyAssessment(windLoad) {
    let safetyLevel, safetyClass, safetyColor;
    
    if (windLoad < 500) {
      safetyLevel = "✓ 안전 (Safe)";
      safetyClass = "safe";
      safetyColor = "#10b981";
    } else if (windLoad < 1200) {
      safetyLevel = "⚠️ 주의 필요 (Caution)";
      safetyClass = "caution";
      safetyColor = "#f59e0b";
    } else if (windLoad < 2400) {
      safetyLevel = "⚠️ 위험 (Dangerous)";
      safetyClass = "danger";
      safetyColor = "#f97316";
    } else {
      safetyLevel = "🚨 매우 위험 (Critical)";
      safetyClass = "critical";
      safetyColor = "#ef4444";
    }
    
    this.elements.safetyStatus.textContent = safetyLevel;
    this.elements.safetyStatus.className = `safety-status ${safetyClass}`;
    
    // Update safety pointer position
    const maxLoad = 2400;
    const pointerPercent = Math.min((windLoad / maxLoad) * 100, 100);
    this.elements.safetyPointer.style.left = `${pointerPercent}%`;
  }

  updateVisualization() {
    const windSpeed = parseFloat(this.elements.windSpeed.value);
    const angle = parseFloat(this.elements.installAngle.value);
    const area = parseFloat(this.elements.panelArea.value);
    
    // Update wind speed indicator
    this.elements.vizWindSpeed.textContent = windSpeed.toFixed(1);
    const maxWindSpeed = 80;
    const windPercent = (windSpeed / maxWindSpeed) * 100;
    this.elements.windSpeedBar.style.width = `${Math.min(windPercent, 100)}%`;
    
    // Update panel rotation
    const panelTransform = `rotate(-${angle})`;
    const panelElements = this.elements.panelGroup.querySelectorAll('rect, g');
    panelElements.forEach(element => {
      if (element.id !== 'panelGrid') {
        element.style.transform = panelTransform;
      } else {
        element.style.transform = panelTransform;
      }
    });
    
    // Update angle indicators
    this.updateAngleIndicator();
    
    // Update panel size based on area
    const baseWidth = 90;
    const baseHeight = 60;
    const scaleFactor = Math.sqrt(area / 1.65); // Base area is 1.65 m²
    const newWidth = baseWidth * scaleFactor;
    const newHeight = baseHeight * scaleFactor;
    
    const panelRects = this.elements.panelGroup.querySelectorAll('rect');
    panelRects.forEach(rect => {
      rect.setAttribute('width', newWidth);
      rect.setAttribute('height', newHeight);
      rect.setAttribute('x', -newWidth / 2);
    });
    
    // Update grid lines
    const gridLines = this.elements.panelGroup.querySelectorAll('#panelGrid line');
    gridLines.forEach((line, index) => {
      if (index < 2) { // Horizontal lines
        const y = -3 + (newHeight / 3) * (index + 1);
        line.setAttribute('y1', y);
        line.setAttribute('y2', y);
        line.setAttribute('x1', -newWidth / 2);
        line.setAttribute('x2', newWidth / 2);
      } else { // Vertical lines
        const x = -newWidth / 2 + (newWidth / 3) * (index - 1);
        line.setAttribute('x1', x);
        line.setAttribute('x2', x);
        line.setAttribute('y1', -3);
        line.setAttribute('y2', newHeight - 3);
      }
    });
    
    // Update wind arrows based on wind speed
    this.updateWindArrows(windSpeed);
  }

  updateAngleIndicator() {
    const angle = parseFloat(this.elements.installAngle.value);
    
    // Update small angle indicator
    this.elements.angleText.textContent = `${angle}°`;
    
    const angleRad = (angle * Math.PI) / 180;
    const endX = 10 + 25 * Math.cos(angleRad);
    const endY = 30 - 25 * Math.sin(angleRad);
    
    this.elements.angleLine.setAttribute('x2', endX);
    this.elements.angleLine.setAttribute('y2', endY);
    
    // Update arc
    const largeArcFlag = angle > 180 ? 1 : 0;
    const arcEndX = 10 + 15 * Math.cos(angleRad);
    const arcEndY = 30 - 15 * Math.sin(angleRad);
    
    this.elements.angleArc.setAttribute('d', 
      `M 25 30 A 15 15 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY}`
    );
    
    // Update main visualization angle
    this.elements.vizAngleText.textContent = `θ = ${angle}°`;
    
    const vizAngleRad = (angle * Math.PI) / 180;
    const vizArcEndX = -50 + 30 * Math.cos(vizAngleRad);
    const vizArcEndY = -30 * Math.sin(vizAngleRad);
    
    const vizLargeArcFlag = angle > 180 ? 1 : 0;
    this.elements.vizAngleArc.setAttribute('d', 
      `M -20 0 A 30 30 0 ${vizLargeArcFlag} 0 ${vizArcEndX} ${vizArcEndY}`
    );
  }

  updateWindArrows(windSpeed) {
    // Clear existing arrows
    this.elements.windArrows.innerHTML = '';
    
    // Calculate number of arrows based on wind speed
    const numArrows = Math.max(3, Math.min(12, Math.floor(windSpeed / 5)));
    
    for (let i = 0; i < numArrows; i++) {
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      arrow.classList.add('wind-particle');
      
      const y = 80 + i * 15 + (Math.random() * 10);
      const delay = (i * 0.3) + (Math.random() * 0.5);
      
      arrow.innerHTML = `
        <line x1="0" y1="${y}" x2="30" y2="${y}" stroke="var(--color-primary)" stroke-width="2" marker-end="url(#arrowhead)"/>
        <text x="35" y="${y + 4}" fill="var(--color-text-secondary)" font-size="10">→</text>
      `;
      
      arrow.style.animationDelay = `${delay}s`;
      arrow.style.animationDuration = `${Math.max(1, 3 - windSpeed / 30)}s`;
      
      this.elements.windArrows.appendChild(arrow);
    }
  }

  startWindAnimation() {
    // Create arrow marker for SVG
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', 'var(--color-primary)');
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    document.getElementById('solarPanelViz').appendChild(defs);
  }

  loadScenario(scenario) {
    const scenarios = {
      residential: { windSpeed: 30, area: 1.65, angle: 30 },
      commercial: { windSpeed: 30, area: 2.0, angle: 30 },
      typhoon: { windSpeed: 50, area: 1.65, angle: 30 },
      flatroof: { windSpeed: 30, area: 1.65, angle: 10 }
    };
    
    const config = scenarios[scenario];
    if (config) {
      this.elements.windSpeed.value = config.windSpeed;
      this.elements.windSpeedInput.value = config.windSpeed;
      this.elements.panelArea.value = config.area;
      this.elements.panelAreaInput.value = config.area;
      this.elements.installAngle.value = config.angle;
      this.elements.installAngleInput.value = config.angle;
      
      this.calculate();
      this.updateVisualization();
      this.updateAngleIndicator();
    }
  }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WindLoadCalculator();
});