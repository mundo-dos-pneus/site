"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerState, setHeaderState] = useState({ isTop: true, isHidden: false });

  useEffect(() => {
    let lastScroll = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          
          setHeaderState({
            isTop: currentScroll < 50,
            isHidden: currentScroll > 150 && currentScroll > lastScroll
          });
          
          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = `hero__header ${
    headerState.isTop ? "hero__header--top" : "hero__header--glass"
  } ${headerState.isHidden ? "hero__header--hidden" : ""} anim anim--1`;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__shade" aria-hidden="true" />
      
      {/* Top Nav (Smart Header) */}
      <header className={headerClass}>
        <div className="hero__header-inner">
          <div className="hero__logo-wrap">
            <Image
              src="/images/brand/logo-mundo-dos-pneus.png"
              alt="Mundo dos Pneus — Logotipo"
              width={100}
              height={57}
              className="hero__logo"
              priority
            />
          </div>
          <div className="hero__nav-desktop">
            <span>QUALIDADE</span>
            <span className="hero__nav-dot">•</span>
            <span>CONFIANÇA</span>
            <span className="hero__nav-dot">•</span>
            <span>EM TODO O BRASIL</span>
          </div>
          <button 
            className="hero__nav-mobile-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <nav className="hero__nav-mobile-menu">
            <a href="#" onClick={() => setMenuOpen(false)}>Início</a>
            <a href="#cotacao" onClick={() => setMenuOpen(false)}>Solicitar cotação</a>
          </nav>
        )}
      </header>

      <div className="hero__content">
        <div className="hero__copy">
          <p className="hero__eyebrow anim anim--2">PNEUS PARA TODOS OS CAMINHOS</p>
          <h1 id="hero-title" className="anim anim--2">PNEU PARA<br /><span className="hero__orange">TODO</span> MUNDO<span className="hero__period">.</span></h1>
          <p className="hero__support anim anim--3">Do asfalto ao campo,<br />o pneu certo para cada caminho.</p>
          
          <div className="hero__categories anim anim--4">
            <div className="hero__category">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="M5 18H3v-2l2-6h6l3 6h5v2h-2"/><path d="M14 12h-2v-4a2 2 0 0 0-2-2H7L5 10"/><circle cx="12" cy="7" r="1.5"/></svg>
              <span>MOTO</span>
            </div>
            <div className="hero__cat-divider" />
            <div className="hero__category">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              <span>CARRO</span>
            </div>
            <div className="hero__cat-divider" />
            <div className="hero__category">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a5.3 5.3 0 0 0-2.4-4.5l-2.6-1.55a2 2 0 0 0-1-.2H14v11h2"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
              <span>SUV/PICAPE</span>
            </div>
            <div className="hero__cat-divider" />
            <div className="hero__category">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><path d="M14 9h4"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
              <span>CAMINHÃO</span>
            </div>
            <div className="hero__cat-divider" />
            <div className="hero__category">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18V9l4-4h8l4 4v9"/><path d="M7 18h10"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>
              <span>AGRÍCOLA</span>
            </div>
          </div>
          
          <p className="hero__institutional anim anim--5">Estamos preparando um novo jeito de comprar pneus.{" "}<br />Enquanto nossa loja completa não chega,{" "}<br />nossa equipe já pode encontrar o pneu certo para você.</p>
          
          <div className="hero__actions anim anim--6">
            <a className="hero__cta" href="#cotacao">
              SOLICITAR COTAÇÃO
              <svg className="hero__cta-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a className="hero__scroll-hint" href="#cotacao">
              <span className="hero__scroll-icon">↓</span> ROLE PARA A COTAÇÃO
            </a>
          </div>
        </div>
        
        <div className="hero__decor anim anim--6">
          <div className="hero__decor-text">
            <span>MAIS</span>
            <strong>DISTÂNCIA</strong>
            <span>PARA OS SEUS<br/>PLANOS</span>
            <div className="hero__decor-line" />
          </div>
        </div>
      </div>
      
      <div className="hero__footer anim anim--6">
        <span>CIDADES</span><span className="hero__nav-dot">•</span>
        <span>ESTRADAS</span><span className="hero__nav-dot">•</span>
        <span>CAMPOS</span><span className="hero__nav-dot">•</span>
        <span>NEGÓCIOS</span><span className="hero__nav-dot">•</span>
        <span>PESSOAS</span>
      </div>

      <div className="hero__curve-mobile" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,120 L1440,120 L1440,80 C1100,0 340,0 0,80 Z" fill="var(--cream)" />
        </svg>
      </div>
    </section>
  );
}
