import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginBottom: '2rem',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family-display), sans-serif',
  fontSize: 'var(--ds-font-size-xl)',
  fontWeight: 'var(--ds-font-weight-bold)',
  letterSpacing: 'var(--ds-font-letter-spacing-tight)',
  margin: 0,
};

const sectionLeadStyle: React.CSSProperties = {
  fontSize: 'var(--ds-font-size-sm)',
  color: 'var(--ds-color-text-secondary)',
  margin: 0,
  maxWidth: '60ch',
};

const swatchGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: '0.5rem',
};

const Swatch = ({name, value}: { name: string; value: string }) => {
  const isColor = /^(#|rgb|var|hsl)/i.test(value) || value.includes('color');
  const resolved =
    typeof document !== 'undefined' && name.startsWith('--')
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-05)',
        background: 'var(--ds-color-bg-surface)',
        border: 'var(--ds-border-width-thin) solid var(--ds-color-border-subtle)',
        borderRadius: 'var(--ds-radius-md)',
        padding: 'var(--ds-space-1)',
      }}
    >
      <div
        style={{
          height: '2.5rem',
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
        <div style={{fontWeight: 'var(--ds-font-weight-bold)', wordBreak: 'break-all'}}>{name}</div>
        <div style={{color: 'var(--ds-color-text-muted)'}}>{resolved || value}</div>
      </div>
    </div>
  );
};

const ScaleRow = ({name, value}: { name: string; value: string }) => {
  const resolved =
    typeof document !== 'undefined' && name.startsWith('--')
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : '';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '18rem 1fr 6rem',
        alignItems: 'center',
        gap: 'var(--ds-space-2)',
        padding: 'var(--ds-space-1) var(--ds-space-2)',
        borderRadius: 'var(--ds-radius-sm)',
        background: 'var(--ds-color-bg-surface)',
        border: 'var(--ds-border-width-thin) solid var(--ds-color-border-subtle)',
      }}
    >
      <code style={{fontSize: 'var(--ds-font-size-sm)'}}>{name}</code>
      <div style={{display: 'flex', alignItems: 'center', height: '1.5rem'}}>
        <div style={{
          height: 'var(--ds-border-width-heavy)',
          width: value,
          background: 'var(--ds-color-action-primary-bg)',
          borderRadius: 'var(--ds-radius-full)'
        }}/>
      </div>
      <code style={{
        fontSize: 'var(--ds-font-size-xs)',
        color: 'var(--ds-color-text-muted)',
        textAlign: 'right'
      }}>{resolved || value}</code>
    </div>
  );
};

