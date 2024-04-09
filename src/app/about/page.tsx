// about/page.tsx

import React from 'react';

const AboutPage = () => {
  return (
    <>
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mt-24 md:mt-36">Wie funktioniert classbot.ch?</h1>
        <p className="mt-8">
          Unsere Plattform nutzt grosse Sprachmodelle, ein Teilbereich der generativen künstlichen Intelligenz (KI), um dir eine interaktive Erfahrung zu bieten. 
          Die Bots, die auf dieser Seite zum Einsatz kommen, sind Ergebnisse komplexer Algorithmen und maschinellem Lernen.
        </p>
        <div className="justify-center flex">
          <iframe className="rounded-xl mt-4" width="560" height="315" src="https://www.youtube.com/embed/mxP3G2Jb2LM?si=mitPyaP7k0TSfn9_" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; allowfullscreen"></iframe>
        </div>
        <p className="text-sm text-gray-700 text-center">Video: Wie funktioniert generative KI?</p>
        <p className="mt-4">
          Es ist wichtig zu verstehen, dass die Antworten der Bots auf Wahrscheinlichkeiten basieren und nicht 
          auf menschlichem Wissen oder Verständnis. Sie sind darauf trainiert, Texte zu generieren, die denen 
          eines Menschen ähneln könnten, aber ohne tatsächliches Verständnis für die Inhalte.
        </p>
        <p className="mt-4">
          Die Nutzung solcher Modelle in der Schule soll das Lernen unterstützen und inspirieren, jedoch 
          ersetzen sie keine realen Personen, wie deine Lehrerin oder dein Lehrer. Die Interaktion mit den Bots 
          kann hilfreich sein, um neue Perspektiven zu erkunden oder Ideen zu entwickeln, aber du solltest dir
          bei jeder Antwort überlegen, ob du ihr glauben kannst. Wenn du unsicher bist, frage eine Lehrperson oder
          eine andere vertrauenswürdige Person.
        </p>
        <p className="mt-4 font-bold">Deine Privatsphäre ist uns wichtig. Teile keine persönlichen Daten mit den Bots.
        Alle deine Eingaben werden auf unseren Servern abgespeichert und können zu Forschungszwecken eingesehen werden.</p>
        <p className="mt-4 mb-16">
          Wir laden dich ein, die Möglichkeiten zu entdecken, die unsere Bots bieten, aber erinnern dich daran, dass 
          die Technologie als Werkzeug zu betrachten ist, dessen Ergebnisse stets hinterfragt werden sollten.
        </p>
      </div>
    </>
  );
};

export default AboutPage;
