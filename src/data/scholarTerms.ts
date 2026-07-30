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
 */
export type ScholarTerm = { term: string; average: number; courses: number }

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
        "term": "2025-1",
        "average": 3.33,
        "courses": 4
      }
    ],
    "officialPga": 3.22,
    "complete": false
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
      }
    ],
    "officialPga": 4.36,
    "complete": false
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
    "terms": [
      {
        "term": "2025-2",
        "average": 4.67,
        "courses": 5
      }
    ],
    "officialPga": 4.64,
    "complete": false
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
        "term": "2024-2",
        "average": 4.14,
        "courses": 5
      },
      {
        "term": "2025-1",
        "average": 3.57,
        "courses": 6
      }
    ],
    "officialPga": 3.91,
    "complete": false
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
      }
    ],
    "officialPga": 4.03,
    "complete": false
  }
}
