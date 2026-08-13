import type { L } from "../lib/i18n"

/**
 * Recall tags for each scholar's current journal, the same job essay_themes
 * do on the board portal: two to four concrete marks so eleven entries do
 * not blur together. Drawn from the journal record and the campus facts
 * those entries turn on, not from rubric words.
 */
export const JOURNAL_THEMES: Record<string, L[]> = {
  "juan-angel-aicardy": [
    { en: "Newt, virtual physics lab", es: "Newt, laboratorio virtual de física" },
    { en: "ExpoAndes", es: "ExpoAndes" },
    { en: "Teaching assistant", es: "Monitorías" },
    { en: "Violin", es: "Violín" },
  ],
  "daniel-alzate": [
    { en: "Top 5% in physics", es: "5% superior en física" },
    { en: "Salsa band", es: "Banda de salsa" },
    { en: "NASA", es: "NASA" },
  ],
  "mateo-arcila": [
    { en: "Highest GPA in the cohort", es: "El PGA más alto de la cohorte" },
    { en: "Economics", es: "Economía" },
    { en: "Lumen as a safe space", es: "Lumen como espacio seguro" },
  ],
  "juan-pablo-contreras": [
    { en: "Engineering student council", es: "Consejo estudiantil de Ingeniería" },
    { en: "Model UN", es: "Modelo ONU" },
    { en: "Finance Club", es: "Club de Finanzas" },
    { en: "Nursing-home volunteer", es: "Voluntario en ancianatos" },
  ],
  "juan-daniel-gonzalo": [
    { en: "ExpoAndes 2025, baby monitor", es: "ExpoAndes 2025, monitor de bebés" },
    { en: "AI voice recognition", es: "Reconocimiento de voz con IA" },
    { en: "Entrepreneurship", es: "Emprendimiento" },
  ],
  "sebastian-martinez": [
    { en: "Intelligent Planet Hackathon", es: "Intelligent Planet Hackathon" },
    { en: "Audicia, public-contract AI", es: "Audicia, IA de contratos públicos" },
    { en: "Congress of the Republic", es: "Congreso de la República" },
  ],
  "jose-maturana": [
    { en: "Colombian-fruit wine", es: "Vino de frutas colombianas" },
    { en: "Double major with business", es: "Doble programa con Administración" },
  ],
  "julian-rodriguez": [
    { en: "Electric racing kart", es: "Kart de carreras eléctrico" },
    { en: "Power & Energy Society", es: "Power & Energy Society" },
    { en: "Weekend event logistics", es: "Logística de eventos los fines de semana" },
  ],
  "santiago-rubiano": [
    { en: "Biomedical engineering", es: "Ingeniería biomédica" },
    { en: "Chronic rhinitis, micro-robotics", es: "Rinitis crónica, microrobótica" },
    { en: "Math olympiad", es: "Olimpiada de matemáticas" },
  ],
  "valentina-salgado": [
    { en: "Artificial intelligence", es: "Inteligencia artificial" },
    { en: "Board-games club", es: "Club de juegos de mesa" },
    { en: "Tennis", es: "Tenis" },
  ],
  "valerie-suarez": [
    { en: "Graduate-level research", es: "Investigación de posgrado" },
    { en: "Teaching programming", es: "Monitoría de programación" },
    { en: "Highest first-semester GPA", es: "El PGA más alto del primer semestre" },
  ],
}
