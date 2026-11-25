"use client";

import Particles from "@/src/components/react-bits/Particles";

/**
 * Neve discreta em WebGL (React Bits "Particles") para áreas de fundo escuro.
 * O canvas ocupa o container pai (que precisa ser `relative`) e não captura
 * cliques; mesmo assim os flocos são empurrados/desviados pelo cursor (o
 * Particles escuta o mouse pela janela, então cards por cima não atrapalham).
 * Pausa fora da tela/aba oculta e respeita `prefers-reduced-motion`; sem
 * WebGL2 simplesmente não renderiza nada.
 */
export function ChristmasSnow({ count = 2400, opacity = 0.85 }: { count?: number; opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Particles
        particleCount={count}
        particleSpread={20}
        particleColors={["#ffffff", "#dbe6ff", "#ffe3d0"]}
        particleBaseSize={110}
        sizeRandomness={1.2}
        cameraDistance={24}
        alphaParticles
        glow={0.25}
        twinkle={0.15}
        speed={0.08}
        drift="down"
        driftSpeed={0.6}
        disableRotation
        moveParticlesOnHover
        hoverEffect="repel"
        hoverRadius={230}
        particleHoverFactor={1.3}
        clickBurst={false}
        opacity={opacity}
      />
    </div>
  );
}
