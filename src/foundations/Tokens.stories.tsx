import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../components/Card';
import { GridLayout } from '../components/GridLayout';
import { Button } from '../components/Button';

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Live reference for every design token in the system. Edit `src/tokens/tokens.json` and re-run `npm run tokens:build` to regenerate the CSS variables; this story reads them back from `getComputedStyle` so it always reflects the current build.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Swatch = ({name, value}: { name: string; value: string }) => {
  const isColor = /^(#|rgb|var|hsl)/i.test(value) || value.includes('color');
  const resolved =
    typeof document !== 'undefined' && name.startsWith('--')
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : '';

  return (
    <Card
      elevation="flat"
      padding="sm"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-05)',
      }}
    >
      <div
        style={{
          height: 'var(--ds-space-5)',
          borderRadius: 'var(--ds-radius-sm)',
          background: isColor ? value : 'transparent',
          border: isColor ? '0' : 'var(--ds-border-width-thin) dashed var(--ds-color-border-default)',
          display: isColor ? 'block' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--ds-font-family-mono), monospace',
          fontSize: 'var(--ds-font-size-xs)',
          color: 'var(--ds-color-text-secondary)',
        }}
      >
        {!isColor && value}
      </div>
      <div style={{fontFamily: 'var(--ds-font-family-mono), monospace', fontSize: 'var(--ds-font-size-xs)'}}>
        <div style={{fontWeight: 'var(--ds-font-weight-semibold)', wordBreak: 'break-all'}}>{name}</div>
        <div style={{color: 'var(--ds-color-text-muted)'}}>{resolved || value}</div>
      </div>
    </Card>
  );
};

const ScaleRow = ({name, value, preview = 'bar'}: { name: string; value: string; preview?: 'bar' | 'opacity' }) => {
  const resolved =
    typeof document !== 'undefined' && name.startsWith('--')
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : '';

  return (
    <Card elevation="flat" padding="sm">
      <GridLayout size="sm">
        <code style={{fontSize: 'var(--ds-font-size-sm)', alignSelf: 'center', minWidth: 0}}>{name}</code>
        <div style={{display: 'flex', alignItems: 'center', height: 'var(--ds-space-3)', minWidth: 0}}>
          {preview === 'opacity' ? (
            <div style={{
              width: 'var(--ds-space-12)',
              maxWidth: '100%',
              height: 'var(--ds-border-width-heavy)',
              background: 'var(--ds-color-action-primary-bg)',
              borderRadius: 'var(--ds-radius-full)',
              opacity: value,
            }}/>
          ) : (
            <div style={{
              height: 'var(--ds-border-width-heavy)',
              width: value,
              maxWidth: '100%',
              background: 'var(--ds-color-action-primary-bg)',
              borderRadius: 'var(--ds-radius-full)'
            }}/>
          )}
        </div>
        <code style={{
          fontSize: 'var(--ds-font-size-xs)',
          color: 'var(--ds-color-text-muted)',
          alignSelf: 'center',
          textAlign: 'right',
          whiteSpace: 'nowrap'
        }}>{resolved || value}</code>
      </GridLayout>
    </Card>
  );
};

