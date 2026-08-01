import { useEffect, useRef, useState } from 'react';
import { api, extractList, mediaUrl } from '../lib/api';

type Campaign = {
  id: number;
  name?: string;
  title?: string;
  headline?: string;
  body?: string | null;
  image?: string | null;
  banner?: string | null;
  cta_label?: string | null;
  url?: string | null;
};

/**
 * Sponsored placement. Records an impression once the banner is actually
 * visible, and a click when the user follows it — matching how the mobile app
 * attributes campaign performance.
 */
export function SponsoredBanner() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    let active = true;
    api
      .get('/campaigns')
      .then((data) => {
        if (!active) return;
        const list = extractList<Campaign>(data);
        if (list.length) setCampaign(list[Math.floor(Math.random() * list.length)]);
      })
      .catch(() => {
        /* sponsorship is optional — stay silent */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !campaign || counted.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || counted.current) return;
        counted.current = true;
        observer.disconnect();
        void api.post(`/campaigns/${campaign.id}/impression`).catch(() => {});
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [campaign]);

  if (!campaign) return null;

  const image = mediaUrl(campaign.image ?? campaign.banner);

  function onClick() {
    void api.post(`/campaigns/${campaign!.id}/click`).catch(() => {});
    if (campaign!.url) window.open(campaign!.url, '_blank', 'noopener');
  }

  return (
    <div className="sponsored" ref={ref}>
      <span className="sponsored-tag">Sponsored</span>
      <div className="sponsored-body">
        {image && <img src={image} alt="" loading="lazy" />}
        <div>
          <strong>{campaign.headline ?? campaign.title ?? campaign.name}</strong>
          {campaign.body && <p>{campaign.body}</p>}
        </div>
      </div>
      <button className="button button-outline button-sm" type="button" onClick={onClick}>
        {campaign.cta_label ?? 'Find out more'}
      </button>
    </div>
  );
}
