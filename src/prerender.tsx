// Build-time prerender entry.
//
// vite-prerender-plugin calls the exported `prerender` function during `vite build`
// and writes the resulting markup into dist/index.html. That gives crawlers, link
// previews and AI agents real content instead of an empty <div id="root">.
//
// Only the public marketing route ('/') is prerendered. Auth-gated routes are not.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

export async function prerender(data: { url: string }) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={data.url}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StaticRouter>
    </StrictMode>
  );

  return { html };
}
