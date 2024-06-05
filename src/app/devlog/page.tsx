import React from "react";

export default function page() {
  return (
    <div className="flex justify-start min-w-full min-h-screen flex-col container bg-accent-foreground">
      <div className="text-4xl font-bold text-accent self-start min-w-full text-center">
        Changelong
      </div>
      <div className="text-accent flex flex-row gap-10 justify-center">
        <h2>0.0.1:</h2>
        <p>
          Aggiornata Pagina Principale, Aggiunta animazione quando si crea un
          nuovo Vault
        </p>
      </div>
    </div>
  );
}
