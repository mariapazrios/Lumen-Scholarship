/**
 * Term-by-term academic record per Lumen, read out of the Uniandes grade report.
 *
 * `average` is the straight mean of that term's course grades. It is not the
 * official semester PGA: the report prints no per-term figure, and Uniandes
 * weights by credits. `officialPga` is the cumulative figure the report states
 * in text, which is authoritative.
 *
 * `complete` is false where fewer terms were recovered than the scholar should
 * have, so the UI can say so instead of implying a full history.
 *
 * A term with `average: null` means the scholar was not enrolled that semester
 * (confirmed, not missing data). The chart shows it as an N/A gap and breaks
 * the line, which is different from a term still waiting to be recovered.
 */
export type ScholarTerm = { term: string; average: number | null; courses: number | null }

export type ScholarTermRecord = {
  terms: ScholarTerm[]
  officialPga: number | null
  complete: boolean
}

export const SCHOLAR_TERMS: Record<string, ScholarTermRecord> = {
  "daniel-alzate": {
    "terms": [
      {
        "term": "2025-1",
        "average": 4.5,
        "courses": 5
      },
      {
        "term": "2025-2",
        "average": 4.41,
        "courses": 7
      }
    ],
    "officialPga": 4.41,
    "complete": true
  },
  "jose-maturana": {
    "terms": [
      {
        "term": "2024-1",
        "average": 3.03,
        "courses": 6
      },
      {
        // not enrolled in 2024-2, per Maria Paz (2026-08-02): a real gap, not a
        // term we failed to recover
        "term": "2024-2",
        "average": null,
        "courses": null
      },
      {
        "term": "2025-1",
        "average": 3.33,
        "courses": 4
      },
      {
        // screenshot 2026-08-02: mean of Col: Espacio,Tiempo,Diferencia 4.64,
        // Analítica de Datos 2.62, Historia EEUU 3.70. Astronomía Galáctica
        // Retirado and English 08 Reprobado (pass/fail) carry no numeric grade.
        "term": "2025-2",
        "average": 3.65,
        "courses": 3
      }
    ],
    "officialPga": 3.22,
    "complete": true
  },
  "juan-angel-aicardy": {
    "terms": [
      {
        "term": "2024-1",
        "average": 4.15,
        "courses": 7
      },
      {
        "term": "2024-2",
        "average": 3.93,
        "courses": 5
      },
      {
        "term": "2025-1",
        "average": 4.33,
        "courses": 5
      },
      {
        "term": "2025-2",
        "average": 4.1,
        "courses": 4
      }
    ],
    "officialPga": 4.15,
    "complete": true
  },
  "juan-daniel-gonzalo": {
    "terms": [
      {
        "term": "2025-1",
        "average": 4.25,
        "courses": 5
      },
      {
        "term": "2025-2",
        "average": 3.76,
        "courses": 5
      }
    ],
    "officialPga": 3.92,
    "complete": true
  },
  "juan-pablo-contreras": {
    "terms": [
      {
        "term": "2024-1",
        "average": 4.49,
        "courses": 5
      },
      {
        "term": "2024-2",
        "average": 4.59,
        "courses": 6
      },
      {
        "term": "2025-1",
        "average": 4.68,
        "courses": 6
      },
      {
        "term": "2025-2",
        "average": 3.84,
        "courses": 7
      }
    ],
    "officialPga": 4.36,
    "complete": true
  },
  "julian-rodriguez": {
    "terms": [
      {
        "term": "2024-1",
        "average": 4.52,
        "courses": 6
      },
      {
        "term": "2024-2",
        "average": 4.32,
        "courses": 6
      },
      {
        "term": "2025-1",
        "average": 3.99,
        "courses": 6
      },
      {
        "term": "2025-2",
        "average": 3.38,
        "courses": 5
      }
    ],
    "officialPga": 3.98,
    "complete": true
  },
  "mateo-arcila": {
    // one term IS the whole record: there is no 2025-1 for Arcila, per Maria
    // Paz (2026-08-02) — he entered in 2025-2. Nothing left to recover.
    "terms": [
      {
        "term": "2025-2",
        "average": 4.67,
        "courses": 5
      }
    ],
    "officialPga": 4.64,
    "complete": true
  },
  "santiago-rubiano": {
    "terms": [
      {
        "term": "2025-1",
        "average": 4.43,
        "courses": 6
      }
    ],
    "officialPga": 4.33,
    "complete": false
  },
  "sebastian-martinez": {
    "terms": [
      {
        // screenshot 2026-08-02: 7 numeric finals (4.82, 4.45, 4.09, 4.38,
        // 4.25, 4.00, 4.41). Cálculo Diferencial (hon) Retirado; English 05/06,
        // Herramientas Vida Universitaria and RLEC are pass/fail.
        "term": "2024-1",
        "average": 4.34,
        "courses": 7
      },
      {
        "term": "2024-2",
        "average": 4.14,
        "courses": 5
      },
      {
        "term": "2025-1",
        "average": 3.57,
        "courses": 6
      },
      {
        // screenshot 2026-08-02: 6 numeric finals (3.79, 3.65, 3.34, 3.59,
        // 4.17, 3.67). English 07/08 pass/fail; Álgebra Lineal withdrawn in the
        // 2025-19 intersemestral before the 3.79 here.
        "term": "2025-2",
        "average": 3.70,
        "courses": 6
      }
    ],
    "officialPga": 3.91,
    "complete": true
  },
  "valentina-salgado": {
    "terms": [
      {
        "term": "2025-1",
        "average": 4.01,
        "courses": 6
      },
      {
        "term": "2025-2",
        "average": 3.4,
        "courses": 5
      }
    ],
    "officialPga": 3.71,
    "complete": true
  },
  "valerie-suarez": {
    "terms": [
      {
        "term": "2024-1",
        "average": 4.55,
        "courses": 7
      },
      {
        "term": "2024-2",
        "average": 4.13,
        "courses": 7
      },
      {
        // screenshot 2026-08-02: 7 numeric finals (2.80, 4.83, 4.38, 4.10,
        // 4.07, 3.95, 3.25). Fisicoquímica I Retirado; English 06/07, RLEC and
        // Softbol pass/fail.
        "term": "2025-1",
        "average": 3.91,
        "courses": 7
      },
      {
        // screenshot 2026-08-02: 9 numeric finals (5.00, 3.40, 2.59, 4.29,
        // 4.32, 3.85, 3.71, 3.96, 3.80). Física I 2.59 is a numeric final and
        // stays in the mean; English 08 is pass/fail.
        "term": "2025-2",
        "average": 3.88,
        "courses": 9
      }
    ],
    "officialPga": 4.03,
    "complete": true
  }
}
