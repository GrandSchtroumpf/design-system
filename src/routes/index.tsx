import { $, component$, useStore } from '@builder.io/qwik';
import { formatHex } from 'culori';
import { DocumentHead } from '@builder.io/qwik-city';
import './index.css';

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
  const chromas = useStore([15, 15, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
  const hues = useStore<Record<string, number>>({
    primary: 205,
    secondary: 160
  });

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

  const save = $(() => {
    for (let i = 0; i < shades.length; i++) {
      const shade = shades[i];
      const lightness = lightnesses[i];
      const chroma = chromas[i];
      for (const [key, hue] of Object.entries(hues)) {
        const name = `--${key}-${shade}`;
        const value = `oklch(${lightness}% ${chroma / 100} ${hue} / var(--color-alpha, 100%))`
        console.log({ name, value });
        document.documentElement.style.setProperty(name, value);
      }
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
      <form onSubmit$={save} preventdefault:submit>
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
            {Object.entries(hues).map(([key, hue]) => (
              <tr key={key} class="hue">
                <th>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    step="1"
                    value={hue}
                    onInput$={(_, el) => (hues[key] = el.valueAsNumber)}
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
                    <td key={`${key}-${j}`}>
                      <button type="button" onClick$={() => copy(hex)} style={{ backgroundColor, color }}>{hex}</button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Save</button>
      </form>
      <section class="grid gap-16">
        <h2>Examples</h2>
        <div class="flex gap-16">
          <button class="btn-primary">Primary</button>
          <button class="btn-secondary">Secondary</button>
          <button class="btn-tertiary">Tertiary</button>
        </div>
        <div class="card"></div>
      </section>
    </main>
  );
});


export const head: DocumentHead = {
  title: "Design System Builder",
  meta: [],
};