const TypeRow = ({name, sample}: { name: string; sample: React.ReactNode }) => {
  const resolved =
    typeof document !== 'undefined' && name.startsWith('--')
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : '';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '18rem 1fr auto',
        alignItems: 'baseline',
        gap: 'var(--ds-space-2)',
        padding: 'var(--ds-space-05) 0',
        borderBottom: 'var(--ds-border-width-thin) solid var(--ds-color-border-subtle)',
      }}
    >
      <code style={{fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)'}}>{name}</code>
      {sample}
      <code style={{
        fontSize: 'var(--ds-font-size-xs)',
        color: 'var(--ds-color-text-muted)',
        textAlign: 'right'
      }}>{resolved}</code>
    </div>
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
const FONT_WEIGHTS = ['regular', 'medium', 'semibold', 'bold'];
const FONT_FAMILIES: Array<[string, string]> = [
  ['sans', 'Atkinson Hyperlegible'],
  ['display', 'Atkinson Hyperlegible (display weight)'],
  ['mono', 'JetBrains Mono'],
];
const SHADOWS = ['sm', 'md', 'lg'];
const MOTION_DURATIONS = ['fast', 'medium', 'slow'];
const BORDER_WIDTHS = ['thin', 'thick', 'heavy'];
const OPACITY_VALUES = ['disabled'];
const SIZE_CONTROL = ['sm', 'md', 'lg'];

export const ColorPrimitives: Story = {
  render: () => (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Color · Primitives</h2>
      <p style={sectionLeadStyle}>
        Base palettes the semantic tokens reference. Avoid using these directly in components — reach for a semantic
        alias instead.
      </p>
      {COLOR_PRIMITIVES.map(([family, shades]) => (
        <div key={family} style={{marginTop: 'var(--ds-space-2)'}}>
          <h3 style={{
            fontSize: 'var(--ds-font-size-md)',
            fontWeight: 'var(--ds-font-weight-semibold)',
            margin: '0 0 0.5rem'
          }}>{family}</h3>
          <div style={swatchGridStyle}>
            {shades.map((shade) => {
              const name = `--ds-primitive-color-${family.toLowerCase()}-${shade}`;

              return <Swatch key={shade} name={name} value={`var(${name})`}/>;
            })}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ColorSemantic: Story = {
  render: () => (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Color · Semantic</h2>
      <p style={sectionLeadStyle}>
        The right alias to reach for in component code. They re-target between light and dark themes. Grouped by purpose
        so you can scan to the row you need.
      </p>
      {COLOR_SEMANTIC_GROUPS.map(([group, names]) => (
        <div key={group} style={{marginTop: 'var(--ds-space-3)'}}>
          <h3 style={{
            fontSize: 'var(--ds-font-size-md)',
            fontWeight: 'var(--ds-font-weight-semibold)',
            margin: '0 0 0.5rem'
          }}>{group}</h3>
          <div style={swatchGridStyle}>
            {names.map((name) => <Swatch key={name} name={name} value={`var(${name})`}/>)}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Spacing scale</h2>
      <p style={sectionLeadStyle}>4 px base. Every component padding, margin, and gap reaches into this scale.</p>
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
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Border radius</h2>
      <div style={{display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap'}}>
        {RADIUS_SCALE.map((step) => {
          const name = `--ds-radius-${step}`;

          return (
            <div key={step}
                 style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
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
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Typography</h2>
      <p style={sectionLeadStyle}>
        Atkinson Hyperlegible across the system. Sizes are rem-based so text scales with the user's browser font-size
        preference.
      </p>
      <div>
        <h3 style={{
          fontSize: 'var(--ds-font-size-md)',
          fontWeight: 'var(--ds-font-weight-semibold)',
          margin: '1rem 0 0.5rem'
        }}>Families</h3>
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
      <div>
        <h3 style={{
          fontSize: 'var(--ds-font-size-md)',
          fontWeight: 'var(--ds-font-weight-semibold)',
          margin: '1.5rem 0 0.5rem'
        }}>Sizes</h3>
        {FONT_SIZES.map((size) => (
          <TypeRow key={size} name={`--ds-font-size-${size}`} sample={
            <span style={{fontSize: `var(--ds-font-size-${size})`}}>The quick brown fox</span>
          }/>
        ))}
      </div>
      <div>
        <h3 style={{
          fontSize: 'var(--ds-font-size-md)',
          fontWeight: 'var(--ds-font-weight-semibold)',
          margin: '1.5rem 0 0.5rem'
        }}>Weights</h3>
        {FONT_WEIGHTS.map((weight) => (
          <TypeRow key={weight} name={`--ds-font-weight-${weight}`} sample={
            <span style={{fontWeight: `var(--ds-font-weight-${weight})`, fontSize: 'var(--ds-font-size-md)'}}>The quick brown fox</span>
          }/>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Shadows</h2>
      <div style={{display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap', padding: 'var(--ds-space-2)'}}>
        {SHADOWS.map((shadow) => (
          <div
            key={shadow}
            style={{
              width: '8rem',
              height: '5rem',
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
      </div>
    </div>
  ),
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

    let duration = 300;
    let keyframes: Keyframe[] = [
      {transform: 'translateX(0)'},
      {transform: 'translateX(260px)'},
      {transform: 'translateX(0)'},
    ];

    if (kind === 'duration') {
      duration = parseFloat(styles.getPropertyValue(`--ds-motion-duration-${name}`)) || 300;
    } else if (kind === 'pattern' && name === 'bounce') {
      /* Numbers come from the production button bounce (translateY -6 /
         -2 at 15% / 65%); without this anchor they'd read as arbitrary. */
      duration = parseFloat(styles.getPropertyValue('--ds-motion-duration-medium')) || 260;
      keyframes = [
        {transform: 'translateY(0)', offset: 0},
        {transform: 'translateY(-6px)', offset: 0.15},
        {transform: 'translateY(0)', offset: 0.4},
        {transform: 'translateY(-2px)', offset: 0.65},
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-05)',
        padding: 'var(--ds-space-2)',
        borderRadius: 'var(--ds-radius-md)',
        background: 'var(--ds-color-bg-surface)',
        border: 'var(--ds-border-width-thin) solid var(--ds-color-border-subtle)',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--ds-space-2)'}}>
        <code style={{fontSize: 'var(--ds-font-size-sm)', fontWeight: 'var(--ds-font-weight-bold)'}}>
          {kind === 'pattern' ? `pattern · ${name}` : `--ds-motion-${kind}-${name}`}
        </code>
        {description && (
          <span style={{fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)'}}>{description}</span>
        )}
      </div>
      <div
        style={{
          position: 'relative',
          minHeight: '2.25rem',
          padding: '0',
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={play}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2rem',
            padding: '0 var(--ds-space-2)',
            background: 'var(--ds-color-action-primary-bg)',
            color: 'var(--ds-color-action-primary-fg)',
            border: 0,
            borderRadius: 'var(--ds-radius-md)',
            font: 'inherit',
            fontSize: 'var(--ds-font-size-sm)',
            fontWeight: 'var(--ds-font-weight-bold)',
            cursor: 'pointer',
          }}
        >
          ▸ Play
        </button>
      </div>
    </div>
  );
};

const MOTION_DURATION_DESC: Record<string, string> = {
  fast: 'Snappy press / slide (160ms)',
  medium: 'Standard bounce, ink-bar slide, connector flex (260ms)',
  slow: 'Loading spinner rotation period (640ms). Only ds-spin uses this.',
};

export const Motion: Story = {
  render: () => (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Motion</h2>
      <p style={sectionLeadStyle}>
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

const DemoCard = ({title, body}: { title: string; body: string }) => (
  <div
    style={{
      background: 'var(--ds-color-bg-surface)',
      border: 'var(--ds-border-width-thin) solid var(--ds-color-border-subtle)',
      borderRadius: 'var(--ds-radius-2xl)',
      padding: 'var(--ds-space-3)',
      boxShadow: 'var(--ds-shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-space-1)',
    }}
  >
    <h4 style={{
      margin: 0,
      fontFamily: 'var(--ds-font-family-display), sans-serif',
      fontSize: 'var(--ds-font-size-lg)'
    }}>{title}</h4>
    <p style={{margin: 0, fontSize: 'var(--ds-font-size-sm)', color: 'var(--ds-color-text-secondary)'}}>{body}</p>
  </div>
);

const LAYOUT_DEMO_CARDS = [
  {title: 'Daily summary', body: 'Yesterday you closed 14 tasks and merged 2 PRs. Streak: 12 days.'},
  {title: 'Reading queue', body: 'Three articles you saved this week. Estimated total: 22 minutes.'},
  {title: 'Inbox health', body: 'Inbox at 7 unread, all routed. Two items waiting on responses.'},
  {title: 'Calendar', body: '3 meetings today: standup, design crit, 1:1 with Pat at 4pm.'},
  {title: 'Open questions', body: '5 threads where you owe a reply. Oldest is 36 hours old.'},
  {title: 'Health check', body: 'All services nominal. Last incident: 11 days ago.'},
];

export const LayoutPatterns: Story = {
  name: 'Layout · responsive patterns',
  render: () => (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Layout · responsive card grid</h2>
      <p style={sectionLeadStyle}>
        Resize the Storybook canvas (or your browser) to see the columns reflow. The demo uses
        <code style={{margin: '0 0.25rem', fontFamily: 'var(--ds-font-family-mono), monospace'}}>display: grid</code>
        with
        <code style={{margin: '0 0.25rem', fontFamily: 'var(--ds-font-family-mono), monospace'}}>grid-template-columns:
          repeat(auto-fit, minmax(16rem, 1fr))</code>
        and a gap pulled from the token scale. Below ~640px you get one column; medium widths give two; wider canvases
        give three or more.
      </p>

      <h3 style={{
        fontSize: 'var(--ds-font-size-md)',
        fontWeight: 'var(--ds-font-weight-semibold)',
        margin: '1.5rem 0 0.5rem'
      }}>
        Default gap (--ds-space-3 = 1.5rem)
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
          gap: 'var(--ds-space-3)',
        }}
      >
        {LAYOUT_DEMO_CARDS.map((card) => <DemoCard key={card.title} {...card} />)}
      </div>

      <h3 style={{
        fontSize: 'var(--ds-font-size-md)',
        fontWeight: 'var(--ds-font-weight-semibold)',
        margin: '2rem 0 0.5rem'
      }}>
        Tighter gap (--ds-space-2 = 1rem)
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
          gap: 'var(--ds-space-2)',
        }}
      >
        {LAYOUT_DEMO_CARDS.slice(0, 4).map((card) => <DemoCard key={card.title} {...card} />)}
      </div>

      <h3 style={{
        fontSize: 'var(--ds-font-size-md)',
        fontWeight: 'var(--ds-font-weight-semibold)',
        margin: '2rem 0 0.5rem'
      }}>
        Generous gap (--ds-space-4 = 2rem) and larger cards (minmax(20rem, 1fr))
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
          gap: 'var(--ds-space-4)',
        }}
      >
        {LAYOUT_DEMO_CARDS.slice(0, 3).map((card) => <DemoCard key={card.title} {...card} />)}
      </div>

      <p style={{
        marginTop: 'var(--ds-space-3)',
        fontSize: 'var(--ds-font-size-sm)',
        color: 'var(--ds-color-text-secondary)'
      }}>
        Recipe in components: pick a comfortable minimum card width (16rem default, 20rem for content-heavy), pair with
        one of <code>--ds-space-2</code>, <code>--ds-space-3</code>, or <code>--ds-space-4</code> as the gap, let the
        browser fill in. No media queries needed for this pattern; column count is implicit from min-card-width vs.
        container width.
      </p>
    </div>
  ),
};

export const Utilities: Story = {
  name: 'Utilities · borders, opacity, sizes',
  render: () => (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Utility scales · borders, opacity, sizes</h2>
      <p style={sectionLeadStyle}>
        The smaller utility scales: border thicknesses, opacity steps for muted/disabled states, and the named control
        sizes that Button / TextInput / Toggle / Radio share.
      </p>
      <h3 style={{
        fontSize: 'var(--ds-font-size-md)',
        fontWeight: 'var(--ds-font-weight-semibold)',
        margin: '1rem 0 0.5rem'
      }}>Border widths</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {BORDER_WIDTHS.map((width) => (
          <ScaleRow key={width} name={`--ds-border-width-${width}`} value={`var(--ds-border-width-${width})`}/>
        ))}
      </div>
      <h3 style={{
        fontSize: 'var(--ds-font-size-md)',
        fontWeight: 'var(--ds-font-weight-semibold)',
        margin: '1.5rem 0 0.5rem'
      }}>Opacity</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {OPACITY_VALUES.map((op) => (
          <ScaleRow key={op} name={`--ds-opacity-${op}`} value={`var(--ds-opacity-${op})`}/>
        ))}
      </div>
      <h3 style={{
        fontSize: 'var(--ds-font-size-md)',
        fontWeight: 'var(--ds-font-weight-semibold)',
        margin: '1.5rem 0 0.5rem'
      }}>Control sizes</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-05)'}}>
        {SIZE_CONTROL.map((size) => (
          <ScaleRow key={size} name={`--ds-size-control-${size}`} value={`var(--ds-size-control-${size})`}/>
        ))}
        <ScaleRow name="--ds-size-tap-target-min" value="var(--ds-size-tap-target-min)"/>
      </div>
    </div>
  ),
};
