
import { readFile, writeFile } from 'node:fs/promises';

const DATOTEKA = new URL('./zadaci.json', import.meta.url);

export async function ucitajZadatke() {
  let sadrzaj;
  try {
    sadrzaj = await readFile(DATOTEKA, 'utf-8');
  } catch (pogreska) {
    if (pogreska.code === 'ENOENT') {
      return []; 
    }
    throw new Error(`Datoteku zadaci.json nije moguće pročitati: ${pogreska.message}`);
  }

  if (sadrzaj.trim() === '') {
    return [];
  }

  let zadaci;
  try {
    zadaci = JSON.parse(sadrzaj);
  } catch {
    throw new Error('Datoteka zadaci.json ima neispravan JSON. Popravite je ili je obrišite.');
  }

  if (!Array.isArray(zadaci)) {
    throw new Error('Datoteka zadaci.json mora sadržavati polje zadataka.');
  }
  return zadaci;
}

export async function spremiZadatke(zadaci) {
  try {
    await writeFile(DATOTEKA, JSON.stringify(zadaci, null, 2), 'utf-8');
  } catch (pogreska) {
    throw new Error(`Zadatke nije moguće spremiti: ${pogreska.message}`);
  }
}
