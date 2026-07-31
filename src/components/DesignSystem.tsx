import { Reveal } from './Reveal';
import './DesignSystem.css';

const principles = [
  'Simplicity',
  'Consistency',
  'Accessibility',
  'Clarity',
  'Responsiveness',
  'Efficiency',
  'Delight',
  'Scalability',
  'Inclusivity',
  'Sustainability',
];

const colours = [
  { name: 'Emerald', role: 'Primary', hex: '#0B6E4F', varName: 'var(--green)' },
  { name: 'Royal Gold', role: 'Secondary', hex: '#D4AF37', varName: 'var(--gold)' },
  { name: 'Midnight Navy', role: 'Trust', hex: '#0B1F3A', varName: 'var(--ink)' },
  { name: 'Bright Teal', role: 'Innovation', hex: '#00B8D9', varName: 'var(--teal)' },
  { name: 'Success', role: 'Status', hex: '#28A745', varName: 'var(--success)' },
  { name: 'Amber', role: 'Warning', hex: '#F4B400', varName: 'var(--warning)' },
  { name: 'Error', role: 'Status', hex: '#D93025', varName: 'var(--error)' },
  { name: 'Info Blue', role: 'Information', hex: '#1A73E8', varName: 'var(--info)' },
];

const typeSteps = [
  { label: 'Display', sample: 'MORE THAN A FAN', size: 'clamp(28px, 4vw, 42px)' },
  { label: 'Heading', sample: 'Your club. Your people.', size: 'clamp(22px, 3vw, 30px)' },
  { label: 'Body', sample: 'Clear, respectful, action-oriented language for every stakeholder.', size: '16px' },
  { label: 'Caption', sample: 'LABEL · ACCESSIBLE · INCLUSIVE', size: '12px' },
];

export function DesignSystem() {
  return (
    <section className="design-system" id="design">
      <div className="shell">
        <div className="section-head">
          <Reveal className="eyebrow">Visual language</Reveal>
          <Reveal>
            <h2 className="display">A visual language built for trust and energy.</h2>
            <p>
              The Afrisport Connect Unified Design System keeps every screen recognisable—premium
              emerald and gold, clear type, inclusive contrast, and components that scale from
              phone to desktop.
            </p>
          </Reveal>
        </div>

        <Reveal className="ds-principles" aria-label="Design principles">
          {principles.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </Reveal>

        <div className="ds-block">
          <Reveal className="eyebrow">Colour</Reveal>
          <div className="ds-swatches" role="list">
            {colours.map((c) => (
              <Reveal as="article" key={c.hex} className="ds-swatch" role="listitem">
                <div className="ds-chip" style={{ background: c.varName }} aria-hidden="true" />
                <strong>{c.name}</strong>
                <span>{c.role}</span>
                <code>{c.hex}</code>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="ds-block">
          <Reveal className="eyebrow">Typography</Reveal>
          <div className="ds-type">
            {typeSteps.map((step) => (
              <Reveal as="div" key={step.label} className="ds-type-row">
                <span className="ds-type-label">{step.label}</span>
                <p className="display" style={{ fontSize: step.size }}>
                  {step.sample}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="ds-note">
          Brand personality: modern, professional, friendly, reliable, aspirational, intelligent,
          dynamic and inclusive—with authentic African football imagery and accessibility built in
          from the start.
        </Reveal>
      </div>
    </section>
  );
}
