"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { parseLeadInput } from "@/lib/leads/schema";
import type { LeadInput } from "@/lib/leads/destination";

type Fields = { name: string; whatsapp: string; city: string; uf: string; category: string; tireDescription: string; website: string };
const initial: Fields = { name: "", whatsapp: "", city: "", uf: "", category: "", tireDescription: "", website: "" };

export function QuoteForm({ whatsappNumber }: { whatsappNumber?: string }) {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [confirmedLead, setConfirmedLead] = useState<LeadInput>();
  const [utms, setUtms] = useState({ utmSource: "SITE", utmMedium: "", utmCampaign: "" });
  const busy = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");

    const savedUtms = sessionStorage.getItem("utms");
    let currentUtms = savedUtms ? JSON.parse(savedUtms) : { utmSource: "SITE", utmMedium: "", utmCampaign: "" };

    if (source || medium || campaign) {
      currentUtms = {
        utmSource: source || "SITE",
        utmMedium: medium || "",
        utmCampaign: campaign || ""
      };
      sessionStorage.setItem("utms", JSON.stringify(currentUtms));
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUtms(currentUtms);
  }, []);

  function update(key: keyof Fields, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const parsed = parseLeadInput({ ...fields, ...utms });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      setState("error");
      setMessage("Revise os campos destacados antes de continuar.");
      return;
    }
    busy.current = true;
    setState("loading");
    setMessage("Enviando sua solicitação...");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.value, website: fields.website }),
      });
      const body = await response.json();
      if (response.ok && body.ok === true) {
        setConfirmedLead(parsed.value);
        setState("success");
        setMessage("Solicitação recebida! Nossa equipe entrará em contato com você.");
      } else {
        setState("error");
        setMessage("Não foi possível enviar sua solicitação agora. Tente novamente em instantes.");
      }
    } catch {
      setState("error");
      setMessage("Não foi possível enviar sua solicitação agora. Tente novamente em instantes.");
    } finally {
      busy.current = false;
    }
  }

  const whatsappText = confirmedLead
    ? `Olá! Gostaria de falar sobre uma cotação de pneus. Nome: ${confirmedLead.name}; Cidade/UF: ${confirmedLead.city} - ${confirmedLead.uf}; Categoria: ${confirmedLead.category}; Pneu: ${confirmedLead.tireDescription}.`
    : "";

  return (
    <section id="cotacao" className="quote" aria-labelledby="quote-title">
      <div className="quote__inner">
        <div>
          <p className="quote__eyebrow">COTAÇÃO DE PNEUS</p>
          <h2 id="quote-title">O pneu certo<br />começa aqui<span className="quote__period">.</span></h2>
          <p className="quote__intro">Conte o que você procura. Com as informações certas, nossa equipe poderá encontrar a opção ideal para o seu caminho.</p>
          <div className="quote__rule" aria-hidden="true" />
          
          <div className="quote__advantages">
            <div className="quote__advantage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>ATENDIMENTO<br/>ESPECIALIZADO</span>
            </div>
            <div className="quote__advantage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <span>AS MELHORES<br/>MARCAS</span>
            </div>
            <div className="quote__advantage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-4v-4h6v2z"/><path d="M3 19a2 2 0 0 0 2 2h4v-4H3v2z"/><path d="M12 12v6"/></svg>
              <span>PARA TODO<br/>O BRASIL</span>
            </div>
          </div>
        </div>
        <form className="quote__form" onSubmit={submit} noValidate>
          <div className="quote__field">
            <label htmlFor="lead-name">Nome</label>
            <input id="lead-name" name="name" autoComplete="name" required maxLength={100} value={fields.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "lead-name-error" : undefined} />
            {errors.name && <p id="lead-name-error" className="quote__error">{errors.name}</p>}
          </div>
          <div className="quote__field">
            <label htmlFor="lead-whatsapp">WhatsApp</label>
            <input id="lead-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required value={fields.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "lead-whatsapp-error" : undefined} />
            {errors.whatsapp && <p id="lead-whatsapp-error" className="quote__error">{errors.whatsapp}</p>}
          </div>
          
          <div className="quote__row">
            <div className="quote__field quote__field--city">
              <label htmlFor="lead-city">Cidade</label>
              <input id="lead-city" name="city" autoComplete="address-level2" required maxLength={100} value={fields.city} onChange={(event) => update("city", event.target.value)} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "lead-city-error" : undefined} />
              {errors.city && <p id="lead-city-error" className="quote__error">{errors.city}</p>}
            </div>
            <div className="quote__field quote__field--uf">
              <label htmlFor="lead-uf">UF</label>
              <select id="lead-uf" name="uf" required value={fields.uf} onChange={(event) => update("uf", event.target.value)} aria-invalid={Boolean(errors.uf)} aria-describedby={errors.uf ? "lead-uf-error" : undefined}>
                <option value="">UF</option>
                <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option><option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
              </select>
              {errors.uf && <p id="lead-uf-error" className="quote__error">{errors.uf}</p>}
            </div>
          </div>
          
          <div className="quote__field">
            <label htmlFor="lead-category">Categoria do veículo</label>
            <select id="lead-category" name="category" required value={fields.category} onChange={(event) => update("category", event.target.value)} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "lead-category-error" : undefined}>
              <option value="">Selecione uma categoria</option>
              <option value="moto">Moto</option>
              <option value="carro">Carro</option>
              <option value="suv-picape">SUV / Picape</option>
              <option value="caminhao">Caminhão</option>
              <option value="agricola">Agrícola</option>
            </select>
            {errors.category && <p id="lead-category-error" className="quote__error">{errors.category}</p>}
          </div>
          <div className="quote__field">
            <label htmlFor="lead-tire">Medida ou descrição do pneu</label>
            <textarea id="lead-tire" name="tireDescription" required maxLength={300} placeholder="205/55 R16, 4 pneus" value={fields.tireDescription} onChange={(event) => update("tireDescription", event.target.value)} aria-invalid={Boolean(errors.tireDescription)} aria-describedby={errors.tireDescription ? "lead-tire-error" : undefined} />
            {errors.tireDescription && <p id="lead-tire-error" className="quote__error">{errors.tireDescription}</p>}
          </div>
          <div className="quote__honeypot" aria-hidden="true">
            <label htmlFor="lead-website">Website</label>
            <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => update("website", event.target.value)} />
          </div>
          <button className="quote__button" type="submit" disabled={state === "loading"}>
            {state === "loading" ? "ENVIANDO..." : "QUERO MINHA COTAÇÃO"}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <div className="quote__security-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Seus dados estão seguros e serão usados apenas para esta cotação.</span>
          </div>
          {message && <p className={`quote__status quote__status--${state}`} role="status" aria-live="polite">{message}</p>}
          {state === "success" && whatsappNumber && confirmedLead && <a className="quote__whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer">FALAR AGORA PELO WHATSAPP</a>}
        </form>
      </div>
    </section>
  );
}

