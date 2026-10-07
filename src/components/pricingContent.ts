import type { Locale } from "../i18n/Language";

export const plans = [
  { name: "Starter", price: 99, tokens: 200 },
  { name: "Pro", price: 249, tokens: 600 },
  { name: "Scale / Business", price: 699, tokens: 2000 },
] as const;

export const pricingContent = {
  fr: {
    label: "OFFRES & TARIFS",
    title: "À chaque infrastructure,",
    accent: "son rythme.",
    intro:
      "Un premier périmètre à explorer. Des environnements à suivre. Une infrastructure qui grandit. Choisissez le volume adapté à votre équipe.",
    status: "Offres proposées · facturation mensuelle",
    month: "/ mois",
    tokens: "tokens / mois",
    approx: "environ",
    focus: "POUR LES ÉQUIPES TECH",
    details: "Comparer cette offre",
    compare: "Comparer les offres",
    note: "Volumes de tokens indicatifs. Les modalités de souscription restent à confirmer.",
    descriptions: [
      "Pour une petite startup et une première application web.",
      "Pour les PME tech qui suivent plusieurs environnements.",
      "Pour les scale-ups et les infrastructures riches en API.",
    ],
    features: [
      [
        "Un premier périmètre",
        "Une application web simple",
        "Un rythme de tests ponctuel",
      ],
      [
        "Plusieurs environnements",
        "Un rythme de tests régulier",
        "Un volume adapté à une équipe tech",
      ],
      [
        "Une infrastructure en croissance",
        "De nombreuses API",
        "Un volume supérieur à Pro",
      ],
    ],
    modelLabel: "01 / UN VOLUME, VOTRE RYTHME",
    modelTitle: "Le bon plan commence",
    modelAccent: "par votre périmètre.",
    modelText:
      "Les tokens constituent le budget de consommation de votre offre. Le nombre de scans dépend du périmètre et de la consommation de chaque analyse.",
    simulator: "ESTIMER SON VOLUME",
    budget: "Votre besoin mensuel en tokens",
    suggestion: "Offre correspondant au volume",
    beyond: "Besoin supérieur aux offres proposées",
    beyondText:
      "Le volume choisi dépasse les quelque 2 000 tokens de Scale / Business. Un dimensionnement spécifique reste à définir.",
    simulatorNote:
      "Repère indicatif basé sur les volumes proposés. Ce n’est pas une estimation du coût d’un scan.",
    tableLabel: "02 / LES OFFRES EN DÉTAIL",
    tableTitle: "Trois volumes.",
    tableAccent: "Une lecture claire.",
    selected: "Offre sélectionnée",
    monthly: "Prix mensuel",
    volume: "Tokens mensuels indicatifs",
    audience: "Pour qui ?",
    scope: "Périmètre type",
    cadence: "Rythme envisagé*",
    audiences: ["Petite startup", "PME tech", "Scale-up / ETI"],
    scopes: [
      "Une application simple",
      "Plusieurs environnements",
      "De nombreuses API",
    ],
    cadences: ["1 à 2 fois par mois", "Hebdomadaire", "Selon le périmètre"],
    tableNote:
      "* Profils d’usage visés, pas des quotas de scans inclus ou garantis. Les volumes de tokens restent indicatifs.",
    faqLabel: "03 / AVANT DE CHOISIR",
    faqTitle: "Les bonnes questions.",
    faqs: [
      [
        "À quoi servent les tokens ?",
        "Ils représentent le budget de consommation mensuel associé à l’offre. Le coût d’une analyse dépend de son périmètre. Un nombre de tokens ne correspond donc pas à un nombre fixe de scans.",
      ],
      [
        "Les prix et volumes sont-ils définitifs ?",
        "Cette page présente la stratégie d’abonnement proposée : 99 €, 249 € et 699 € par mois, pour environ 200, 600 et 2 000 tokens. Les conditions commerciales définitives, notamment fiscales, seront précisées lors de l’ouverture des souscriptions.",
      ],
      [
        "Que se passe-t-il si je dépasse mon volume ?",
        "Scale / Business est prévu pour accompagner les besoins qui dépassent le volume de Pro. Les modalités de dépassement, de recharge et de report des tokens ne sont pas encore précisées.",
      ],
      [
        "Puis-je déjà souscrire ?",
        "La plateforme est en développement. Aucun paiement ni abonnement n’est déclenché depuis cette page. Vous pouvez explorer la démonstration pour découvrir le fonctionnement d’Aegis AI.",
      ],
    ],
    closing: "Avant de choisir,",
    closingAccent: "voyez Aegis en action.",
    demo: "Explorer la démonstration",
    back: "Retour à la plateforme",
    reduce: "Réduire les animations",
    enable: "Activer les animations",
    skip: "Aller aux offres",
  },
  en: {
    label: "PLANS & PRICING",
    title: "Your infrastructure.",
    accent: "Your pace.",
    intro:
      "A first scope to explore. Environments to monitor. Infrastructure that keeps growing. Choose the volume that fits your team.",
    status: "Proposed plans · monthly billing",
    month: "/ month",
    tokens: "tokens / month",
    approx: "approximately",
    focus: "FOR TECH TEAMS",
    details: "Compare this plan",
    compare: "Compare plans",
    note: "Indicative token volumes. Subscription terms are still to be confirmed.",
    descriptions: [
      "For a small startup and its first web application.",
      "For tech SMEs managing multiple environments.",
      "For scale-ups and infrastructure with many APIs.",
    ],
    features: [
      ["An initial scope", "One simple web application", "Occasional testing"],
      [
        "Multiple environments",
        "Regular testing",
        "Volume suited to a tech team",
      ],
      ["Growing infrastructure", "Multiple APIs", "More capacity than Pro"],
    ],
    modelLabel: "01 / YOUR VOLUME, YOUR PACE",
    modelTitle: "The right plan starts",
    modelAccent: "with your scope.",
    modelText:
      "Tokens are the usage budget included in your plan. The number of scans depends on the scope and consumption of each analysis.",
    simulator: "EXPLORE YOUR VOLUME",
    budget: "Your monthly token requirement",
    suggestion: "Plan matching this volume",
    beyond: "Beyond the proposed plans",
    beyondText:
      "Your selected volume exceeds the approximately 2,000 tokens in Scale / Business. A tailored scope would need to be defined.",
    simulatorNote:
      "An indicative guide based on proposed volumes, not an estimate of scan costs.",
    tableLabel: "02 / A CLOSER LOOK",
    tableTitle: "Three volumes.",
    tableAccent: "A clear comparison.",
    selected: "Selected plan",
    monthly: "Monthly price",
    volume: "Indicative monthly tokens",
    audience: "Who is it for?",
    scope: "Typical scope",
    cadence: "Intended frequency*",
    audiences: ["Small startup", "Tech SME", "Scale-up / mid-market"],
    scopes: [
      "One simple application",
      "Multiple environments",
      "Multiple APIs",
    ],
    cadences: ["1–2 times per month", "Weekly", "Depending on scope"],
    tableNote:
      "* Intended usage profiles, not included or guaranteed scan quotas. Token volumes are indicative.",
    faqLabel: "03 / BEFORE YOU CHOOSE",
    faqTitle: "The right questions.",
    faqs: [
      [
        "What are tokens used for?",
        "They represent the monthly usage budget associated with your plan. An analysis consumes tokens according to its scope, so tokens do not equate to a fixed number of scans.",
      ],
      [
        "Are these final prices and volumes?",
        "This page presents the proposed subscription strategy: €99, €249 and €699 per month for approximately 200, 600 and 2,000 tokens. Final commercial terms, including tax treatment, will be specified when subscriptions open.",
      ],
      [
        "What if I need more tokens?",
        "Scale / Business is intended for requirements beyond the Pro volume. Overage, top-up and token rollover terms have not yet been specified.",
      ],
      [
        "Can I subscribe now?",
        "The platform is under development. This page does not initiate any payment or subscription. Explore the demo to see how Aegis AI works.",
      ],
    ],
    closing: "Before you choose,",
    closingAccent: "see Aegis in action.",
    demo: "Explore the demo",
    back: "Back to the platform",
    reduce: "Reduce animations",
    enable: "Enable animations",
    skip: "Skip to plans",
  },
} satisfies Record<Locale, unknown>;
