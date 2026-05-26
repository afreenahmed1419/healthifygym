import BorderGlow from './BorderGlow';

type Variant = 'default' | 'subtle' | 'bold';

interface HealthifyCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: Variant;
}

const VARIANTS: Record<Variant, {
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  coneSpread: number;
  edgeSensitivity: number;
}> = {
  default: {
    glowColor: '30 100 50',
    glowIntensity: 1,
    glowRadius: 120,
    coneSpread: 30,
    edgeSensitivity: 25,
  },
  subtle: {
    glowColor: '30 100 50',
    glowIntensity: 0.65,
    glowRadius: 90,
    coneSpread: 25,
    edgeSensitivity: 30,
  },
  bold: {
    glowColor: '30 100 50',
    glowIntensity: 1,
    glowRadius: 160,
    coneSpread: 35,
    edgeSensitivity: 20,
  },
};

export default function HealthifyCard({
  children,
  className = '',
  style,
  variant = 'default',
}: HealthifyCardProps) {
  const config = VARIANTS[variant] ?? VARIANTS.default;

  return (
    <BorderGlow
      className={className}
      style={style}
      backgroundColor="#120F17"
      borderRadius={16}
      colors={['#FF6B00', '#FF8533', '#FFB380']}
      {...config}
    >
      {children}
    </BorderGlow>
  );
}