const TypeRow = ({name, sample}: { name: string; sample: React.ReactNode }) => {
  const resolved =
    typeof document !== 'undefined' && name.startsWith('--')
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : '';

  return (
    <Card elevation="flat" padding="sm">
      <GridLayout size="sm">
        <code style={{fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)', alignSelf: 'center', minWidth: 0}}>{name}</code>
        {sample}
        <code style={{
          fontSize: 'var(--ds-font-size-xs)',
          color: 'var(--ds-color-text-muted)',
          alignSelf: 'center',
          textAlign: 'right',
          minWidth: 0
        }}>{resolved}</code>
      </GridLayout>
    </Card>
  );
};

const COLOR_PRIMITIVES: Array<[string, string[]]> = [
  ['Midnight', ['200', '400', '500', '700', '800', '900']],
  ['Champagne', ['0', '50']],
  ['Aurora', ['cyan', 'violet', 'magenta']],
  ['Danger', ['300', '700']],
  ['Success', ['300', '700']],
];

const COLOR_SEMANTIC_GROUPS: Array<[string, string[]]> = [
  ['Backgrounds', [
    '--ds-color-bg-page',
    '--ds-color-bg-surface',
    '--ds-color-bg-surface-sunk',
    '--ds-color-bg-surface-raised',
    '--ds-color-bg-overlay',
  ]],
  ['Text', [
    '--ds-color-text-primary',
    '--ds-color-text-secondary',
    '--ds-color-text-muted',
    '--ds-color-text-accent',
    '--ds-color-text-danger',
    '--ds-color-text-success',
  ]],
  ['Borders', [
    '--ds-color-border-subtle',
    '--ds-color-border-default',
    '--ds-color-border-strong',
    '--ds-color-border-focus',
  ]],
  ['Action · primary', [
    '--ds-color-action-primary-bg',
    '--ds-color-action-primary-bg-hover',
    '--ds-color-action-primary-bg-pressed',
    '--ds-color-action-primary-fg',
  ]],
  ['Action · secondary', [
    '--ds-color-action-secondary-bg',
    '--ds-color-action-secondary-bg-hover',
    '--ds-color-action-secondary-bg-pressed',
    '--ds-color-action-secondary-fg',
    '--ds-color-action-secondary-border',
  ]],
  ['Action · danger', [
    '--ds-color-action-danger-bg',
    '--ds-color-action-danger-bg-hover',
    '--ds-color-action-danger-bg-pressed',
    '--ds-color-action-danger-fg',
  ]],
];

const SPACE_SCALE = ['025', '05', '075', '1', '2', '3', '4', '5', '6', '8', '12'];
const RADIUS_SCALE = ['sm', 'md', 'lg', 'xl', '2xl', 'full'];
const FONT_SIZES = ['xs', 'sm', 'base', 'md', 'lg', 'xl'];
const FONT_WEIGHTS = ['regular', 'semibold'];
const FONT_FAMILIES: Array<[string, string]> = [
  ['sans', 'Atkinson Hyperlegible'],
  ['display', 'Bricolage Grotesque'],
  ['mono', 'JetBrains Mono'],
];
const SHADOWS = ['sm', 'md', 'lg'];
const MOTION_DURATIONS = ['fast', 'medium', 'slow'];
const BORDER_WIDTHS = ['thin', 'thick', 'heavy'];
const OPACITY_VALUES = ['disabled'];
const SIZE_CONTROL = ['sm', 'md', 'lg'];

export const ColorPrimitives: Story = {
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Color · Primitives</h2>
      <p className="story-section-lead">
        Base palettes the semantic tokens reference. Avoid using these directly in components — reach for a semantic
        alias instead.
      </p>
      {COLOR_PRIMITIVES.map(([family, shades]) => (
        <div key={family} style={{marginTop: 'var(--ds-space-2)'}}>
          <h3 className="story-subheading">{family}</h3>
          <GridLayout size="sm">
            {shades.map((shade) => {
              const name = `--ds-primitive-color-${family.toLowerCase()}-${shade}`;

              return <Swatch key={shade} name={name} value={`var(${name})`}/>;
            })}
          </GridLayout>
        </div>
      ))}
    </div>
  ),
};

export const ColorSemantic: Story = {
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Color · Semantic</h2>
      <p className="story-section-lead">
        The right alias to reach for in component code. They re-target between light and dark themes. Grouped by purpose
        so you can scan to the row you need.
      </p>
      {COLOR_SEMANTIC_GROUPS.map(([group, names]) => (
        <div key={group} style={{marginTop: 'var(--ds-space-3)'}}>
          <h3 className="story-subheading">{group}</h3>
          <GridLayout size="sm">
            {names.map((name) => <Swatch key={name} name={name} value={`var(${name})`}/>)}
          </GridLayout>
        </div>
      ))}
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Spacing scale</h2>
      <p className="story-section-lead">4 px base. Every component padding, margin, and gap reaches into this scale.</p>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {SPACE_SCALE.map((step) => {
          const name = `--ds-space-${step}`;

          return <ScaleRow key={step} name={name} value={`var(${name})`}/>;
        })}
      </div>
    </div>
  ),
};

