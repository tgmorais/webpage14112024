(() => {
  const DEFAULT_APP_CONFIG = {
    FORMSPREE_ENDPOINT: "https://formspree.io/f/your-form-id",
    GA4_MEASUREMENT_ID: "G-XXXXXXXXXX",
    CALENDLY_URL: "",
    CALENDLY_EVENT_NAME: "book_call_click"
  };
  const APP_CONFIG = {
    ...DEFAULT_APP_CONFIG,
    ...(window.VC_CONFIG || {})
  };

  const LANG_KEY = "vc_lang";
  const CONSENT_KEY = "vc_consent";
  const UTM_KEY = "vc_utm";
  const SUPPORTED_LANGS = ["pt", "en"];
  const PORTUGUESE_COUNTRY_CODES = new Set(["PT", "BR", "AO", "MZ"]);
  const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  let currentLang = "en";
  let currentDictionary = {};
  let currentConsent = null;
  let analyticsBooted = false;
  let calendlyLoaderPromise = null;

  const TRANSLATIONS = {
    pt: {
      common: {
        brandName: "VirtuaCrop",
        brandEyebrow: "Dados de satélite + IA",
        navHome: "Início",
        navHow: "Como funciona",
        navSolutions: "Soluções",
        navCases: "Casos",
        navProjects: "Projetos",
        navContact: "Contacto",
        navBookCallBtn: "Marcar chamada",
        navContactBtn: "Fale connosco",
        footerFundingLabel: "Cofinanciado por",
        footerTagline: "Produtos de dados EO + IA para decisões de agribusiness.",
        footerPrivacy: "Política de Privacidade",
        footerCookies: "Política de Cookies",
        footerManageCookies: "Gerir cookies",
        footerBackTop: "Voltar ao topo",
        footerRights: "© VirtuaCrop - 2026. Todos os direitos reservados.",
        cookieTitle: "Definições de cookies",
        cookieBody:
          "Usamos cookies essenciais para o funcionamento do site e cookies de analytics (opcionais) para melhorar a experiência.",
        cookieReject: "Rejeitar",
        cookiePreferences: "Preferências",
        cookieAccept: "Aceitar",
        cookieModalTitle: "Preferências de cookies",
        cookieModalBody: "Escolha que categorias quer autorizar. Os cookies essenciais estão sempre ativos.",
        cookieEssentialLabel: "Cookies essenciais",
        cookieEssentialBody: "Necessários para idioma, segurança e funções base do website.",
        cookieAnalyticsLabel: "Cookies de analytics",
        cookieAnalyticsBody: "Ajudam-nos a analisar o tráfego e a melhorar o desempenho do website.",
        cookieSave: "Guardar preferências",
        cookieClose: "Fechar",
        formConfigMissing: "Formulário indisponível: configure o endpoint Formspree no ficheiro config.js.",
        formSending: "A enviar mensagem...",
        formSuccess: "Mensagem enviada com sucesso. Obrigado!",
        formError: "Não foi possível enviar a mensagem. Tente novamente.",
        formNetworkError: "Falha de ligação. Verifique a ligação à internet e tente novamente."
      },
      home: {
        metaTitle: "VirtuaCrop | Dados de satélite + IA",
        metaDescription:
          "A VirtuaCrop gera dados para agribusiness com dados de satélite e IA: produtividade/biomassa, teor de proteína, SOC, propriedades do solo, séries NDVI e alertas meteorológicos automáticos com dias de antecedência.",
        heroEyebrow: "Geração de dados para agribusiness",
        heroTitle: "Dados de satélite + IA para gerar dados acionáveis para operações agro",
        heroDescription:
          "Transformamos dados de satélite e aéreos em produtos técnicos para equipas agro: produtividade/biomassa, teor de proteína, matéria orgânica do solo, propriedades do solo, séries NDVI e alertas meteorológicos automáticos com dias de antecedência.",
        heroPrimaryCta: "Diga-nos o que precisa",
        heroBookCallCta: "Marcar chamada",
        heroSecondaryCta: "Ver soluções",
        heroCtaNote: "Respondemos em até 24 horas.",
        kpiStripTitle: "Resultados validados",
        kpiMetric1Value: "120 mil+ ha",
        kpiMetric1Label: "Área analisada",
        kpiMetric2Value: "5k+ parcelas",
        kpiMetric2Label: "Parcelas monitorizadas",
        kpiMetric3Value: "<48h",
        kpiMetric3Label: "Tempo de entrega",
        heroFlowSvgTitle: "Fluxo de dados EO para IA e entregáveis",
        heroFlowSvgDesc: "Fontes de dados alimentam o motor de IA da VirtuaCrop e geram produtos técnicos.",
        heroFlowInput1: "Satélite",
        heroFlowInput2: "Meteorologia",
        heroFlowInput3: "Dados de campo",
        heroFlowCoreTag: "Processamento IA",
        heroFlowOutputKicker: "Entregável único",
        heroFlowOutputTitle: "Relatório técnico integrado",
        trustedEyebrow: "Confiam em nós",
        trustedTitle: "Organizações e parceiros com quem colaboramos.",
        trustedLead: "Entidades selecionadas associadas a projetos e colaborações.",
        whatWeDoEyebrow: "O que fazemos",
        whatWeDoTitle: "Parceiro líder em observação da Terra para o agronegócio.",
        whatWeDoLead:
          "Equipamos equipas de agronegócio com produtos de dados via satélite, análise com IA e resultados técnicos validados para aumentar produtividade, reduzir risco e apoiar decisões operacionais.",
        howEyebrow: "Como funciona",
        howTitle: "De múltiplas fontes EO para dados técnicos utilizáveis.",
        howLead: "Fluxo desenhado para transformar observação da Terra em datasets operacionais.",
        howStep1Title: "1. Fusão de dados",
        howStep1Body:
          "Integramos Sentinel-2, satélite de muito alta resolução, fotografia aérea e dados de drone (UAV).",
        howStep2Title: "2. Interpretação por IA",
        howStep2Body: "Aplicamos IA para estimar biomassa, proteína, SOC, propriedades do solo e dinâmica NDVI.",
        howStep3Title: "3. Entrega de dados",
        howStep3Body: "Entregamos mapas, séries temporais e tabelas para suportar decisões de agribusiness.",
        howVisualTitle: "Fusão operacional numa camada de controlo",
        howVisualCaption: "Harmonização de fontes, scoring de IA e validação técnica antes da entrega.",
        solutionsEyebrow: "Soluções",
        solutionsTitle: "Produtos de dados para operações agro em escala.",
        solutionsLead: "Produtos técnicos para monitorização e planeamento operacional.",
        solution1Title: "Produtividade/biomassa e proteína",
        solution1Body: "Estimamos produtividade, biomassa e qualidade para comparar parcelas e apoiar manejo.",
        solution1MapBtn: "Ver",
        solution1SeriesBtn: "Ver",
        solution2Title: "Estimação de propriedades do solo",
        solution2Body: "Geramos camadas de propriedades do solo para zonamento técnico e apoio agronómico.",
        solution2MapBtn: "Ver",
        solution3Title: "Séries temporais NDVI",
        solution3Body:
          "Construímos históricos NDVI para análise de desempenho, sazonalidade e deteção de mudanças, com imagens a 2,5 m de resolução espacial (baseado em super-resolução Sentinel-2).",
        solution3MapBtn: "Ver",
        solution4Title: "Alertas meteorológicos automáticos com dias de antecedência",
        solution4Body:
          "Geramos alertas meteorológicos automáticos com vários dias de antecedência para apoiar o planeamento operacional e reduzir risco.",
        solution4Btn: "Ver",
        productivityModalTitle: "Produtividade estimada",
        productivityTabMap: "Mapa",
        productivityTabSeries: "Série temporal",
        ndviCompareModalTitle: "Comparação NDVI: 10 m vs 2,5 m",
        ndviCompareLeftLabel: "NDVI 10 m",
        ndviCompareRightLabel: "NDVI-SR 2,5 m",
        ndviCompareMinLabel: "Min",
        ndviCompareMaxLabel: "Max",
        ndviCompareApply: "Aplicar",
        weatherAlertsModalTitle: "Pré-visualização de alertas meteorológicos",
        weatherAlertsModalLead: "Exemplos fictícios de como alertas meteorológicos automáticos podem ser apresentados.",
        weatherAlertSeverityHigh: "Elevado",
        weatherAlertSeverityMedium: "Moderado",
        weatherAlertSeverityLow: "Baixo",
        weatherAlert1When: "14 abr 2026 • 06:00 UTC",
        weatherAlert1Title: "Chuva intensa prevista (48 mm / 24h)",
        weatherAlert1Body:
          "Parcela DHL-03: risco elevado de escorrência. Considere adiar fertilização e limitar tráfego de máquinas.",
        weatherAlert2When: "16 abr 2026 • 12:00 UTC",
        weatherAlert2Title: "Janela de vento forte (rajadas até 62 km/h)",
        weatherAlert2Body:
          "Parcelas CRR-Norte: evite pulverização no período de pico de rajada entre as 12:00 e as 18:00.",
        weatherAlert3When: "18 abr 2026 • 05:30 UTC",
        weatherAlert3Title: "Probabilidade de geada ligeira (15%)",
        weatherAlert3Body:
          "Bloco sul: monitorize culturas sensíveis e mantenha recursos de mitigação de geada em prontidão.",
        casesEyebrow: "Casos de uso",
        casesTitle: "Dados gerados para cenários reais de agribusiness.",
        casesLead: "Exemplos de uso direto dos produtos EO + IA da VirtuaCrop.",
        case1Title: "Gestão de produtividade por parcela",
        case1Body: "Use biomassa e teor de proteína para comparar parcelas e suportar decisões de manejo.",
        case2Title: "Caracterização de solo em escala",
        case2Body: "Use mapas de propriedades do solo para identificar variabilidade espacial e planear intervenções.",
        case3Title: "Histórico NDVI para desempenho",
        case3Body: "Acompanhe séries NDVI no tempo para avaliar dinâmica de vegetação e suportar relatórios técnicos.",
        casesVisualTitle: "Dados prontos para equipas técnicas e de negócio",
        casesVisualCaption: "Mapas, séries temporais e insights por parcela preparados para decisão.",
        contactEyebrow: "Contacto",
        contactTitle: "Precisa de suporte ou quer discutir o seu contexto?",
        contactLead: "Envie uma mensagem e a equipa VirtuaCrop responde assim que possível.",
        bookingEyebrow: "Marcar chamada",
        bookingTitle: "Prefere falar já?",
        bookingLead: "Escolha um horário disponível e reunimos diretamente.",
        bookingPrimaryCta: "Marcar chamada",
        bookingSecondaryCta: "Enviar mensagem em vez disso",
        bookingStatusReady: "Abra o agendamento para escolher a melhor hora para a sua equipa.",
        bookingStatusLoading: "A abrir calendário...",
        bookingStatusOpened: "Calendário aberto. Escolha o horário mais conveniente.",
        bookingStatusFallback: "Abrimos o agendamento num novo separador.",
        bookingStatusUnavailable: "Agendamento indisponível neste momento. Use o formulário de contacto.",
        bookingStatusError: "Não foi possível abrir o calendário. Tente novamente em alguns segundos.",
        formNameLabel: "Nome",
        formNamePlaceholder: "O seu nome",
        formEmailLabel: "Email",
        formEmailPlaceholder: "nome@empresa.com",
        formCompanyLabel: "Empresa",
        formCompanyPlaceholder: "Nome da empresa",
        formMessageLabel: "Mensagem",
        formMessagePlaceholder: "Descreva o seu desafio ou pedido de suporte",
        formPrivacyConsent:
          "Concordo com a <a data-lang-href=\"privacy.html\" href=\"privacy.html\">Política de Privacidade</a> e autorizo o tratamento deste pedido.",
        formSubmit: "Enviar mensagem"
      },
      privacy: {
        metaTitle: "Política de Privacidade | VirtuaCrop",
        metaDescription: "Política de privacidade da VirtuaCrop para processamento de dados de contacto e navegação.",
        privacyEyebrow: "Legal",
        privacyTitle: "Política de Privacidade",
        privacyLead: "Versão mínima inicial. Atualize com revisão jurídica antes de escalar campanhas."
      },
      cookies: {
        metaTitle: "Política de Cookies | VirtuaCrop",
        metaDescription: "Política de cookies da VirtuaCrop com preferências de consentimento para analytics.",
        cookiesEyebrow: "Legal",
        cookiesTitle: "Política de Cookies",
        cookiesLead: "Definição de cookies essenciais e analytics utilizados neste website."
      },
      projects: {
        metaTitle: "Projetos | VirtuaCrop",
        metaDescription: "Projetos de I&D e iniciativas cofinanciadas em que a VirtuaCrop participa.",
        projectsEyebrow: "Projetos",
        projectsTitle: "Projetos cofinanciados e de I&D em curso.",
        projectsLead: "Esta página centraliza os projetos da VirtuaCrop.",
        project1Status: "Projeto em execução",
        project1Title: "AVALON - Avaliar, Optimizar e Remunerar para a Sustentabilidade em Sistemas de Ruminantes",
        project1Summary1:
          "O AVALON desenvolve soluções para avaliação de sustentabilidade, otimização técnico-económica-ambiental e remuneração por desempenho climático.",
        project1Summary2:
          "O foco está na produção de ruminantes em pastoreio em condições mediterrânicas, com integração entre atividades agrícolas e florestais.",
        projectLabelProgram: "Programa",
        project1Program: "PORTUGAL 2030, Cofinanciado pela UE",
        projectLabelNumber: "Número do projeto",
        project1Number: "COMPETE2030-FEDER-02288900",
        projectLabelPeriod: "Período",
        project1Period: "01/07/2025 - 30/06/2028",
        projectLabelFunding: "Financiamento",
        project1Funding: "Custo total: 1 789 789,33 EUR | Incentivo não reembolsável: 1 297 809,12 EUR",
        project1ConsortiumTitle: "Co-promotores e parceiros principais",
        project1Partner1: "Terraprima - Serviços Ambientais (líder)",
        project1Partner2: "VirtuaCrop",
        project1Partner3: "Instituto Superior Técnico (IST-ID)",
        project1Partner4: "Faculdade de Medicina Veterinária (FMV)",
        project1SourceLink: "Ver página oficial do projeto"
      }
    },
    en: {
      common: {
        brandName: "VirtuaCrop",
        brandEyebrow: "Earth Observation + AI",
        navHome: "Home",
        navHow: "How it works",
        navSolutions: "Solutions",
        navCases: "Use cases",
        navProjects: "Projects",
        navContact: "Contact",
        navBookCallBtn: "Book a call",
        navContactBtn: "Talk to us",
        footerFundingLabel: "Co-financed by",
        footerTagline: "EO + AI data products designed for agribusiness decisions.",
        footerPrivacy: "Privacy Policy",
        footerCookies: "Cookie Policy",
        footerManageCookies: "Manage cookies",
        footerBackTop: "Back to top",
        footerRights: "© VirtuaCrop - 2026. All rights reserved.",
        cookieTitle: "Cookie settings",
        cookieBody:
          "We use essential cookies for website operation and optional analytics cookies to improve the experience.",
        cookieReject: "Reject",
        cookiePreferences: "Preferences",
        cookieAccept: "Accept",
        cookieModalTitle: "Cookie preferences",
        cookieModalBody: "Select which categories you allow. Essential cookies are always active.",
        cookieEssentialLabel: "Essential cookies",
        cookieEssentialBody: "Required for language settings, security, and core website functionality.",
        cookieAnalyticsLabel: "Analytics cookies",
        cookieAnalyticsBody: "Help us understand traffic and improve website performance.",
        cookieSave: "Save preferences",
        cookieClose: "Close",
        formConfigMissing: "Form unavailable: configure the Formspree endpoint in config.js.",
        formSending: "Sending message...",
        formSuccess: "Message sent successfully. Thank you!",
        formError: "Could not send your message. Please try again.",
        formNetworkError: "Network error. Check your connection and try again."
      },
      home: {
        metaTitle: "VirtuaCrop | Earth Observation + AI data products",
        metaDescription:
          "VirtuaCrop generates agribusiness data products using Earth Observation + AI: productivity/biomass, protein content, soil organic carbon, soil properties, NDVI time series, and automatic weather alerts days in advance.",
        heroEyebrow: "Data generation for agribusiness",
        heroTitle: "Earth Observation + AI to generate actionable data for agribusiness operations",
        heroDescription:
          "We transform satellite and aerial data into technical products: productivity/biomass, protein content, soil organic carbon, soil properties, NDVI time series, and automatic weather alerts days in advance.",
        heroPrimaryCta: "Tell us what you need",
        heroBookCallCta: "Book a call",
        heroSecondaryCta: "Explore solutions",
        heroCtaNote: "We'll get back to you within 24 hours.",
        kpiStripTitle: "Validated outcomes",
        kpiMetric1Value: "120k+ ha",
        kpiMetric1Label: "Area analyzed",
        kpiMetric2Value: "5k+ parcels",
        kpiMetric2Label: "Parcels monitored",
        kpiMetric3Value: "<48h",
        kpiMetric3Label: "Delivery turnaround",
        heroFlowSvgTitle: "EO to AI to deliverables data flow",
        heroFlowSvgDesc: "Data sources feed the VirtuaCrop AI engine to produce technical data products.",
        heroFlowInput1: "Satellite",
        heroFlowInput2: "Weather",
        heroFlowInput3: "Field data",
        heroFlowCoreTag: "AI processing",
        heroFlowOutputKicker: "Single deliverable",
        heroFlowOutputTitle: "Integrated technical report",
        trustedEyebrow: "Trusted by",
        trustedTitle: "Organizations and partners we collaborate with.",
        trustedLead: "Selected entities connected to projects and collaborations.",
        whatWeDoEyebrow: "What we do",
        whatWeDoTitle: "Leading Earth Observation partner for agribusiness operations.",
        whatWeDoLead:
          "We equip agribusiness teams with satellite-driven data products, AI-powered analysis, and validated technical outputs to increase yields, reduce risk, and support operational decisions.",
        howEyebrow: "How it works",
        howTitle: "From multi-source EO data to usable technical datasets.",
        howLead: "A workflow designed to convert Earth Observation into operational agribusiness data.",
        howStep1Title: "1. Data fusion",
        howStep1Body: "We integrate Sentinel-2, very high-resolution satellite data, aerial photography, and UAV (drone) data.",
        howStep2Title: "2. AI interpretation",
        howStep2Body: "We apply AI models to estimate biomass, protein content, SOC, soil properties, and NDVI dynamics.",
        howStep3Title: "3. Data delivery",
        howStep3Body: "We deliver maps, time series, and tabular outputs for operational and technical decisions.",
        howVisualTitle: "Operational fusion in one control layer",
        howVisualCaption: "Source harmonization, AI scoring, and quality checks stay connected before delivery.",
        solutionsEyebrow: "Solutions",
        solutionsTitle: "Data products for agribusiness operations at scale.",
        solutionsLead: "Technical outputs for monitoring and operational planning.",
        solution1Title: "Productivity/Biomass and protein",
        solution1Body: "Estimate productivity, biomass, and quality to compare parcels and support management decisions.",
        solution1MapBtn: "See",
        solution1SeriesBtn: "See",
        solution2Title: "Soil property estimation",
        solution2Body: "Generate soil property layers for technical zoning and agronomic strategy support.",
        solution2MapBtn: "See",
        solution3Title: "NDVI time series",
        solution3Body:
          "Build NDVI histories for performance analysis, seasonality tracking, and change detection, with 2.5 m spatial-resolution imagery (based on Sentinel-2 super-resolution).",
        solution3MapBtn: "See",
        solution4Title: "Automatic weather alerts days in advance",
        solution4Body:
          "Receive automated weather alerts several days in advance to plan operations and reduce weather risk.",
        solution4Btn: "See",
        productivityModalTitle: "Estimated productivity",
        productivityTabMap: "Map",
        productivityTabSeries: "Time series",
        ndviCompareModalTitle: "NDVI comparison: 10m vs 2.5m",
        ndviCompareLeftLabel: "NDVI 10m",
        ndviCompareRightLabel: "NDVI-SR 2.5m",
        ndviCompareMinLabel: "Min",
        ndviCompareMaxLabel: "Max",
        ndviCompareApply: "Apply",
        weatherAlertsModalTitle: "Weather alerts preview",
        weatherAlertsModalLead: "Fictitious examples of what automated weather warnings can look like.",
        weatherAlertSeverityHigh: "High",
        weatherAlertSeverityMedium: "Medium",
        weatherAlertSeverityLow: "Low",
        weatherAlert1When: "Apr 14, 2026 • 06:00 UTC",
        weatherAlert1Title: "Heavy rain expected (48 mm / 24h)",
        weatherAlert1Body:
          "Field DHL-03: high runoff risk. Consider postponing fertilization and limiting machinery traffic.",
        weatherAlert2When: "Apr 16, 2026 • 12:00 UTC",
        weatherAlert2Title: "Strong wind window (gusts up to 62 km/h)",
        weatherAlert2Body: "Parcels CRR-North: avoid spraying during peak gust period between 12:00 and 18:00.",
        weatherAlert3When: "Apr 18, 2026 • 05:30 UTC",
        weatherAlert3Title: "Light frost probability (15%)",
        weatherAlert3Body:
          "Southern block: monitor sensitive crops and keep frost mitigation resources on standby.",
        casesEyebrow: "Use cases",
        casesTitle: "Data outputs for real agribusiness workflows.",
        casesLead: "Examples of direct use of VirtuaCrop EO + AI data products.",
        case1Title: "Parcel-level productivity management",
        case1Body: "Use biomass and protein estimates to compare parcels and support field management decisions.",
        case2Title: "Large-scale soil characterization",
        case2Body: "Use soil property maps to identify spatial variability and prioritize technical actions.",
        case3Title: "Historical NDVI performance tracking",
        case3Body: "Track vegetation dynamics over time to support technical reporting and business planning.",
        casesVisualTitle: "Deployment-ready data outputs",
        casesVisualCaption: "Map layers, time series, and parcel insights prepared for business and technical teams.",
        contactEyebrow: "Contact",
        contactTitle: "Need support or want to discuss your scenario?",
        contactLead: "Send a message and the VirtuaCrop team will get back to you.",
        bookingEyebrow: "Book a call",
        bookingTitle: "Prefer to speak now?",
        bookingLead: "Pick an available slot and we will meet directly.",
        bookingPrimaryCta: "Book a call",
        bookingSecondaryCta: "Send a message instead",
        bookingStatusReady: "Open the scheduler to choose the best time for your team.",
        bookingStatusLoading: "Opening scheduler...",
        bookingStatusOpened: "Scheduler opened. Pick the best slot for your team.",
        bookingStatusFallback: "Scheduler opened in a new tab.",
        bookingStatusUnavailable: "Scheduling is unavailable right now. Please use the contact form.",
        bookingStatusError: "Could not open the scheduler. Please try again in a few seconds.",
        formNameLabel: "Name",
        formNamePlaceholder: "Your name",
        formEmailLabel: "Email",
        formEmailPlaceholder: "name@company.com",
        formCompanyLabel: "Company",
        formCompanyPlaceholder: "Company name",
        formMessageLabel: "Message",
        formMessagePlaceholder: "Describe your challenge or support request",
        formPrivacyConsent:
          "I agree with the <a data-lang-href=\"privacy.html\" href=\"privacy.html\">Privacy Policy</a> and allow VirtuaCrop to process this request.",
        formSubmit: "Send message"
      },
      privacy: {
        metaTitle: "Privacy Policy | VirtuaCrop",
        metaDescription: "VirtuaCrop privacy policy for contact and browsing data processing.",
        privacyEyebrow: "Legal",
        privacyTitle: "Privacy Policy",
        privacyLead: "Initial minimum version. Update with formal legal review before scaling campaigns."
      },
      cookies: {
        metaTitle: "Cookie Policy | VirtuaCrop",
        metaDescription: "VirtuaCrop cookie policy and consent preferences for analytics cookies.",
        cookiesEyebrow: "Legal",
        cookiesTitle: "Cookie Policy",
        cookiesLead: "Definition of essential and analytics cookies used on this website."
      },
      projects: {
        metaTitle: "Projects | VirtuaCrop",
        metaDescription: "R&D and co-financed projects where VirtuaCrop participates.",
        projectsEyebrow: "Projects",
        projectsTitle: "Co-financed and R&D projects in progress.",
        projectsLead: "This page centralizes VirtuaCrop projects.",
        project1Status: "Project in progress",
        project1Title: "AVALON - Evaluate, Optimise and Remunerate for Sustainability in Grazing Systems",
        project1Summary1:
          "AVALON develops solutions for sustainability assessment, technical-economic-environmental optimization, and remuneration for climate performance.",
        project1Summary2:
          "Its focus is ruminant production under Mediterranean grazing conditions, integrating agricultural and forestry activities.",
        projectLabelProgram: "Program",
        project1Program: "PORTUGAL 2030, Co-financed by the European Union",
        projectLabelNumber: "Project number",
        project1Number: "COMPETE2030-FEDER-02288900",
        projectLabelPeriod: "Period",
        project1Period: "01/07/2025 - 30/06/2028",
        projectLabelFunding: "Funding",
        project1Funding: "Total cost: EUR 1,789,789.33 | Non-repayable incentive: EUR 1,297,809.12",
        project1ConsortiumTitle: "Lead and key partners",
        project1Partner1: "Terraprima - Environmental Services (lead)",
        project1Partner2: "VirtuaCrop",
        project1Partner3: "Instituto Superior Tecnico (IST-ID)",
        project1Partner4: "Faculty of Veterinary Medicine (FMV)",
        project1SourceLink: "View official project page"
      }
    }
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const resolved = resolveLanguage();
    currentLang = resolved.lang;
    applyLanguage(currentLang, { persist: true, syncUrl: true });
    initLanguageSwitcher();
    initRevealAnimations();
    initHeroFlowAnimation();
    initProductivityExperience();
    initNdviComparisonExperience();
    initWeatherAlertsExperience();
    initCookieConsent();
    initContactForm();
    initCalendlyBooking();

    if (resolved.source === "browser") {
      applyGeoLanguageDefault();
    }
  }

  function getPageName() {
    return document.body?.dataset?.page || "home";
  }

  function getDictionary(lang) {
    const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";
    const common = TRANSLATIONS[safeLang].common || {};
    const page = TRANSLATIONS[safeLang][getPageName()] || {};
    return { ...common, ...page };
  }

  function applyLanguage(lang, options = {}) {
    const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";
    currentLang = safeLang;
    currentDictionary = getDictionary(safeLang);

    document.documentElement.lang = safeLang;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = currentDictionary[key];
      if (typeof value === "string") {
        node.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const key = node.getAttribute("data-i18n-html");
      const value = currentDictionary[key];
      if (typeof value === "string") {
        node.innerHTML = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      const value = currentDictionary[key];
      if (typeof value === "string") {
        node.setAttribute("placeholder", value);
      }
    });

    if (typeof currentDictionary.metaTitle === "string") {
      document.title = currentDictionary.metaTitle;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && typeof currentDictionary.metaDescription === "string") {
      metaDescription.setAttribute("content", currentDictionary.metaDescription);
    }

    updateLanguageButtons(safeLang);
    updateLanguageBlocks(safeLang);
    updateLangAwareLinks(safeLang);
    syncStatusMessageLanguage();

    const langInput = document.getElementById("form_lang");
    if (langInput) {
      langInput.value = safeLang;
    }

    if (options.persist !== false) {
      saveLanguagePreference(safeLang);
    }

    if (options.syncUrl !== false) {
      syncLanguageInUrl(safeLang);
    }
  }

  function resolveLanguage() {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get("lang");
    if (SUPPORTED_LANGS.includes(queryLang)) {
      return { lang: queryLang, source: "query" };
    }

    const local = getStorageItem(LANG_KEY);
    if (SUPPORTED_LANGS.includes(local)) {
      return { lang: local, source: "localStorage" };
    }

    const cookieLang = getCookie(LANG_KEY);
    if (SUPPORTED_LANGS.includes(cookieLang)) {
      return { lang: cookieLang, source: "cookie" };
    }

    return { lang: resolveBrowserLanguage(), source: "browser" };
  }

  function resolveBrowserLanguage() {
    const browserLang = (navigator.language || "en").toLowerCase();
    return browserLang.startsWith("pt") ? "pt" : "en";
  }

  function hasExplicitLanguagePreference() {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get("lang");
    if (SUPPORTED_LANGS.includes(queryLang)) {
      return true;
    }

    const local = getStorageItem(LANG_KEY);
    if (SUPPORTED_LANGS.includes(local)) {
      return true;
    }

    const cookieLang = getCookie(LANG_KEY);
    return SUPPORTED_LANGS.includes(cookieLang);
  }

  async function applyGeoLanguageDefault() {
    try {
      const countryCode = await detectCountryCode();
      if (!countryCode || hasExplicitLanguagePreference()) {
        return;
      }

      const geoLang = PORTUGUESE_COUNTRY_CODES.has(countryCode) ? "pt" : "en";
      if (geoLang === currentLang) {
        return;
      }

      applyLanguage(geoLang, { persist: true, syncUrl: true });
      populateTrackingFields();
    } catch (_error) {
      // Ignore geo lookup failures and keep browser-derived default.
    }
  }

  async function detectCountryCode() {
    const primaryResponse = await fetchWithTimeout("https://ipapi.co/json/", 1800);
    const primaryCode = (primaryResponse?.country_code || "").toUpperCase();
    if (primaryCode) {
      return primaryCode;
    }

    const fallbackResponse = await fetchWithTimeout("https://ipwho.is/", 1800);
    const fallbackCode = (fallbackResponse?.country_code || "").toUpperCase();
    return fallbackCode;
  }

  async function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (_error) {
      return null;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function initLanguageSwitcher() {
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextLang = button.getAttribute("data-lang-toggle");
        if (!SUPPORTED_LANGS.includes(nextLang)) {
          return;
        }
        applyLanguage(nextLang, { persist: true, syncUrl: true });
        populateTrackingFields();
      });
    });
  }

  function updateLanguageButtons(lang) {
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      const active = button.getAttribute("data-lang-toggle") === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function updateLanguageBlocks(lang) {
    document.querySelectorAll("[data-lang-block]").forEach((block) => {
      block.classList.toggle("hidden", block.getAttribute("data-lang-block") !== lang);
    });
  }

  function updateLangAwareLinks(lang) {
    document.querySelectorAll("[data-lang-href]").forEach((link) => {
      const rawHref = link.getAttribute("data-lang-href");
      if (!rawHref) {
        return;
      }
      link.setAttribute("href", buildLangHref(rawHref, lang));
    });
  }

  function buildLangHref(rawHref, lang) {
    if (rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
      return rawHref;
    }

    try {
      const url = new URL(rawHref, window.location.href);
      url.searchParams.set("lang", lang);

      if (url.origin === window.location.origin && url.protocol !== "file:") {
        return `${url.pathname}${url.search}${url.hash}`;
      }

      return url.toString();
    } catch (_error) {
      const joiner = rawHref.includes("?") ? "&" : "?";
      return `${rawHref}${joiner}lang=${encodeURIComponent(lang)}`;
    }
  }

  function syncLanguageInUrl(lang) {
    const url = new URL(window.location.href);
    if (url.protocol === "file:" || url.searchParams.get("lang") === lang) {
      return;
    }
    url.searchParams.set("lang", lang);

    try {
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    } catch (_error) {
      // Ignore URL sync failures (for strict browser contexts) without blocking app init.
    }
  }

  function saveLanguagePreference(lang) {
    setStorageItem(LANG_KEY, lang);
    setCookie(LANG_KEY, lang, 365);
  }

  function initCookieConsent() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) {
      return;
    }

    const modal = document.getElementById("cookie-modal");
    const analyticsToggle = document.getElementById("consent-analytics");

    currentConsent = loadConsent();
    if (!currentConsent) {
      currentConsent = {
        essential: true,
        analytics: false,
        updatedAt: new Date().toISOString()
      };
      banner.classList.remove("hidden");
    } else {
      applyConsent(currentConsent);
      banner.classList.add("hidden");
    }

    if (analyticsToggle) {
      analyticsToggle.checked = Boolean(currentConsent.analytics);
    }

    document.getElementById("cookie-accept")?.addEventListener("click", () => {
      persistConsent({ analytics: true });
      banner.classList.add("hidden");
      closeCookieModal();
    });

    document.getElementById("cookie-reject")?.addEventListener("click", () => {
      persistConsent({ analytics: false });
      banner.classList.add("hidden");
      closeCookieModal();
    });

    document.getElementById("cookie-preferences")?.addEventListener("click", () => {
      openCookieModal();
    });

    document.getElementById("manage-cookies")?.addEventListener("click", () => {
      openCookieModal();
    });

    document.getElementById("cookie-save")?.addEventListener("click", () => {
      const analytics = Boolean(analyticsToggle?.checked);
      persistConsent({ analytics });
      banner.classList.add("hidden");
      closeCookieModal();
    });

    document.getElementById("cookie-close")?.addEventListener("click", () => {
      closeCookieModal();
    });

    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeCookieModal();
      }
    });
  }

  function openCookieModal() {
    const modal = document.getElementById("cookie-modal");
    const analyticsToggle = document.getElementById("consent-analytics");

    if (!modal) {
      return;
    }

    if (analyticsToggle) {
      analyticsToggle.checked = Boolean(currentConsent?.analytics);
    }

    modal.classList.remove("hidden");
  }

  function closeCookieModal() {
    const modal = document.getElementById("cookie-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  function persistConsent(partial) {
    const payload = {
      essential: true,
      analytics: Boolean(partial.analytics),
      updatedAt: new Date().toISOString()
    };

    currentConsent = payload;
    const serialized = JSON.stringify(payload);
    setStorageItem(CONSENT_KEY, serialized);
    setCookie(CONSENT_KEY, serialized, 180);
    applyConsent(payload);
  }

  function loadConsent() {
    const localValue = getStorageItem(CONSENT_KEY);
    if (localValue) {
      const parsedLocal = safeParseJson(localValue);
      if (parsedLocal && typeof parsedLocal.analytics === "boolean") {
        return {
          essential: true,
          analytics: parsedLocal.analytics,
          updatedAt: parsedLocal.updatedAt || new Date().toISOString()
        };
      }
    }

    const cookieValue = getCookie(CONSENT_KEY);
    if (!cookieValue) {
      return null;
    }

    const parsedCookie = safeParseJson(cookieValue);
    if (!parsedCookie || typeof parsedCookie.analytics !== "boolean") {
      return null;
    }

    return {
      essential: true,
      analytics: parsedCookie.analytics,
      updatedAt: parsedCookie.updatedAt || new Date().toISOString()
    };
  }

  function applyConsent(consent) {
    if (consent.analytics) {
      enableAnalytics();
      return;
    }
    disableAnalytics();
  }

  function enableAnalytics() {
    if (!hasValidGaId()) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
      analytics_storage: "denied"
    });

    if (!analyticsBooted) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.GA4_MEASUREMENT_ID}`;
      script.dataset.ga4Loader = "true";
      document.head.appendChild(script);

      window.gtag("js", new Date());
      window.gtag("config", APP_CONFIG.GA4_MEASUREMENT_ID, {
        anonymize_ip: true,
        send_page_view: true
      });

      analyticsBooted = true;
    }

    window.gtag("consent", "update", {
      analytics_storage: "granted"
    });
  }

  function disableAnalytics() {
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied"
      });
    }
    clearAnalyticsCookies();
  }

  function hasValidGaId() {
    const id = APP_CONFIG.GA4_MEASUREMENT_ID || "";
    if (!id || id === "G-XXXXXXXXXX") {
      return false;
    }
    return /^G-[A-Z0-9]{6,}$/i.test(id);
  }

  function clearAnalyticsCookies() {
    const allCookies = document.cookie ? document.cookie.split(";") : [];
    const names = allCookies
      .map((entry) => entry.split("=")[0].trim())
      .filter((name) => name.startsWith("_ga") || name === "_gid" || name === "_gat");

    if (!names.length) {
      return;
    }

    const host = window.location.hostname;
    const hostParts = host.split(".");
    const domains = new Set([host, `.${host}`]);

    if (hostParts.length > 2) {
      domains.add(`.${hostParts.slice(-2).join(".")}`);
    }

    names.forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}; SameSite=Lax`;
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) {
      return;
    }

    populateTrackingFields();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!isFormspreeConfigured()) {
        setFormStatus("formConfigMissing", "error");
        return;
      }

      populateTrackingFields();

      const submitButton = document.getElementById("form-submit");
      if (submitButton) {
        submitButton.disabled = true;
      }

      setFormStatus("formSending", "info");

      const formData = new FormData(form);

      try {
        const response = await fetch(APP_CONFIG.FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: formData
        });

        if (!response.ok) {
          setFormStatus("formError", "error");
          return;
        }

        setFormStatus("formSuccess", "success");
        form.reset();
        populateTrackingFields();

        trackAnalyticsEvent("generate_lead", {
          event_category: "contact",
          event_label: "website_form"
        });
      } catch (_error) {
        setFormStatus("formNetworkError", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  function isFormspreeConfigured() {
    const endpoint = (APP_CONFIG.FORMSPREE_ENDPOINT || "").trim();
    if (!endpoint || endpoint === DEFAULT_APP_CONFIG.FORMSPREE_ENDPOINT) {
      return false;
    }
    return endpoint.includes("formspree.io/");
  }

  function populateTrackingFields() {
    const form = document.getElementById("contact-form");
    if (!form) {
      return;
    }

    const utm = getStoredUtm();
    UTM_FIELDS.forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      if (input) {
        input.value = utm[fieldName] || "";
      }
    });

    const referrer = document.getElementById("referrer");
    const pageUrl = document.getElementById("page_url");
    const pageTitle = document.getElementById("page_title");
    const formLang = document.getElementById("form_lang");

    if (referrer) {
      referrer.value = document.referrer || "direct";
    }
    if (pageUrl) {
      pageUrl.value = window.location.href;
    }
    if (pageTitle) {
      pageTitle.value = document.title;
    }
    if (formLang) {
      formLang.value = currentLang;
    }
  }

  function getStoredUtm() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = {};
    let hasQueryValue = false;

    UTM_FIELDS.forEach((key) => {
      const value = params.get(key);
      if (value) {
        fromQuery[key] = value;
        hasQueryValue = true;
      }
    });

    if (hasQueryValue) {
      setStorageItem(UTM_KEY, JSON.stringify(fromQuery));
      return fromQuery;
    }

    const stored = getStorageItem(UTM_KEY);
    if (!stored) {
      return {};
    }

    const parsed = safeParseJson(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  }

  function setFormStatus(messageKey, tone) {
    const node = document.getElementById("form-status");
    if (!node) {
      return;
    }

    const text = currentDictionary[messageKey] || TRANSLATIONS.en.common[messageKey] || "";
    node.textContent = text;
    node.dataset.statusKey = messageKey;
    node.className = `form-status ${tone}`;
  }

  function syncStatusMessageLanguage() {
    const formStatusNode = document.getElementById("form-status");
    const formKey = formStatusNode?.dataset?.statusKey;
    if (formStatusNode && formKey) {
      const translatedForm = currentDictionary[formKey] || TRANSLATIONS.en.common[formKey] || "";
      formStatusNode.textContent = translatedForm;
    }

    const calendlyStatusNode = document.getElementById("calendly-status");
    const calendlyKey = calendlyStatusNode?.dataset?.statusKey;
    if (calendlyStatusNode && calendlyKey) {
      const translatedCalendly = currentDictionary[calendlyKey] || TRANSLATIONS.en.home[calendlyKey] || "";
      calendlyStatusNode.textContent = translatedCalendly;
    }
  }

  function initCalendlyBooking() {
    const triggers = Array.from(document.querySelectorAll("[data-calendly-open]"));
    if (!triggers.length) {
      return;
    }

    const calendlyUrl = getCalendlyUrl();
    if (!calendlyUrl) {
      setCalendlyAvailability(triggers, false);
      setCalendlyStatus("bookingStatusUnavailable");
      return;
    }

    setCalendlyAvailability(triggers, true);
    setCalendlyStatus("bookingStatusReady");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", async (event) => {
        event.preventDefault();

        const source = trigger.getAttribute("data-calendly-source") || "website";
        const eventName = getCalendlyEventName();
        const popupUrl = buildCalendlyPopupUrl(calendlyUrl, source);

        trackAnalyticsEvent(eventName, {
          event_category: "engagement",
          event_label: `open_${source}`,
          source,
          language: currentLang,
          page_path: window.location.pathname
        });

        setCalendlyStatus("bookingStatusLoading");

        try {
          await ensureCalendlyAssets();
          if (!window.Calendly || typeof window.Calendly.initPopupWidget !== "function") {
            throw new Error("Calendly widget API not available");
          }

          window.Calendly.initPopupWidget({ url: popupUrl });
          setCalendlyStatus("bookingStatusOpened");
        } catch (_error) {
          window.open(popupUrl, "_blank", "noopener,noreferrer");
          setCalendlyStatus("bookingStatusFallback");
        }
      });
    });
  }

  function setCalendlyAvailability(triggers, isAvailable) {
    triggers.forEach((trigger) => {
      trigger.classList.toggle("is-disabled", !isAvailable);
      trigger.setAttribute("aria-disabled", isAvailable ? "false" : "true");

      if ("disabled" in trigger) {
        trigger.disabled = !isAvailable;
      }
    });
  }

  function setCalendlyStatus(messageKey) {
    const node = document.getElementById("calendly-status");
    if (!node) {
      return;
    }

    const text = currentDictionary[messageKey] || TRANSLATIONS.en.home[messageKey] || "";
    node.textContent = text;
    node.dataset.statusKey = messageKey;
  }

  function getCalendlyUrl() {
    const value = (APP_CONFIG.CALENDLY_URL || "").trim();
    if (!value) {
      return "";
    }

    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return "";
      }
      return parsed.toString();
    } catch (_error) {
      return "";
    }
  }

  function getCalendlyEventName() {
    const value = (APP_CONFIG.CALENDLY_EVENT_NAME || "").trim();
    return value || "book_call_click";
  }

  function ensureCalendlyAssets() {
    if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
      return Promise.resolve();
    }

    if (calendlyLoaderPromise) {
      return calendlyLoaderPromise;
    }

    if (!document.querySelector('link[data-calendly-loader="true"]')) {
      const styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = "https://assets.calendly.com/assets/external/widget.css";
      styleLink.dataset.calendlyLoader = "true";
      document.head.appendChild(styleLink);
    }

    calendlyLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-calendly-loader="true"]');
      if (existingScript) {
        if (existingScript.dataset.loaded === "true") {
          resolve();
          return;
        }
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Calendly script failed to load")), {
          once: true
        });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.dataset.calendlyLoader = "true";
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => reject(new Error("Calendly script failed to load"));
      document.head.appendChild(script);
    }).finally(() => {
      calendlyLoaderPromise = null;
    });

    return calendlyLoaderPromise;
  }

  function buildCalendlyPopupUrl(baseUrl, source) {
    const url = new URL(baseUrl);
    const utm = getStoredUtm();

    if (!url.searchParams.get("utm_source")) {
      url.searchParams.set("utm_source", utm.utm_source || "website");
    }
    if (utm.utm_medium && !url.searchParams.get("utm_medium")) {
      url.searchParams.set("utm_medium", utm.utm_medium);
    }
    if (utm.utm_campaign && !url.searchParams.get("utm_campaign")) {
      url.searchParams.set("utm_campaign", utm.utm_campaign);
    }
    if (utm.utm_term && !url.searchParams.get("utm_term")) {
      url.searchParams.set("utm_term", utm.utm_term);
    }
    if (utm.utm_content && !url.searchParams.get("utm_content")) {
      url.searchParams.set("utm_content", utm.utm_content);
    }
    if (!url.searchParams.get("vc_source")) {
      url.searchParams.set("vc_source", source);
    }
    if (!url.searchParams.get("lang")) {
      url.searchParams.set("lang", currentLang);
    }

    return url.toString();
  }

  function trackAnalyticsEvent(eventName, payload = {}) {
    if (!eventName || !window.gtag || !currentConsent?.analytics) {
      return;
    }

    window.gtag("event", eventName, payload);
  }

  function initRevealAnimations() {
    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    if (!revealItems.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.17,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function initHeroFlowAnimation() {
    const flowShell = document.querySelector("[data-hero-flow]");
    if (!flowShell) {
      return;
    }

    const activateFlow = () => {
      flowShell.classList.add("is-animated");
    };

    const prefersReducedMotion =
      Boolean(window.matchMedia) && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      activateFlow();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          activateFlow();
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.34,
        rootMargin: "0px 0px -6% 0px"
      }
    );

    observer.observe(flowShell);
  }

  function initProductivityExperience() {
    const modal = document.getElementById("productivity-modal");
    const openMapBtn = document.getElementById("open-biomass-map");
    const openSoilMapBtn = document.getElementById("open-soil-map");
    const closeBtn = document.getElementById("close-productivity-modal");
    const mapTab = document.getElementById("productivity-tab-map");
    const seriesTab = document.getElementById("productivity-tab-series");
    const mapPanel = document.getElementById("productivity-map-panel");
    const seriesPanel = document.getElementById("productivity-series-panel");

    if (!modal || !openMapBtn || !closeBtn || !mapTab || !seriesTab || !mapPanel || !seriesPanel) {
      return;
    }

    const biomassRows = [
      { farm: "DHL", date: "2025-03-14", year: 2025, biomass_pred: 1863.2395644766, std: 914.5948565590994, n: 86653 },
      { farm: "DHL", date: "2025-03-24", year: 2025, biomass_pred: 1364.6999794943063, std: 519.6707288537252, n: 86653 },
      { farm: "DHL", date: "2025-03-26", year: 2025, biomass_pred: 1366.9713079064609, std: 522.2027009197292, n: 86653 },
      { farm: "DHL", date: "2025-03-29", year: 2025, biomass_pred: 1355.693343276082, std: 514.5483359966108, n: 86653 },
      { farm: "DHL", date: "2025-03-31", year: 2025, biomass_pred: 1355.6223508341718, std: 514.4630945717382, n: 86653 },
      { farm: "DHL", date: "2025-04-23", year: 2025, biomass_pred: 2233.9381866819585, std: 390.87640051186975, n: 86653 },
      { farm: "DHL", date: "2025-04-25", year: 2025, biomass_pred: 2249.980730620847, std: 401.1027082765552, n: 86653 },
      { farm: "DHL", date: "2025-04-28", year: 2025, biomass_pred: 2483.2584368944454, std: 420.1393456359547, n: 86653 },
      { farm: "DHL", date: "2025-05-20", year: 2025, biomass_pred: 2043.84995641318, std: 334.2726969201973, n: 86653 },
      { farm: "DHL", date: "2025-05-23", year: 2025, biomass_pred: 1992.8943472612602, std: 312.1447118906012, n: 86653 },
      { farm: "DHL", date: "2025-05-25", year: 2025, biomass_pred: 2005.025610548925, std: 314.2450256708644, n: 86653 },
      { farm: "DHL", date: "2025-05-28", year: 2025, biomass_pred: 1798.3366744227537, std: 323.05122620840217, n: 86653 },
      { farm: "DHL", date: "2025-05-30", year: 2025, biomass_pred: 1712.839878516647, std: 313.2473175099858, n: 86653 }
    ];

    const state = {
      map: null,
      mapLayer: null,
      georaster: null,
      mapLoaded: false,
      loadedTifRelativePath: "",
      chart: null,
      chartLoaded: false,
      firstMapFitDone: false,
      stretchMin: 0,
      stretchMax: 3500,
      allowSeries: true,
      activeDataset: "biomass"
    };

    const DATASET_CONFIG = {
      biomass: {
        tifRelativePath: "assets/data/CRR_2022-04-21.tif",
        stretchMin: 0,
        stretchMax: 3500,
        legendTitle: currentLang === "pt" ? "<strong>Biomassa estimada</strong> (kg DM/ha)" : "<strong>Estimated biomass</strong> (kg DM/ha)"
      },
      soil: {
        tifRelativePath: "assets/data/DHL_2025-03-31_OM.tif",
        cacheKey: "20260410-om-v2",
        stretchMin: 0,
        stretchMax: 2,
        legendTitle: "<strong>SOC</strong> (%)",
        classes: [
          { min: 0.6, max: 0.8, color: "#3d1f0f", label: "0.6 - 0.8" },
          { min: 0.8, max: 1.2, color: "#8c4f24", label: "0.8 - 1.2" },
          { min: 1.2, max: 1.4, color: "#c4733d", label: "1.2 - 1.4" },
          { min: 1.4, max: Number.POSITIVE_INFINITY, color: "#f19155", label: "> 1.4" }
        ]
      }
    };

    const setMapStatus = (text) => {
      const statusEl = document.getElementById("biomass-map-status");
      if (statusEl) {
        statusEl.textContent = text;
      }
    };

    const setSeriesSummary = (text) => {
      const summaryEl = document.getElementById("biomass-series-summary");
      if (summaryEl) {
        summaryEl.textContent = text;
      }
    };

    const biomassClassColors = ["#a50026", "#f46d43", "#fee08b", "#a6d96a", "#1a9850"];

    const getClassBreaks = (min, max, classes = 5) => {
      const span = max - min;
      const step = span / classes;
      const breaks = [min];
      for (let i = 1; i <= classes; i += 1) {
        breaks.push(min + step * i);
      }
      return breaks;
    };

    const getActiveClasses = () => {
      const dataset = DATASET_CONFIG[state.activeDataset] || DATASET_CONFIG.biomass;
      if (Array.isArray(dataset.classes) && dataset.classes.length) {
        return dataset.classes;
      }

      const breaks = getClassBreaks(dataset.stretchMin, dataset.stretchMax, biomassClassColors.length);
      return biomassClassColors.map((color, idx) => {
        const from = Math.round(breaks[idx]);
        const to = Math.round(breaks[idx + 1]);
        return {
          min: breaks[idx],
          max: breaks[idx + 1],
          color,
          label: `${from} - ${to}`
        };
      });
    };

    const updateLegend = () => {
      const dataset = DATASET_CONFIG[state.activeDataset] || DATASET_CONFIG.biomass;
      const classes = getActiveClasses();
      const titleEl = document.getElementById("productivity-legend-title");
      if (titleEl) {
        titleEl.innerHTML = dataset.legendTitle;
      }

      const classesBar = document.querySelector(".productivity-legend-classes");
      if (classesBar) {
        classesBar.style.gridTemplateColumns = `repeat(${classes.length}, minmax(0, 1fr))`;
      }
      const ticksBar = document.querySelector(".productivity-legend-ticks");
      if (ticksBar) {
        ticksBar.style.gridTemplateColumns = `repeat(${classes.length}, minmax(0, 1fr))`;
      }

      for (let i = 0; i < 5; i += 1) {
        const classEl = document.querySelector(`.legend-class.class-${i + 1}`);
        const tickEl = document.getElementById(`legend-c${i + 1}`);
        const classInfo = classes[i];
        const hasClass = Boolean(classInfo);
        if (classEl) {
          classEl.classList.toggle("hidden", !hasClass);
          if (hasClass) {
            classEl.style.backgroundColor = classInfo.color;
          }
        }
        if (tickEl) {
          tickEl.classList.toggle("hidden", !hasClass);
          if (hasClass) {
            tickEl.textContent = classInfo.label;
          }
        }
      }
    };

    const toDate = (raw) => {
      if (!raw) {
        return null;
      }
      const value = String(raw).trim();
      if (value.includes("-")) {
        const parts = value.split("-").map((part) => Number(part));
        if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
          return null;
        }
        const [year, month, day] = parts;
        return new Date(Date.UTC(year, month - 1, day));
      }
      const parts = value.split("/").map((part) => Number(part));
      if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
        return null;
      }
      const [month, day, yearShort] = parts;
      const year = yearShort < 100 ? 2000 + yearShort : yearShort;
      return new Date(Date.UTC(year, month - 1, day));
    };

    const getRasterParser = () => {
      const w = window;
      if (typeof w.parseGeoraster === "function") return w.parseGeoraster;
      if (typeof w.parseGeoRaster === "function") return w.parseGeoRaster;
      if (typeof w.georaster === "function") return w.georaster;
      if (typeof w.georaster?.default === "function") return w.georaster.default;
      if (w.georaster?.default?.parse) return w.georaster.default.parse;
      if (w.georaster?.parse) return w.georaster.parse;
      return null;
    };

    const drawMapLayer = () => {
      if (!state.map || !state.georaster || typeof window.GeoRasterLayer !== "function") {
        return;
      }

      if (state.mapLayer) {
        state.map.removeLayer(state.mapLayer);
        state.mapLayer = null;
      }

      const noDataRaw = state.georaster.noDataValue;
      const noData = Number.isFinite(Number(noDataRaw)) ? Number(noDataRaw) : null;
      const classes = getActiveClasses();
      const classMin = classes.length ? classes[0].min : state.stretchMin;
      const classMax = classes.length ? classes[classes.length - 1].max : state.stretchMax;

      state.mapLayer = new window.GeoRasterLayer({
        georaster: state.georaster,
        pane: "rasterPane",
        pixelValuesToColorFn: (values) => {
          const value = values?.[0];
          if (!Number.isFinite(value)) return null;
          if (noData !== null && Math.abs(value - noData) < 1e-6) return null;
          const clipped = Math.max(classMin, Math.min(classMax, value));
          for (let i = 0; i < classes.length; i += 1) {
            if (clipped <= classes[i].max) {
              return classes[i].color;
            }
          }
          return classes.length ? classes[classes.length - 1].color : null;
        },
        resolution: 512,
        resampleMethod: "nearest",
        opacity: 0.9
      });

      state.mapLayer.addTo(state.map);

      if (!state.firstMapFitDone) {
        state.map.fitBounds(state.mapLayer.getBounds());
        state.firstMapFitDone = true;
      }

      updateLegend();
    };

    const ensureMap = async () => {
      const dataset = DATASET_CONFIG[state.activeDataset] || DATASET_CONFIG.biomass;
      state.stretchMin = dataset.stretchMin;
      state.stretchMax = dataset.stretchMax;
      const tifRelativePath = dataset.tifRelativePath;
      const tifRequestPath = dataset.cacheKey ? `${tifRelativePath}?v=${encodeURIComponent(dataset.cacheKey)}` : tifRelativePath;
      const datasetChanged = state.loadedTifRelativePath !== tifRequestPath;

      if (!window.L) {
        setMapStatus("Leaflet não está disponível.");
        return;
      }

      const parser = getRasterParser();
      if (!parser || typeof window.GeoRasterLayer !== "function") {
        setMapStatus("Bibliotecas de raster não disponíveis.");
        return;
      }

      if (!state.map) {
        state.map = window.L.map("biomass-map", {
          center: [39.362, -8.553],
          zoom: 12,
          zoomControl: false
        });
        window.L.control.zoom({ position: "bottomleft" }).addTo(state.map);
        state.map.createPane("rasterPane");
        state.map.getPane("rasterPane").style.zIndex = "450";
        state.map.getPane("rasterPane").style.pointerEvents = "none";

        const baseLayers = {
          "CARTO Light": window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
            subdomains: "abcd",
            maxZoom: 20
          }),
          OpenStreetMap: window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 20
          }),
          "Esri Imagery": window.L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "Tiles &copy; Esri",
              maxZoom: 20
            }
          )
        };

        baseLayers["CARTO Light"].addTo(state.map);
        window.L.control.layers(baseLayers, {}, { position: "topright", collapsed: true }).addTo(state.map);
        state.map.on("baselayerchange", () => {
          state.mapLayer?.bringToFront?.();
        });
      }

      if (state.mapLoaded && state.loadedTifRelativePath === tifRequestPath) {
        state.map?.invalidateSize();
        updateLegend();
        return;
      }

      if (datasetChanged) {
        // Different rasters can have different extents; force fit-to-bounds after load.
        state.firstMapFitDone = false;
      }

      setMapStatus("A carregar GeoTIFF...");

      try {
        const currentUrl = new URL(window.location.href);
        const resolvedUrl = new URL(tifRequestPath, currentUrl).toString();
        const baseDir = currentUrl.href.replace(/[^/]*$/, "");

        const candidates = Array.from(
          new Set([
            tifRequestPath,
            `./${tifRequestPath}`,
            resolvedUrl,
            `${baseDir}${tifRequestPath}`
          ])
        );

        const loadArrayBufferViaXhr = (url) =>
          new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = () => {
              if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                resolve(xhr.response);
                return;
              }
              reject(new Error(`XHR ${xhr.status} for ${url}`));
            };
            xhr.onerror = () => reject(new Error(`XHR network error for ${url}`));
            xhr.send();
          });

        const loadArrayBuffer = async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return await response.arrayBuffer();
          } catch (_fetchError) {
            return await loadArrayBufferViaXhr(url);
          }
        };

        let arrayBuffer = null;
        let loadedFrom = "";
        let lastError = null;
        for (const candidate of candidates) {
          try {
            arrayBuffer = await loadArrayBuffer(candidate);
            loadedFrom = candidate;
            break;
          } catch (error) {
            lastError = error;
          }
        }

        if (!arrayBuffer) {
          if (currentUrl.protocol === "file:") {
            throw new Error(
              "Falha ao ler ficheiro local via file://. Abra o site num servidor local (http://localhost)."
            );
          }
          throw lastError || new Error("Unable to load GeoTIFF from candidate paths.");
        }

        state.georaster = await parser(arrayBuffer);

        if (!state.georaster) {
          throw new Error("GeoTIFF parser returned no raster object.");
        }

        drawMapLayer();
        state.mapLoaded = true;
        state.loadedTifRelativePath = tifRequestPath;
        const projection = String(state.georaster.projection || "unknown");
        setMapStatus(`GeoTIFF carregado (CRS ${projection}) via ${loadedFrom}`);
      } catch (error) {
        setMapStatus(`Erro no carregamento do mapa: ${error?.message || "desconhecido"}`);
      }
    };

    const buildTimeSeries = () => {
      const grouped = new Map();
      const ensureEntry = (date) => {
        const key = date.toISOString().slice(0, 10);
        if (!grouped.has(key)) {
          grouped.set(key, { date, predValues: [], predStdValues: [], dmValues: [] });
        }
        return grouped.get(key);
      };

      biomassRows.forEach((row) => {
        const gridDate = toDate(row.grid_date || row.date);
        const fieldDate = toDate(row.date);
        const biomassPred = Number(row.biomass_pred);
        const predStd = Number(row.std);
        const dmObserved = Number(row.DM);

        if (gridDate && Number.isFinite(biomassPred)) {
          const entry = ensureEntry(gridDate);
          entry.predValues.push(biomassPred);
          if (Number.isFinite(predStd)) {
            entry.predStdValues.push(predStd);
          }
        }
        if (fieldDate && Number.isFinite(dmObserved)) {
          ensureEntry(fieldDate).dmValues.push(dmObserved);
        }
      });

      return Array.from(grouped.values())
        .sort((a, b) => a.date - b.date)
        .map((entry) => {
          const stats = (values) => {
            if (!values.length) {
              return { mean: null, std: null, n: 0 };
            }
            const mean = values.reduce((acc, value) => acc + value, 0) / values.length;
            const variance = values.reduce((acc, value) => acc + (value - mean) ** 2, 0) / values.length;
            return { mean, std: Math.sqrt(variance), n: values.length };
          };

          const pred = stats(entry.predValues);
          if (entry.predStdValues.length) {
            pred.std =
              entry.predStdValues.reduce((acc, value) => acc + value, 0) / entry.predStdValues.length;
          }
          const dm = stats(entry.dmValues);
          return { date: entry.date, pred, dm };
        });
    };

    const ensureChart = () => {
      if (state.chartLoaded) {
        state.chart?.resize();
        return;
      }

      if (typeof window.Chart !== "function") {
        setSeriesSummary("Chart.js não está disponível.");
        return;
      }

      const points = buildTimeSeries();
      if (!points.length) {
        setSeriesSummary("Sem dados para série temporal.");
        return;
      }

      const locale = currentLang === "pt" ? "pt-PT" : "en-GB";
      const formatter = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" });
      const labels = points.map((point) => formatter.format(point.date));
      const combinedMean = points.map((point) => (point.pred.mean != null ? point.pred.mean : point.dm.mean));
      const combinedUpper = points.map((point) => {
        if (point.pred.mean != null && point.pred.std != null) return point.pred.mean + point.pred.std;
        if (point.dm.mean != null && point.dm.std != null) return point.dm.mean + point.dm.std;
        return null;
      });
      const combinedLower = points.map((point) => {
        if (point.pred.mean != null && point.pred.std != null) return Math.max(0, point.pred.mean - point.pred.std);
        if (point.dm.mean != null && point.dm.std != null) return Math.max(0, point.dm.mean - point.dm.std);
        return null;
      });
      const predMean = points.map((point) => point.pred.mean);
      const dmMean = points.map((point) => point.dm.mean);
      const hasObservedDm = dmMean.some((value) => Number.isFinite(value));

      const canvas = document.getElementById("biomass-series-chart");
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      state.chart = new window.Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "CombinedUpper",
              data: combinedUpper,
              borderColor: "rgba(31, 119, 180, 0)",
              pointRadius: 0,
              borderWidth: 0
            },
            {
              label: "\u00b1 1 Desv. padr\u00e3o",
              data: combinedLower,
              borderColor: "rgba(31, 119, 180, 0)",
              backgroundColor: "rgba(31, 119, 180, 0.2)",
              pointRadius: 0,
              borderWidth: 0,
              fill: "-1"
            },
            {
              label: currentLang === "pt" ? "Produtividade" : "Productivity",
              data: combinedMean,
              borderColor: "rgba(31, 119, 180, 1)",
              backgroundColor: "rgba(31, 119, 180, 1)",
              pointRadius: 4,
              borderWidth: 3,
              tension: 0.25
            },
            {
              label: currentLang === "pt" ? "Biomassa estimada (grid_date)" : "Estimated biomass (grid_date)",
              data: predMean,
              borderColor: "rgba(31, 119, 180, 1)",
              backgroundColor: "rgba(31, 119, 180, 1)",
              pointRadius: 4,
              pointHoverRadius: 5,
              showLine: false
            },
            {
              label: currentLang === "pt" ? "DM observada (date)" : "Observed DM (date)",
              data: dmMean,
              borderColor: "rgba(214, 122, 44, 1)",
              backgroundColor: "rgba(214, 122, 44, 1)",
              pointRadius: 4,
              pointHoverRadius: 5,
              showLine: false,
              hidden: !hasObservedDm
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                filter: (item) => {
                  const hiddenLegendItems = new Set([
                    "CombinedUpper",
                    "Productivity",
                    "Produtividade",
                    "Observed DM (date)",
                    "DM observada (date)"
                  ]);
                  return !hiddenLegendItems.has(item.text);
                }
              }
            },
            tooltip: {
              filter: (context) => {
                const biomassLabel = currentLang === "pt" ? "Biomassa estimada (grid_date)" : "Estimated biomass (grid_date)";
                return context?.dataset?.label === biomassLabel;
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: currentLang === "pt" ? "Biomassa estimada (kg DM/ha)" : "Estimated biomass (kg DM/ha)"
              }
            },
            x: {
              title: {
                display: true,
                text: currentLang === "pt" ? "Data" : "Date"
              }
            }
          }
        }
      });

      const firstDate = formatter.format(points[0].date);
      const lastDate = formatter.format(points[points.length - 1].date);
      const rowCount = biomassRows.length;
      const message =
        currentLang === "pt"
          ? hasObservedDm
            ? `${rowCount} observações em ${points.length} data(s): ${firstDate} a ${lastDate} (biomassa estimada em grid_date e DM observada em date).`
            : `${rowCount} observações em ${points.length} data(s): ${firstDate} a ${lastDate} (série de produtividade estimada).`
          : hasObservedDm
            ? `${rowCount} observations across ${points.length} date(s): ${firstDate} to ${lastDate} (estimated biomass on grid_date and observed DM on date).`
            : `${rowCount} observations across ${points.length} date(s): ${firstDate} to ${lastDate} (estimated productivity series).`;
      setSeriesSummary(message);

      state.chartLoaded = true;
    };

    const switchTab = (target) => {
      const showMap = target === "map" || !state.allowSeries;
      mapPanel.classList.toggle("hidden", !showMap);
      seriesPanel.classList.toggle("hidden", showMap || !state.allowSeries);
      mapTab.classList.toggle("is-active", showMap);
      seriesTab.classList.toggle("is-active", !showMap && state.allowSeries);
      mapTab.setAttribute("aria-selected", showMap ? "true" : "false");
      seriesTab.setAttribute("aria-selected", showMap || !state.allowSeries ? "false" : "true");

      if (showMap) {
        ensureMap().finally(() => {
          state.map?.invalidateSize();
        });
      } else {
        ensureChart();
      }
    };

    const setSeriesEnabled = (enabled) => {
      state.allowSeries = enabled;
      seriesTab.classList.toggle("hidden", !enabled);
      seriesTab.disabled = !enabled;
      seriesTab.setAttribute("aria-disabled", enabled ? "false" : "true");
    };

    const setActiveDataset = (datasetName) => {
      state.activeDataset = DATASET_CONFIG[datasetName] ? datasetName : "biomass";
    };

    const openModal = (tab) => {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      switchTab(tab);
    };

    const closeModal = () => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    };

    openMapBtn.addEventListener("click", () => {
      setSeriesEnabled(true);
      setActiveDataset("biomass");
      openModal("map");
    });
    openSoilMapBtn?.addEventListener("click", () => {
      setSeriesEnabled(false);
      setActiveDataset("soil");
      openModal("map");
    });
    closeBtn.addEventListener("click", closeModal);
    mapTab.addEventListener("click", () => switchTab("map"));
    seriesTab.addEventListener("click", () => switchTab("series"));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });

  }

  function initNdviComparisonExperience() {
    const modal = document.getElementById("ndvi-compare-modal");
    const openBtn = document.getElementById("open-ndvi-compare");
    const closeBtn = document.getElementById("close-ndvi-compare-modal");
    const mapTab = document.getElementById("ndvi-tab-map");
    const seriesTab = document.getElementById("ndvi-tab-series");
    const mapPanel = document.getElementById("ndvi-compare-map-panel");
    const seriesPanel = document.getElementById("ndvi-series-panel");
    const mapContainer = document.getElementById("ndvi-compare-map");
    const loadingEl = document.getElementById("ndvi-compare-loading");
    const errorEl = document.getElementById("ndvi-compare-error");
    const legendEl = document.getElementById("ndvi-compare-legend");
    const minInput = document.getElementById("ndvi-compare-min");
    const maxInput = document.getElementById("ndvi-compare-max");
    const applyBtn = document.getElementById("ndvi-compare-apply");
    const seriesSummaryEl = document.getElementById("ndvi-series-summary");
    const seriesCanvas = document.getElementById("ndvi-series-chart");

    if (
      !modal ||
      !openBtn ||
      !closeBtn ||
      !mapTab ||
      !seriesTab ||
      !mapPanel ||
      !seriesPanel ||
      !mapContainer ||
      !loadingEl ||
      !errorEl ||
      !legendEl ||
      !seriesSummaryEl ||
      !seriesCanvas
    ) {
      return;
    }

    const state = {
      map: null,
      leftLayer: null,
      rightLayer: null,
      sideBySideControl: null,
      georasterLeft: null,
      georasterRight: null,
      ndviMin: 0.0,
      ndviMax: 1.0,
      loaded: false,
      chart: null,
      chartLoaded: false
    };

    const LEFT_PATH = "assets/data/ndvi_wisecrop_3_2025-10-10.tif";
    const RIGHT_PATH = "assets/data/ndvi_sr_wisecrop_3_2025-10-10.tif";
    const NDVI_SERIES_ROWS = [
      { date: "2025-08-16", med_ndvi: 0.466, max_ndvi: 0.66, min_ndvi: 0.098 },
      { date: "2025-08-21", med_ndvi: 0.538, max_ndvi: 0.764, min_ndvi: 0.014 },
      { date: "2025-08-23", med_ndvi: 0.541, max_ndvi: 0.775, min_ndvi: 0.051 },
      { date: "2025-08-26", med_ndvi: 0.516, max_ndvi: 0.736, min_ndvi: 0.083 },
      { date: "2025-09-02", med_ndvi: 0.566, max_ndvi: 0.855, min_ndvi: 0.015 },
      { date: "2025-09-12", med_ndvi: 0.58, max_ndvi: 0.889, min_ndvi: 0.001 },
      { date: "2025-09-15", med_ndvi: 0.577, max_ndvi: 0.87, min_ndvi: 0.002 },
      { date: "2025-09-22", med_ndvi: 0.594, max_ndvi: 0.879, min_ndvi: 0.0 },
      { date: "2025-09-25", med_ndvi: 0.581, max_ndvi: 0.877, min_ndvi: 0.0 },
      { date: "2025-09-30", med_ndvi: 0.591, max_ndvi: 0.861, min_ndvi: 0.0 },
      { date: "2025-10-02", med_ndvi: 0.582, max_ndvi: 0.863, min_ndvi: 0.002 },
      { date: "2025-10-05", med_ndvi: 0.599, max_ndvi: 0.899, min_ndvi: 0.001 },
      { date: "2025-10-10", med_ndvi: 0.572, max_ndvi: 0.832, min_ndvi: 0.005 },
      { date: "2025-10-12", med_ndvi: 0.512, max_ndvi: 0.753, min_ndvi: 0.083 },
      { date: "2025-11-21", med_ndvi: 0.737, max_ndvi: 0.941, min_ndvi: 0.005 },
      { date: "2025-12-14", med_ndvi: 0.752, max_ndvi: 0.923, min_ndvi: 0.0 },
      { date: "2025-12-29", med_ndvi: 0.71, max_ndvi: 0.901, min_ndvi: 0.002 },
      { date: "2025-12-31", med_ndvi: 0.173, max_ndvi: 0.879, min_ndvi: 0.029 },
      { date: "2026-01-18", med_ndvi: 0.762, max_ndvi: 0.992, min_ndvi: 0.006 },
      { date: "2026-02-22", med_ndvi: 0.75, max_ndvi: 0.901, min_ndvi: 0.0 },
      { date: "2026-03-11", med_ndvi: 0.722, max_ndvi: 0.871, min_ndvi: 0.004 },
      { date: "2026-03-24", med_ndvi: 0.689, max_ndvi: 0.845, min_ndvi: 0.056 },
      { date: "2026-03-29", med_ndvi: 0.697, max_ndvi: 0.885, min_ndvi: 0.044 },
      { date: "2026-03-31", med_ndvi: 0.689, max_ndvi: 0.869, min_ndvi: 0.032 },
      { date: "2026-04-03", med_ndvi: 0.67, max_ndvi: 0.862, min_ndvi: 0.003 }
    ];

    const getRasterParser = () => {
      const w = window;
      if (typeof w.parseGeoraster === "function") return w.parseGeoraster;
      if (typeof w.parseGeoRaster === "function") return w.parseGeoRaster;
      if (typeof w.georaster === "function") return w.georaster;
      if (typeof w.georaster?.default === "function") return w.georaster.default;
      if (w.georaster?.default?.parse) return w.georaster.default.parse;
      if (w.georaster?.parse) return w.georaster.parse;
      return null;
    };

    const showError = (message) => {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    };

    const hideError = () => {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
    };

    const setLoading = (isLoading) => {
      loadingEl.classList.toggle("hidden", !isLoading);
    };

    const updateLegend = () => {
      const min = state.ndviMin;
      const max = state.ndviMax;
      const q1 = min + (max - min) * 0.25;
      const q2 = min + (max - min) * 0.5;
      const q3 = min + (max - min) * 0.75;

      legendEl.innerHTML = `
        <div><strong>NDVI</strong> (${min.toFixed(2)} - ${max.toFixed(2)})</div>
        <div class="ndvi-compare-legend-bar"></div>
        <div class="ndvi-compare-legend-ticks">
          <span>${min.toFixed(2)}</span>
          <span>${q1.toFixed(2)}</span>
          <span>${q2.toFixed(2)}</span>
          <span>${q3.toFixed(2)}</span>
          <span>${max.toFixed(2)}</span>
        </div>
      `;
    };

    const createLayer = (georaster) => {
      const noDataRaw = georaster?.noDataValue;
      const noData = Number.isFinite(Number(noDataRaw)) ? Number(noDataRaw) : null;
      const scale = window.chroma.scale("RdYlGn").domain([state.ndviMin, state.ndviMax]);

      return new window.GeoRasterLayer({
        georaster,
        pane: "rasterPane",
        pixelValuesToColorFn: (values) => {
          const value = values?.[0];
          if (!Number.isFinite(value)) {
            return null;
          }
          if (noData !== null && Math.abs(value - noData) < 1e-6) {
            return null;
          }
          const clipped = Math.max(state.ndviMin, Math.min(state.ndviMax, value));
          return scale(clipped).hex();
        },
        resolution: 256,
        opacity: 1
      });
    };

    const loadArrayBufferViaXhr = (url) =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
            resolve(xhr.response);
            return;
          }
          reject(new Error(`XHR ${xhr.status} for ${url}`));
        };
        xhr.onerror = () => reject(new Error(`XHR network error for ${url}`));
        xhr.send();
      });

    const loadArrayBuffer = async (path) => {
      const currentUrl = new URL(window.location.href);
      const resolvedUrl = new URL(path, currentUrl).toString();
      const baseDir = currentUrl.href.replace(/[^/]*$/, "");
      const candidates = Array.from(new Set([path, `./${path}`, resolvedUrl, `${baseDir}${path}`]));
      let arrayBuffer = null;
      let lastError = null;

      for (const candidate of candidates) {
        try {
          const response = await fetch(candidate);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          arrayBuffer = await response.arrayBuffer();
          break;
        } catch (fetchError) {
          try {
            arrayBuffer = await loadArrayBufferViaXhr(candidate);
            break;
          } catch (xhrError) {
            lastError = xhrError || fetchError;
          }
        }
      }

      if (arrayBuffer) {
        return arrayBuffer;
      }
      if (window.location.protocol === "file:") {
        throw new Error("Cannot read GeoTIFF via file://. Open this website through http://localhost.");
      }
      throw lastError || new Error("Unable to load GeoTIFF.");
    };

    const renderLayers = () => {
      if (!state.map || !state.georasterLeft || !state.georasterRight || typeof window.GeoRasterLayer !== "function") {
        return;
      }

      if (state.leftLayer) {
        state.map.removeLayer(state.leftLayer);
      }
      if (state.rightLayer) {
        state.map.removeLayer(state.rightLayer);
      }

      state.leftLayer = createLayer(state.georasterLeft);
      state.rightLayer = createLayer(state.georasterRight);
      state.leftLayer.addTo(state.map);
      state.rightLayer.addTo(state.map);

      if (!state.sideBySideControl && typeof window.L?.control?.sideBySide === "function") {
        state.sideBySideControl = window.L.control.sideBySide(state.leftLayer, state.rightLayer).addTo(state.map);
      } else if (state.sideBySideControl) {
        state.sideBySideControl.setLeftLayers(state.leftLayer);
        state.sideBySideControl.setRightLayers(state.rightLayer);
      }

      updateLegend();
    };

    const ensureMap = async () => {
      if (!window.L || typeof window.chroma?.scale !== "function") {
        showError("Leaflet, Chroma.js, or dependencies are not available.");
        return;
      }

      if (!window.L.Control?.SideBySide || typeof window.L.control?.sideBySide !== "function") {
        showError("Leaflet Side-by-Side plugin is not available.");
        return;
      }
      if (!window.L.Control.SideBySide.prototype.__vcClickPatchApplied) {
        const originalAddTo = window.L.Control.SideBySide.prototype.addTo;
        window.L.Control.SideBySide.prototype.addTo = function patchedAddTo(map) {
          const result = originalAddTo.call(this, map);
          if (this._container) {
            window.L.DomEvent.disableClickPropagation(this._container);
          }
          return result;
        };
        window.L.Control.SideBySide.prototype.__vcClickPatchApplied = true;
      }

      const parser = getRasterParser();
      if (!parser || typeof window.GeoRasterLayer !== "function") {
        showError("GeoRaster dependencies are not available.");
        return;
      }

      if (!state.map) {
        state.map = window.L.map("ndvi-compare-map", {
          center: [39.362, -8.553],
          zoom: 16,
          zoomControl: false
        });
        window.L.control.zoom({ position: "bottomleft" }).addTo(state.map);
        state.map.createPane("rasterPane");
        state.map.getPane("rasterPane").style.zIndex = "450";
        state.map.getPane("rasterPane").style.pointerEvents = "none";

        const baseLayers = {
          "CARTO Light": window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
            subdomains: "abcd",
            maxZoom: 20
          }),
          OpenStreetMap: window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 20
          }),
          "Esri Imagery": window.L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "Tiles &copy; Esri",
              maxZoom: 20
            }
          )
        };

        baseLayers["CARTO Light"].addTo(state.map);
        window.L.control.layers(baseLayers, {}, { position: "topright", collapsed: true }).addTo(state.map);
        state.map.on("baselayerchange", () => {
          state.leftLayer?.bringToFront?.();
          state.rightLayer?.bringToFront?.();
        });
      }

      if (state.loaded) {
        renderLayers();
        state.map.invalidateSize();
        return;
      }

      setLoading(true);
      hideError();

      try {
        const [leftBuffer, rightBuffer] = await Promise.all([loadArrayBuffer(LEFT_PATH), loadArrayBuffer(RIGHT_PATH)]);
        state.georasterLeft = await parser(leftBuffer);
        state.georasterRight = await parser(rightBuffer);
        state.loaded = true;
        renderLayers();
        const rasterBounds = state.leftLayer?.getBounds?.();
        if (rasterBounds?.isValid?.()) {
          state.map.setView(rasterBounds.getCenter(), 16);
        }
        state.map.invalidateSize();
      } catch (error) {
        showError(error?.message || "Failed to load NDVI comparison rasters.");
      } finally {
        setLoading(false);
      }
    };

    const ensureChart = () => {
      if (state.chartLoaded) {
        state.chart?.resize?.();
        return;
      }

      if (typeof window.Chart !== "function") {
        seriesSummaryEl.textContent =
          currentLang === "pt" ? "Chart.js não está disponível." : "Chart.js is not available.";
        return;
      }

      const locale = currentLang === "pt" ? "pt-PT" : "en-GB";
      const formatter = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" });
      const sorted = NDVI_SERIES_ROWS
        .filter((row) => Number.isFinite(row.med_ndvi) && row.med_ndvi >= 0.2)
        .sort((a, b) => a.date.localeCompare(b.date));
      if (!sorted.length) {
        seriesSummaryEl.textContent =
          currentLang === "pt" ? "Sem dados NDVI para apresentar." : "No NDVI data available to display.";
        return;
      }
      const labels = sorted.map((row) => formatter.format(new Date(`${row.date}T00:00:00Z`)));
      const medValues = sorted.map((row) => row.med_ndvi);

      const ctx = seriesCanvas.getContext("2d");
      if (!ctx) {
        return;
      }

      state.chart = new window.Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: currentLang === "pt" ? "NDVI mediano" : "Median NDVI",
              data: medValues,
              borderColor: "rgba(24, 120, 80, 1)",
              backgroundColor: "rgba(24, 120, 80, 1)",
              pointRadius: 3.5,
              borderWidth: 2.6,
              tension: 0.24
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {},
          scales: {
            y: {
              min: 0,
              max: 1,
              title: {
                display: true,
                text: "NDVI"
              }
            },
            x: {
              title: {
                display: true,
                text: currentLang === "pt" ? "Data" : "Date"
              }
            }
          }
        }
      });

      const firstDate = labels[0];
      const lastDate = labels[labels.length - 1];
      seriesSummaryEl.textContent =
        currentLang === "pt"
          ? `${sorted.length} observações NDVI entre ${firstDate} e ${lastDate}.`
          : `${sorted.length} NDVI observations between ${firstDate} and ${lastDate}.`;

      state.chartLoaded = true;
    };

    const switchTab = (target) => {
      const showMap = target === "map";
      mapPanel.classList.toggle("hidden", !showMap);
      seriesPanel.classList.toggle("hidden", showMap);
      mapTab.classList.toggle("is-active", showMap);
      seriesTab.classList.toggle("is-active", !showMap);
      mapTab.setAttribute("aria-selected", showMap ? "true" : "false");
      seriesTab.setAttribute("aria-selected", showMap ? "false" : "true");

      if (showMap) {
        ensureMap();
        window.setTimeout(() => {
          state.map?.invalidateSize();
        }, 90);
      } else {
        ensureChart();
        state.chart?.resize?.();
      }
    };

    const openModal = () => {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      switchTab("map");
    };

    const closeModal = () => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    };

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    mapTab.addEventListener("click", () => switchTab("map"));
    seriesTab.addEventListener("click", () => switchTab("series"));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });

    applyBtn?.addEventListener("click", () => {
      const newMin = Number.parseFloat(minInput?.value || "");
      const newMax = Number.parseFloat(maxInput?.value || "");
      if (!Number.isFinite(newMin) || !Number.isFinite(newMax) || newMin >= newMax) {
        showError(currentLang === "pt" ? "Use valores válidos com Min < Max." : "Use valid values with Min < Max.");
        return;
      }
      hideError();
      state.ndviMin = newMin;
      state.ndviMax = newMax;
      if (state.loaded) {
        renderLayers();
      } else {
        updateLegend();
      }
    });

    updateLegend();
  }

  function initWeatherAlertsExperience() {
    const modal = document.getElementById("weather-alerts-modal");
    const openBtn = document.getElementById("open-weather-alerts");
    const closeBtn = document.getElementById("close-weather-alerts-modal");

    if (!modal || !openBtn || !closeBtn) {
      return;
    }

    const openModal = () => {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    };

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
    const encodedName = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie ? document.cookie.split(";") : [];

    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(encodedName)) {
        return decodeURIComponent(trimmed.slice(encodedName.length));
      }
    }

    return "";
  }

  function safeParseJson(raw) {
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }

  function getStorageItem(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch (_error) {
      return "";
    }
  }

  function setStorageItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      // Ignore storage failures and continue with cookie fallback.
    }
  }
})();
