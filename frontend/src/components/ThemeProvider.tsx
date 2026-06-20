'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    fetch(`/api/settings/theme`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (!data) return;
        const root = document.documentElement;
        const set = (v: string, val: string) => root.style.setProperty(v, val);
        set('--color-primary',   data.primaryColor);
        set('--color-secondary', data.secondaryColor);
        set('--color-accent',    data.accentColor);
        set('--color-background',data.bgColor);
        set('--color-text',      data.textColor);
        set('--color-card',      data.cardColor);
        set('--color-border',    data.borderColor);
        set('--color-header',    data.headerColor);
        set('--color-footer',    data.footerColor);
        if (data.borderRadius) set('--radius', data.borderRadius + 'px');
        if (data.fontSize)     root.style.fontSize = data.fontSize + 'px';
      })
      .catch(() => {});
  }, []);

  return null;
}