export const Radii: Story = {
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Border radius</h2>
      <div style={{display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap'}}>
        {RADIUS_SCALE.map((step) => {
          const name = `--ds-radius-${step}`;

          return (
            <div key={step}
                 style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
              <div
                style={{
                  width: 'var(--ds-space-8)',
                  height: 'var(--ds-space-8)',
                  background: 'var(--ds-color-action-primary-bg)',
                  borderRadius: `var(${name})`,
                }}
              />
              <code style={{fontSize: 'var(--ds-font-size-xs)'}}>{step}</code>
            </div>
          );
        })}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Typography</h2>
      <p className="story-section-lead">
        Atkinson Hyperlegible across the system. Sizes are rem-based so text scales with the user's browser font-size
        preference.
      </p>
      <div>
        <h3 className="story-subheading">Families</h3>
        <div className="story-scale-list">
          {FONT_FAMILIES.map(([key, label]) => (
            <TypeRow key={key} name={`--ds-font-family-${key}`} sample={
              <span style={{
                fontFamily: `var(--ds-font-family-${key}), ${key === 'mono' ? 'monospace' : 'sans-serif'}`,
                fontSize: 'var(--ds-font-size-md)'
              }}>
                The quick brown fox · {label}
              </span>
            }/>
          ))}
        </div>
      </div>
      <div>
        <h3 className="story-subheading">Sizes</h3>
        <div className="story-scale-list">
          {FONT_SIZES.map((size) => (
            <TypeRow key={size} name={`--ds-font-size-${size}`} sample={
              <span style={{fontSize: `var(--ds-font-size-${size})`}}>The quick brown fox</span>
            }/>
          ))}
        </div>
      </div>
      <div>
        <h3 className="story-subheading">Weights</h3>
        <div className="story-scale-list">
          {FONT_WEIGHTS.map((weight) => (
            <TypeRow key={weight} name={`--ds-font-weight-${weight}`} sample={
              <span style={{fontWeight: `var(--ds-font-weight-${weight})`, fontSize: 'var(--ds-font-size-md)'}}>The quick brown fox</span>
            }/>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Shadows</h2>
      <GridLayout size="sm">
        {SHADOWS.map((shadow) => (
          <div
            key={shadow}
            style={{
              minHeight: 'var(--ds-space-12)',
              background: 'var(--ds-color-bg-surface)',
              borderRadius: 'var(--ds-radius-md)',
              boxShadow: `var(--ds-shadow-${shadow})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--ds-font-family-mono), monospace',
              fontSize: 'var(--ds-font-size-xs)',
            }}
          >
            {shadow}
          </div>
        ))}
      </GridLayout>
    </div>
  ),
};

/**
 * Parse a CSS time token (`160ms`, `.16s`, `0.16s`) into milliseconds.
 * The production build minifies `ms` values into the shorter `s` form,
 * so reading a duration token with a bare `parseFloat` (which assumes
 * ms) yields a sub-millisecond value and the animation finishes before
 * it is ever visible.
 */
const cssDurationToMs = (raw: string, fallback: number): number => {
  const value = raw.trim();
  const parsed = parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  if (value.endsWith('ms')) return parsed;
  if (value.endsWith('s')) return parsed * 1000;
  return parsed;
};

/**
 * Motion demo: the Play button itself is the moving element. Click
 * runs the button along its track using the named duration or pattern.
 * The token name sits above the track so the button never has to share
 * row space with anything else. There is no `easing` kind: the design
 * system has no easing tokens; every animation is composed of linear
 * segments.
 */
const MotionDemo = ({
  kind,
  name,
  description,
}: {
  kind: 'duration' | 'pattern';
  name: string;
  description?: string;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const play = () => {
    const node = buttonRef.current;
    if (!node) return;
    const styles = getComputedStyle(document.documentElement);

    // Travel one length token, capped to the track so the button never crosses
    // the right edge on a narrow screen: min(token, track width − button width).
    // (A CSS `translateX(min(token, 100%))` can't do this — transform `%` is
    // relative to the moving element, not the track.)
    const rootFontPx = parseFloat(styles.fontSize) || 16;
    const trackRaw = styles.getPropertyValue('--ds-size-surface-sm').trim();
    const trackTokenPx = trackRaw.endsWith('rem') ? parseFloat(trackRaw) * rootFontPx : parseFloat(trackRaw);
    const maxTravel = Math.max(0, (node.parentElement?.clientWidth ?? 0) - node.offsetWidth);
    const travel = Math.min(trackTokenPx, maxTravel);

    let duration = 300;
    let keyframes: Keyframe[] = [
      {transform: 'translateX(0)'},
      {transform: `translateX(${travel}px)`},
      {transform: 'translateX(0)'},
    ];

    if (kind === 'duration') {
      duration = cssDurationToMs(styles.getPropertyValue(`--ds-motion-duration-${name}`), 300);
    } else if (kind === 'pattern' && name === 'bounce') {
      /* Numbers come from the production button bounce (translateY -6 /
         -2 at 15% / 65%); without this anchor they'd read as arbitrary. */
      duration = cssDurationToMs(styles.getPropertyValue('--ds-motion-duration-medium'), 260);
      const bounceOut = styles.getPropertyValue('--ds-motion-bounce-translate-out').trim();
      const bounceOut2 = styles.getPropertyValue('--ds-motion-bounce-translate-out-2').trim();
      keyframes = [
        {transform: 'translateY(0)', offset: 0},
        {transform: `translateY(-${bounceOut})`, offset: 0.15},
        {transform: 'translateY(0)', offset: 0.4},
        {transform: `translateY(-${bounceOut2})`, offset: 0.65},
        {transform: 'translateY(0)', offset: 1},
      ];
    }

    node.animate(keyframes, {
      duration: kind === 'pattern' ? duration : duration * 2,
      easing: 'linear',
      fill: 'forwards',
    });
  };

  return (
    <Card
      elevation="flat"
      padding="sm"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-05)',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--ds-space-2)'}}>
        <code style={{fontSize: 'var(--ds-font-size-sm)', fontWeight: 'var(--ds-font-weight-semibold)'}}>
          {kind === 'pattern' ? `pattern · ${name}` : `--ds-motion-${kind}-${name}`}
        </code>
        {description && (
          <span style={{fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)'}}>{description}</span>
        )}
      </div>
      <div
        style={{
          position: 'relative',
          minHeight: 'var(--ds-size-control-md)',
        }}
      >
        <Button variant="primary" size="sm" ref={buttonRef} onClick={play} style={{position: 'absolute', top: 0, left: 0}}>▸ Play</Button>
      </div>
    </Card>
  );
};

const MOTION_DURATION_DESC: Record<string, string> = {
  fast: 'Snappy press / slide (160ms)',
  medium: 'Standard bounce, ink-bar slide, connector flex (260ms)',
  slow: 'Loading spinner rotation period (640ms). Only ds-spin uses this.',
};

export const Motion: Story = {
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Motion</h2>
      <p className="story-section-lead">
        Click any Play button to run the button itself along its track using that exact token. The duration cards travel
        out and back so you can feel each timing value; the pattern card plays the real button-bounce keyframe used
        across the system (linear travel out, linear bounce-back toward start, linear settle, smaller bounce-back,
        settle). There is no easing in this design system: every animation is composed of linear segments.
      </p>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {MOTION_DURATIONS.map((duration) => (
          <MotionDemo key={duration} kind="duration" name={duration} description={MOTION_DURATION_DESC[duration]}/>
        ))}
        <MotionDemo
          kind="pattern"
          name="bounce"
          description="The shared bounce: linear travel, linear bounce-back toward start, linear settle, smaller bounce-back, settle."
        />
      </div>
    </div>
  ),
};

export const Utilities: Story = {
  name: 'Utilities · borders, opacity, sizes',
  render: () => (
    <div className="story-section">
      <h2 className="story-section-title">Utility scales · borders, opacity, sizes</h2>
      <p className="story-section-lead">
        The smaller utility scales: border thicknesses, opacity steps for muted/disabled states, and the named control
        sizes that Button / TextInput / Toggle / Radio share.
      </p>
      <h3 className="story-subheading">Border widths</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {BORDER_WIDTHS.map((width) => (
          <ScaleRow key={width} name={`--ds-border-width-${width}`} value={`var(--ds-border-width-${width})`}/>
        ))}
      </div>
      <h3 className="story-subheading">Opacity</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {OPACITY_VALUES.map((op) => (
          <ScaleRow key={op} name={`--ds-opacity-${op}`} value={`var(--ds-opacity-${op})`} preview="opacity"/>
        ))}
      </div>
      <h3 className="story-subheading">Control sizes</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {SIZE_CONTROL.map((size) => (
          <ScaleRow key={size} name={`--ds-size-control-${size}`} value={`var(--ds-size-control-${size})`}/>
        ))}
        <ScaleRow name="--ds-size-tap-target-min" value="var(--ds-size-tap-target-min)"/>
      </div>
    </div>
  ),
};
