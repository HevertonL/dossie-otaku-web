import http from 'k6/http';
import { check, sleep } from 'k6';
// 1. IMPORT NOVO: Traz o gerador de HTML direto do repositório oficial
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate==0'], 
  },
};

export default function () {
  const url = 'http://localhost:3000/dossiers/anime/20'; // Apontando para o seu banco!

  const res = http.get(url);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}

// 2. FUNÇÃO NOVA: Pega os resultados finais e cospe em um arquivo HTML
export function handleSummary(data) {
  return {
    "performance/relatorio-carga.html": htmlReport(data),
  };
}