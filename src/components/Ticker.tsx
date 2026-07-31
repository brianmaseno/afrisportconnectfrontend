import { brand } from '../lib/media';
import './Ticker.css';

const items = [
  'Football super app',
  'Matches in real time',
  'Digital fan passport',
  'Learning & talent',
  'Trusted by design',
  'Community chapters',
  'Impact you can measure',
  'Built for 54 markets',
];

export function Ticker() {
  const loop = [...items, ...items];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="ticker-item">
            <img src={brand.mark} alt="" width={17} height={17} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
