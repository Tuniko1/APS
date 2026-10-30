import { LEGAL_PRECEDENTS } from '../data/lawFirmData';

export function PrecedentsAndFirmSection() {
  return (
    <>
      {/* O Escritório — Editorial Manifesto */}
      <section
        id="escritorio"
        aria-labelledby="escritorio-heading"
        className="bg-black py-20 sm:py-28 border-b border-[#2C2314]"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs text-[#D4AF37] tracking-wide">APS · O Escritório</p>
            <h2
              id="escritorio-heading"
              className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#F5EFE6] text-balance"
            >
              Vigilância estratégica, lealdade absoluta e compromisso com a verdade.
            </h2>
            <p className="mt-4 text-sm text-[#8C7E65] leading-relaxed">
              Sob a titularidade do Dr. Adevandro Pereira da Silva (OAB/DF 86.083), a banca dedica-se
              à advocacia artesanal em causas de alta relevância jurídica e patrimonial.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-base text-[#BFB39C] leading-relaxed max-w-prose">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:text-[#F3D88B] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              Na APS, recusamos a padronização em escala. Nosso brasão — o lobo guardião envolto pelos
              louros da vitória jurídica — e o lema Verum Est traduzem os princípios que regem cada
              peça processual, parecer e sustentação oral: vigilância incansável na defesa do cliente
              e rigor técnico fundamentado na verdade dos fatos e do Direito.
            </p>
            <p>
              Com atuação estratégica a partir de Brasília — Distrito Federal, junto ao TJDFT,
              Tribunais Regionais Federais e Tribunais Superiores (STJ e STF), oferecemos
              representação firme, transparente e personalizada para pessoas físicas e empresas em
              todo o território nacional.
            </p>

            <blockquote className="py-6 border-t border-b border-[#2C2314] font-display text-xl sm:text-2xl text-[#F5EFE6]">
              “Verum Est — A verdadeira segurança jurídica nasce da antecipação rigorosa dos riscos e
              da firmeza inabalável na defesa das garantias constitucionais e patrimoniais.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* Precedentes & Casos — Institutional Proof */}
      <section
        id="precedentes"
        aria-labelledby="precedentes-heading"
        className="bg-[#090806] py-20 sm:py-28 border-b border-[#2C2314]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-xs text-[#D4AF37] tracking-wide">Atuação Representativa</p>
            <h2
              id="precedentes-heading"
              className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#F5EFE6] text-balance"
            >
              Resultados concretos em litígios estratégicos e consultoria preventiva.
            </h2>
            <p className="mt-3 text-sm text-[#BFB39C]">
              Sínteses apresentadas de forma estritamente anonimizada em observância ao sigilo
              profissional da Ordem dos Advogados do Brasil.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {LEGAL_PRECEDENTS.map((item, idx) => (
              <article
                key={item.id}
                className={`p-7 rounded-lg border border-[#2C2314] bg-[#110E09] flex flex-col justify-between ${
                  idx === 0 ? 'lg:border-[#D4AF37]/45' : ''
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7E65]">
                    <span>{item.sector}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.timeframe}</span>
                  </div>

                  <p className="mt-5 font-display text-2xl font-semibold text-[#F3D88B] tabular-nums">
                    {item.metric}
                  </p>

                  <h3 className="mt-2 font-display text-lg font-semibold text-[#F5EFE6] text-balance">
                    {item.matter}
                  </h3>

                  <p className="mt-3 text-sm text-[#BFB39C] leading-relaxed">
                    {item.outcome}
                  </p>
                </div>

                <p className="mt-6 pt-4 border-t border-[#2C2314] text-xs text-[#8C7E65]">
                  {item.attribution}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
