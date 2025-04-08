//! Milestone 1

/* Crea un type alias Person per rappresentare una persona generica.

Il tipo deve includere le seguenti proprietà:

    id: numero identificativo, non modificabile
    name: nome completo, stringa non modificabile
    birth_year: anno di nascita, numero
    death_year: anno di morte, numero opzionale
    biography: breve biografia, stringa
    image: URL dell'immagine, stringa */

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

//! Milestone 2

/* Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

    most_famous_movies: una tuple di 3 stringhe
    awards: una stringa
    nationality: una stringa tra un insieme definito di valori.
    Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese. */

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality:
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese";
};

//! Milestone 3

/* Crea una funzione getActress che, dato un id, effettua una chiamata a:

GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses/:id

La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta. */

// Controllo che la struttura del dato sia corretta
function isActress(data: unknown): data is Actress {
  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof data.id === "number" &&
    "name" in data &&
    typeof data.name === "string" &&
    "birth_year" in data &&
    typeof data.birth_year === "number" &&
    "death_year" in data &&
    typeof data.death_year === "number" &&
    "biography" in data &&
    typeof data.biography === "string" &&
    "image" in data &&
    typeof data.image === "string" &&
    "most_famous_movies" in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every((movie) => typeof movie === "string") &&
    "awards" in data &&
    typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string"
  ) {
    return true;
  }
  return false;
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(
      `https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`
    );
    const data = await response.json();
    if (isActress(data)) {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

(async () => {
  const result = getActress(3)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
  return result;
})();
(async () => {
  const result = getActress(2)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
  return result;
})();

//! Milestone 4

/* Crea una funzione getAllActresses che chiama:

GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses

La funzione deve restituire un array di oggetti Actress.
 
Può essere anche un array vuoto. */

async function getAllActresses(): Promise<object | (number | string)[]> {
  try {
    const response = await fetch(
      `https://boolean-spec-frontend.vercel.app/freetestapi/actresses`
    );
    const data: unknown = await response.json();
    if (!(data instanceof Array)) {
      throw new Error(
        "Errore nel recupero dei dati, formato oggetto non valido!"
      );
    }

    const actressesValid = data.filter(isActress);
    return actressesValid;
  } catch (error) {
    console.error(error);
  }
  return [];
}

(async () => {
  const result = getAllActresses()
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
  return result;
})();

//! Milestone 5

/* Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).

Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.

L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.

La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata). */

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map((id) => getActress(id));
    const actresses = await Promise.all(promises);
    return actresses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

getActresses([3, 4, 5])
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
