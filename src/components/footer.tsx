export function Footer({ 
  a2maxUrl, 
  instagramUrl, 
  facebookUrl, 
  youtubeUrl 
}: { 
  a2maxUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
}) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand-col">
          <div className="footer__brand">
            <p className="footer__name">MUNDO DOS PNEUS</p>
            <p className="footer__tagline">Pneu para todo mundo.</p>
          </div>
          <p className="footer__copy">© 2026 Mundo dos Pneus. Todos os direitos reservados.</p>
        </div>
        <div className="footer__meta">
          {(instagramUrl || facebookUrl || youtubeUrl) && (
            <div className="footer__socials">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              )}
            </div>
          )}
          <div className="footer__badge">
            {a2maxUrl
              ? <a href={a2maxUrl} target="_blank" rel="noopener noreferrer" className="footer__badge-link">Powered by <strong>A2Max</strong></a>
              : <span className="footer__badge-link">Powered by <strong>A2Max</strong></span>}
            <small>Estratégia • Tecnologia • Inteligência</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
