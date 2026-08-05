import React, { useEffect, useRef } from 'react';

interface Node {
  id: number;
  orbitRadius: number;
  baseAngle: number;
  currentAngle: number;
  rotationSpeed: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  pulse: number;
  pulseSpeed: number;
  isCenter?: boolean;
}

interface Connection {
  from: number;
  to: number;
  distance: number;
}

interface SignalPacket {
  id: number;
  fromNodeId: number;
  toNodeId: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export const AiHeroGraph: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isHovered = false;

    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let packets: SignalPacket[] = [];
    let orbitRings: { radius: number; speed: number; dashes: number[] }[] = [];

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width || 360;
      height = rect.height || 360;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      initCircularGraph(width, height);
    };

    const initCircularGraph = (w: number, h: number) => {
      nodes = [];
      connections = [];
      packets = [];

      const centerX = w / 2;
      const centerY = h / 2;
      const minDimension = Math.min(w, h);
      const isMobile = w < 500;

      // Concentric Orbit Radii (slightly compact)
      const r1 = minDimension * 0.14; // Inner orbit
      const r2 = minDimension * 0.26; // Mid orbit
      const r3 = minDimension * 0.37; // Outer orbit

      orbitRings = [
        { radius: r1, speed: 0.003, dashes: [4, 6] },
        { radius: r2, speed: -0.002, dashes: [6, 10] },
        { radius: r3, speed: 0.0012, dashes: [3, 8] },
      ];

      const palette = [
        { main: '#2563EB', glow: 'rgba(37, 99, 235, 0.6)' },
        { main: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' },
        { main: '#60A5FA', glow: 'rgba(96, 165, 250, 0.7)' },
        { main: '#93C5FD', glow: 'rgba(147, 197, 253, 0.85)' },
      ];

      // 1. Center Core AI Node
      nodes.push({
        id: 0,
        orbitRadius: 0,
        baseAngle: 0,
        currentAngle: 0,
        rotationSpeed: 0,
        x: centerX,
        y: centerY,
        radius: 6,
        color: '#3B82F6',
        glowColor: 'rgba(59, 130, 246, 0.8)',
        pulse: 0,
        pulseSpeed: 0.03,
        isCenter: true,
      });

      let idCounter = 1;

      // 2. Inner Ring Nodes (4 nodes)
      const count1 = 4;
      for (let i = 0; i < count1; i++) {
        const angle = (i / count1) * Math.PI * 2 + Math.PI / 6;
        const colorObj = palette[i % palette.length];
        nodes.push({
          id: idCounter++,
          orbitRadius: r1,
          baseAngle: angle,
          currentAngle: angle,
          rotationSpeed: 0.0025,
          x: centerX + Math.cos(angle) * r1,
          y: centerY + Math.sin(angle) * r1,
          radius: 3.5,
          color: colorObj.main,
          glowColor: colorObj.glow,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }

      // 3. Middle Ring Nodes (8 nodes)
      const count2 = isMobile ? 6 : 8;
      for (let i = 0; i < count2; i++) {
        const angle = (i / count2) * Math.PI * 2 + Math.PI / 4;
        const colorObj = palette[(i + 1) % palette.length];
        nodes.push({
          id: idCounter++,
          orbitRadius: r2,
          baseAngle: angle,
          currentAngle: angle,
          rotationSpeed: -0.0018,
          x: centerX + Math.cos(angle) * r2,
          y: centerY + Math.sin(angle) * r2,
          radius: 3.2,
          color: colorObj.main,
          glowColor: colorObj.glow,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }

      // 4. Outer Ring Nodes (10 nodes)
      const count3 = isMobile ? 7 : 10;
      for (let i = 0; i < count3; i++) {
        const angle = (i / count3) * Math.PI * 2;
        const colorObj = palette[(i + 2) % palette.length];
        nodes.push({
          id: idCounter++,
          orbitRadius: r3,
          baseAngle: angle,
          currentAngle: angle,
          rotationSpeed: 0.0012,
          x: centerX + Math.cos(angle) * r3,
          y: centerY + Math.sin(angle) * r3,
          radius: 2.8,
          color: colorObj.main,
          glowColor: colorObj.glow,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }

      // Build Interconnected Network Connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];

          // Connect center to inner ring
          if (n1.isCenter && n2.orbitRadius === r1) {
            connections.push({ from: n1.id, to: n2.id, distance: r1 });
          }
          // Connect inner ring to middle ring if adjacent angles
          else if (n1.orbitRadius === r1 && n2.orbitRadius === r2) {
            const angleDiff = Math.abs(n1.baseAngle - n2.baseAngle);
            if (angleDiff < Math.PI / 2.2 || angleDiff > Math.PI * 1.6) {
              connections.push({ from: n1.id, to: n2.id, distance: r2 - r1 });
            }
          }
          // Connect middle ring to outer ring
          else if (n1.orbitRadius === r2 && n2.orbitRadius === r3) {
            const angleDiff = Math.abs(n1.baseAngle - n2.baseAngle);
            if (angleDiff < Math.PI / 2.5 || angleDiff > Math.PI * 1.6) {
              connections.push({ from: n1.id, to: n2.id, distance: r3 - r2 });
            }
          }
          // Connect nodes on the same ring if neighbors
          else if (n1.orbitRadius === n2.orbitRadius && n1.orbitRadius > 0) {
            const angleDiff = Math.abs(n1.baseAngle - n2.baseAngle);
            if (angleDiff < (Math.PI * 2) / 3.5) {
              connections.push({ from: n1.id, to: n2.id, distance: n1.orbitRadius });
            }
          }
        }
      }

      // Spawn Signal Packets (data points flowing through network)
      const packetCount = isMobile ? 8 : 12;
      for (let i = 0; i < packetCount; i++) {
        if (connections.length === 0) break;
        const conn = connections[Math.floor(Math.random() * connections.length)];
        const isReversed = Math.random() > 0.5;

        packets.push({
          id: i,
          fromNodeId: isReversed ? conn.to : conn.from,
          toNodeId: isReversed ? conn.from : conn.to,
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.007,
          color: palette[Math.floor(Math.random() * palette.length)].main,
          size: 2 + Math.random() * 1.2,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    const parentEl = canvas.parentElement;
    if (parentEl) {
      parentEl.addEventListener('mousemove', handleMouseMove);
      parentEl.addEventListener('mouseleave', handleMouseLeave);
    }

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    handleResize();

    // Render loop
    let globalRotation = 0;
    const render = () => {
      globalRotation += 0.001;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth mouse lerp
      if (isHovered) {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
      } else {
        mouseX += (centerX - mouseX) * 0.02;
        mouseY += (centerY - mouseY) * 0.02;
      }

      // Mouse Parallax Offset
      const parallaxX = (mouseX - centerX) * 0.04;
      const parallaxY = (mouseY - centerY) * 0.04;

      // 1. Draw Circular Orbit Tracks (Faint blue concentric rings)
      orbitRings.forEach((ring) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX + parallaxX, centerY + parallaxY, ring.radius, 0, Math.PI * 2);
        ctx.setLineDash(ring.dashes);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // 2. Update Node orbital positions
      nodes.forEach((node) => {
        node.pulse += node.pulseSpeed;

        if (!node.isCenter) {
          node.currentAngle += node.rotationSpeed;
          node.x = centerX + parallaxX + Math.cos(node.currentAngle) * node.orbitRadius;
          node.y = centerY + parallaxY + Math.sin(node.currentAngle) * node.orbitRadius;
        } else {
          node.x = centerX + parallaxX;
          node.y = centerY + parallaxY;
        }
      });

      // 3. Draw Network Connections (Lines)
      connections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.from);
        const toNode = nodes.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const currentDist = Math.sqrt(dx * dx + dy * dy);

        const alpha = Math.max(0.08, Math.min(0.35, 1 - currentDist / (Math.min(width, height) * 0.45)));

        const grad = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        grad.addColorStop(0, `rgba(37, 99, 235, ${alpha})`);
        grad.addColorStop(0.5, `rgba(96, 165, 250, ${alpha * 1.3})`);
        grad.addColorStop(1, `rgba(59, 130, 246, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = fromNode.isCenter ? 1.4 : 0.9;
        ctx.stroke();
      });

      // 4. Update & Draw Data Packets
      packets.forEach((packet) => {
        packet.progress += packet.speed;

        const fromNode = nodes.find((n) => n.id === packet.fromNodeId);
        const toNode = nodes.find((n) => n.id === packet.toNodeId);

        if (!fromNode || !toNode) return;

        if (packet.progress >= 1) {
          packet.progress = 0;
          toNode.pulse = 0;

          const nextConns = connections.filter(
            (c) => c.from === toNode.id || c.to === toNode.id
          );

          if (nextConns.length > 0) {
            const nextConn = nextConns[Math.floor(Math.random() * nextConns.length)];
            const nextTargetId = nextConn.from === toNode.id ? nextConn.to : nextConn.from;
            packet.fromNodeId = toNode.id;
            packet.toNodeId = nextTargetId;
          } else {
            const temp = packet.fromNodeId;
            packet.fromNodeId = packet.toNodeId;
            packet.toNodeId = temp;
          }
        }

        const px = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
        const py = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

        // Glowing packet tail/aura
        const packetGrad = ctx.createRadialGradient(px, py, 0, px, py, packet.size * 3);
        packetGrad.addColorStop(0, '#FFFFFF');
        packetGrad.addColorStop(0.3, packet.color);
        packetGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(px, py, packet.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = packetGrad;
        ctx.fill();

        // Packet core
        ctx.beginPath();
        ctx.arc(px, py, packet.size, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      });

      // 5. Draw Circular Nodes
      nodes.forEach((node) => {
        const pulseScale = 1 + Math.sin(node.pulse) * 0.22;
        const currentRadius = node.radius * pulseScale;

        // Outer Glow Halo
        const glowRadius = currentRadius * (node.isCenter ? 5 : 3.6);
        const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        glowGrad.addColorStop(0, node.glowColor);
        glowGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Core Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Outer crisp ring for central hub
        if (node.isCenter) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(147, 197, 253, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Inner highlight dot
        ctx.beginPath();
        ctx.arc(node.x - currentRadius * 0.2, node.y - currentRadius * 0.2, currentRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (parentEl) {
        parentEl.removeEventListener('mousemove', handleMouseMove);
        parentEl.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center pointer-events-auto ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full bg-transparent" />
    </div>
  );
};
