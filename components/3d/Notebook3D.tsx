import { Line, Text, Billboard, RoundedBox } from "@react-three/drei"
import { NotebookDimensions } from "@/types/notebook"

export function Notebook3D({
  dimensoes,
  cor,
  posicao,
  isXRay,
  showRuler,
  cornerRadius,
  camView
}: {
  dimensoes: NotebookDimensions
  cor: string
  posicao: [number, number, number]
  isXRay: boolean
  showRuler: boolean
  cornerRadius: number
  camView: string
}) {
  const scale = 0.1
  const hx = (dimensoes.largura * scale) / 2
  const hy = (dimensoes.espessura * scale) / 2
  const hz = (dimensoes.profundidade * scale) / 2
  const offset = 0.05
  const textGap = 0.18
  const topY = hy + 0.02
  
  // Tamanho dos tics (os tracinhos das pontas)
  const t = 0.03 

  return (
    <group position={posicao}>
      <RoundedBox
        args={[dimensoes.largura * scale, dimensoes.espessura * scale, dimensoes.profundidade * scale]}
        radius={cornerRadius}
        smoothness={4}
        castShadow={!isXRay}
      >
        <meshStandardMaterial
          color={cor}
          transparent={true}
          opacity={isXRay ? 0.25 : 1}
          depthWrite={!isXRay}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {showRuler && (
        <group>
          {/* MEDIDA DE LARGURA (X) */}
          {camView !== "side" && (
            <group>
              <Line
                points={[[-hx, topY, hz + offset], [hx, topY, hz + offset]]}
                color="#F2F0EF" lineWidth={2} dashed dashSize={0.05} gapSize={0.05}
              />
              {/* Canto Esquerdo: Um traço vertical e um que entra em direção ao notebook */}
              <group position={[-hx, topY, hz + offset]}>
                <Line points={[[0, -t, 0], [0, t, 0]]} color="#F2F0EF" lineWidth={2} /> {/* Vertical */}
                <Line points={[[0, 0, -t], [0, 0, 0]]} color="#F2F0EF" lineWidth={2} /> {/* Horizontal Profundidade */}
              </group>
              {/* Canto Direito */}
              <group position={[hx, topY, hz + offset]}>
                <Line points={[[0, -t, 0], [0, t, 0]]} color="#F2F0EF" lineWidth={2} />
                <Line points={[[0, 0, -t], [0, 0, 0]]} color="#F2F0EF" lineWidth={2} />
              </group>

              <Billboard position={[0, topY, hz + offset + textGap]}>
                <Text fontSize={0.12} color="#F2F0EF" anchorY="middle" anchorX="center">
                  {dimensoes.largura} cm
                </Text>
              </Billboard>
            </group>
          )}

          {/* MEDIDA DE PROFUNDIDADE (Z) */}
          {camView !== "front" && (
            <group>
              <Line
                points={[[hx + offset, topY, -hz], [hx + offset, topY, hz]]}
                color="#F2F0EF" lineWidth={2} dashed dashSize={0.05} gapSize={0.05}
              />
              {/* Canto Fundo */}
              <group position={[hx + offset, topY, -hz]}>
                <Line points={[[0, -t, 0], [0, t, 0]]} color="#F2F0EF" lineWidth={2} /> {/* Vertical */}
                <Line points={[[-t, 0, 0], [0, 0, 0]]} color="#F2F0EF" lineWidth={2} /> {/* Horizontal Largura */}
              </group>
              {/* Canto Frente */}
              <group position={[hx + offset, topY, hz]}>
                <Line points={[[0, -t, 0], [0, t, 0]]} color="#F2F0EF" lineWidth={2} />
                <Line points={[[-t, 0, 0], [0, 0, 0]]} color="#F2F0EF" lineWidth={2} />
              </group>

              <Billboard position={[hx + offset + textGap, topY, 0]}>
                <Text fontSize={0.12} color="#F2F0EF" anchorY="middle" anchorX="center">
                  {dimensoes.profundidade} cm
                </Text>
              </Billboard>
            </group>
          )}

          {/* MEDIDA DE ESPESSURA (Y) */}
          {camView !== "front" && camView !== "side" && (
            <group>
              <Line
                points={[[-hx - offset, -hy, -hz], [-hx - offset, hy, -hz]]}
                color="#F2F0EF" lineWidth={2} dashed dashSize={0.05} gapSize={0.05}
              />
              {/* Cantos da Espessura */}
              <group position={[-hx - offset, -hy, -hz]}>
                <Line points={[[0, 0, 0], [t, 0, 0]]} color="#F2F0EF" lineWidth={2} />
                <Line points={[[0, 0, 0], [0, 0, t]]} color="#F2F0EF" lineWidth={2} />
              </group>
              <group position={[-hx - offset, hy, -hz]}>
                <Line points={[[0, 0, 0], [t, 0, 0]]} color="#F2F0EF" lineWidth={2} />
                <Line points={[[0, 0, 0], [0, 0, t]]} color="#F2F0EF" lineWidth={2} />
              </group>

              <Billboard position={[-hx - offset - textGap, 0, -hz]}>
                <Text fontSize={0.12} color="#F2F0EF" anchorY="middle" anchorX="center">
                  {dimensoes.espessura} cm
                </Text>
              </Billboard>
            </group>
          )}
        </group>
      )}
    </group>
  )
}