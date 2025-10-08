import { $, component$, useStore } from '@builder.io/qwik';
import { formatHex } from 'culori';
import './index.css';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const shades = useStore([
    'light',
    'main',
    'dark',
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ]);
  const lightnesses = useStore([
    70, 60, 50, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  ]);
  const chromas = useStore([30, 30, 30, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
  const hues = useStore([150, 205]);

  const copy = $((hex: string) => {
    navigator.clipboard.writeText(hex);
  });

  const setMainChroma = $((e: Event, el: HTMLInputElement) => {
    for (let i = 0; i < 3; i++) {
      chromas[i] = el.valueAsNumber;
    }
  });

  const setNeutralChroma = $((e: Event, el: HTMLInputElement) => {
    for (let i = 3; i < chromas.length; i++) {
      chromas[i] = el.valueAsNumber;
    }
  });

  return (
    <main>
      <div class="fieldset" role="group">
        <label>
          <span>Main Chroma</span>
          <input type="number" value="30" onInput$={setMainChroma} />
        </label>
        <label>
          <span>Neutral Chroma</span>
          <input type="number" value="4" onInput$={setNeutralChroma} />
        </label>
      </div>
      <table>
        <tbody>
          <tr>
            <th>Shade</th>
            {shades.map((shade, i) => (
              <td key={i}>
                <input
                  type="text"
                  value={shade}
                  onInput$={(_, el) => (shades[i] = el.value)}
                />
              </td>
            ))}
          </tr>
          <tr>
            <th>Lightness</th>
            {lightnesses.map((lightness, i) => (
              <td key={i}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={lightness}
                  onInput$={(_, el) => (lightnesses[i] = el.valueAsNumber)}
                />
              </td>
            ))}
          </tr>
          <tr>
            <th>Chroma</th>
            {chromas.map((chroma, i) => (
              <td key={i}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={chroma}
                  onInput$={(_, el) => (chromas[i] = el.valueAsNumber)}
                />
              </td>
            ))}
          </tr>
          {hues.map((hue, i) => (
            <tr key={i} class="hue">
              <th>
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="1"
                  value={hue}
                  onInput$={(_, el) => (hues[i] = el.valueAsNumber)}
                />
              </th>
              {shades.map((_, j) => {
                const backgroundColor = `oklch(${lightnesses[j]}% ${
                  chromas[j] / 100
                } ${hue}deg)`;
                const contrast = lightnesses[j] > 60 ? 20 : 100;
                const color = `oklch(${contrast / 100} ${chromas[j]}% ${hue}deg)`;
                const hex = formatHex(backgroundColor);
                return (
                  <td key={i}>
                    <button onClick$={() => copy(hex)} style={{ backgroundColor, color }}>{hex}</button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
});


export const head: DocumentHead = {
  title: "Design System Builder",
  meta: [],
};
