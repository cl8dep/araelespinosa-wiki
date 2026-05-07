import React, {useState, useRef, useEffect} from 'react';
import {Info} from 'lucide-react';
import styles from './infoTooltip.module.css';

interface Props {
  content: React.ReactNode;
  children?: React.ReactNode;
}

export default function InfoTooltip({content, children}: Props): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
const [pos, setPos] = useState<{top: number; left: number; align: 'left' | 'right'}>({
    top: 0, left: 0, align: 'left',
  });

  const show = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const tooltipWidth = 260;
    const spaceRight = viewportWidth - rect.left;
    const align = spaceRight < tooltipWidth + 16 ? 'right' : 'left';
    setPos({
      top: rect.bottom + 6,
      left: align === 'left' ? rect.left : rect.right,
      align,
    });
    setVisible(true);
  };

  const hide = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setVisible(false);
    };
    const onScroll = () => setVisible(false);
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('scroll', onScroll, {passive: true, capture: true});
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('scroll', onScroll, {capture: true} as EventListenerOptions);
    };
  }, [visible]);

  return (
    <span
      ref={ref}
      className={`${styles.trigger}${children ? '' : ` ${styles.triggerIcon}`}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={(e) => { e.stopPropagation(); setVisible((v) => !v); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setVisible((v) => !v)}>
      {children ?? <Info size={13} strokeWidth={2} />}
      {visible && (
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${pos.align === 'right' ? styles.tooltipRight : ''}`}
          style={{
            position: 'fixed',
            top: pos.top,
            ...(pos.align === 'left' ? {left: pos.left} : {right: window.innerWidth - pos.left}),
          }}
          >
          {content}
        </div>
      )}
    </span>
  );
}
