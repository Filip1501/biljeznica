// Ulazna točka: čita argumente iz process.argv i izvršava naredbe.
import { ucitajZadatke, spremiZadatke } from './pohrana.js';

async function dodaj(naslov) {
  if (!naslov || naslov.trim() === '') {
    throw new GreskaUnosa('Nedostaje naslov. Primjer: dodaj "Napisati izvještaj"');
  }
  const zadaci = await ucitajZadatke();
  const id = zadaci.reduce((najveci, z) => Math.max(najveci, z.id), 0) + 1;
  zadaci.push({ id, naslov: naslov.trim(), gotovo: false });
  await spremiZadatke(zadaci);
  console.log(`Dodan zadatak ${id}: ${naslov.trim()}`);
}

async function popis() {
  const zadaci = await ucitajZadatke();
  if (zadaci.length === 0) {
    console.log('Popis je prazan.');
    return;
  }
  for (const z of zadaci) {
    console.log(`${z.id}. [${z.gotovo ? 'x' : ' '}] ${z.naslov}`);
  }
}

async function gotovo(unos) {
  if (unos === undefined || !/^\d+$/.test(unos)) {
    throw new GreskaUnosa('Id mora biti broj. Primjer: gotovo 2');
  }
  const id = Number(unos);
  const zadaci = await ucitajZadatke();
  const zadatak = zadaci.find((z) => z.id === id);
  if (!zadatak) {
    throw new GreskaUnosa(`Zadatak s brojem ${id} ne postoji.`);
  }
  zadatak.gotovo = true;
  await spremiZadatke(zadaci);
  console.log(`Zadatak ${id} označen kao gotov.`);
}

class GreskaUnosa extends Error {}

async function main() {
  const [naredba, argument] = process.argv.slice(2);

  switch (naredba) {
    case 'dodaj':
      await dodaj(argument);
      break;
    case 'popis':
      await popis();
      break;
    case 'gotovo':
      await gotovo(argument);
      break;
    default:
      throw new GreskaUnosa(
        `Nepoznata naredba: ${naredba ?? '(nema)'}. Dostupne naredbe: dodaj, popis, gotovo`
      );
  }
}

try {
  await main();
} catch (pogreska) {
  console.error(`Pogreška: ${pogreska.message}`);
  process.exitCode = 1;
}
