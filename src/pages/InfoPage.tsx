import './InfoPage.css'

function InfoPage() {
  return (
    <div className="info-page">
      <div className="card brand-hero">
        <img src="/wappen.png" alt="Dialekta Logo" className="brand-hero-logo" />
        <h1 className="brand-hero-title">Dialekta</h1>
      </div>

      <h1>Informationen</h1>

      <div className="card">
        <h2>Über das Projekt</h2>
        <p>
          Dialekta ist ein Hochschulprojekt zur Bewahrung der regionalen
          Wenigumstädter Mundart. Ziel ist es, den einzigartigen Dialekt
          dieses Ortes zu dokumentieren und für zukünftige Generationen
          zugänglich zu machen.
        </p>
        <p>
          In einer Zeit, in der regionale Dialekte zunehmend verschwinden, soll
          diese App dazu beitragen, das sprachliche Erbe Wenigumstadts und
          seiner Umgebung zu bewahren.
        </p>
      </div>

      <div className="card">
        <h2>Bedeutung regionaler Dialekte</h2>
        <p>
          Dialekte sind ein wichtiger Teil unserer kulturellen Identität. Sie
          spiegeln die Geschichte, die Traditionen und den Charakter einer Region
          wider. Jeder Dialekt erzählt Geschichten von vergangenen Generationen
          und bewahrt einzigartige Ausdrücke, die in der Hochsprache oft keine
          Entsprechung finden.
        </p>
        <p>
          Die Wenigumstädter Mundart – im Ort selbst "Wilschenumscht" genannt –
          gehört zum unterfränkischen Dialektraum mit Einflüssen aus dem
          Hessischen. Sie zeichnet sich durch charakteristische Lautverschiebungen
          und einen besonderen Wortschatz aus, der tief in der ländlichen und
          handwerklichen Tradition der Region verwurzelt ist. Historisch bedingt
          durch die wallonischen Siedler, die nach dem Dreißigjährigen Krieg ins
          Dorf kamen, finden sich zudem interessante sprachliche Einflüsse.
        </p>
        <p>
          Mit dem Verschwinden der Dialekte geht nicht nur Sprache verloren,
          sondern auch ein Stück gelebter Kultur. Deshalb ist es wichtig, die
          verbliebenen Sprachzeugnisse zu sammeln und für die Nachwelt zu erhalten.
        </p>
      </div>

      <div className="card">
        <h2>Wissenswertes über die Wenigumstädter Mundart</h2>
        <ul className="info-list">
          <li>
            <strong>"Wilschenumscht"</strong> – Der Ortsname im Dialekt erinnert
            an die wallonischen Siedler, die nach dem Dreißigjährigen Krieg ins
            Dorf kamen ("Welschen" = Fremdsprachige).
          </li>
          <li>
            <strong>Alte Begriffe bewahren</strong> – Viele Wörter aus der
            Landwirtschaft, dem Handwerk und dem Alltag sind heute kaum noch
            bekannt. Die App hilft, dieses Wissen lebendig zu halten.
          </li>
          <li>
            <strong>Von und mit der Gemeinschaft</strong> – Die hier
            versammelten Wörter wurden von Bewohnerinnen und Bewohnern
            Wenigumstadts zusammengetragen. Jeder Eintrag ist eine Erinnerung
            an gelebte Sprache.
          </li>
          <li>
            <strong>Aussprache hören</strong> – Ein zentrales Anliegen des
            Projekts ist es, die richtige Aussprache festzuhalten. Die
            Sprachaufnahmen (sofern verfügbar) wurden von Muttersprachlerinnen
            und Muttersprachlern eingesprochen.
          </li>
          <li>
            <strong>Erweiterung geplant</strong> – Perspektivisch soll das
            Wörterbuch um weitere Dialekte der Region ergänzt werden, um
            ein noch umfassenderes Bild der sprachlichen Vielfalt zu zeichnen.
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>Funktionen dieser App</h2>
        <ul className="info-list">
          <li>
            <strong>Übersetzen</strong> – Gib ein hochdeutsches Wort ein
            und erhalte die passende Übersetzung in die Wenigumstädter
            Mundart – und umgekehrt. Nutze die Spracheingabe mit dem
            Mikrofon, um Wörter oder ganze Sätze zu diktieren. Die Übersetzung
            kann angehört werden.
          </li>
          <li>
            <strong>Wörterbuch</strong> – Durchsuch die vollständige
            Liste aller erfassten Dialektwörter. Zu jedem Eintrag findest du
            die hochdeutsche Übersetzung und eine ausführliche Bedeutung.
          </li>
          <li>
            <strong>Aufnahmen</strong> – Hör dir offizielle
            Audioaufnahmen der Wenigumstädter Mundart an. Als angemeldeter
            Benutzer kannst du eigene Aufnahmen erstellen und lokal speichern.
            Administratoren können Aufnahmen direkt auf dem Server speichern
            und damit zum Wörterbuch beitragen.
          </li>
          <li>
            <strong>Info</strong> – Hier erfährst du mehr über das Projekt,
            die Geschichte der Wenigumstädter Mundart und die Bedeutung des
            Dialekterhalts.
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>Zielgruppen</h2>
        <p>
          Die App richtet sich an drei Hauptgruppen:
        </p>
        <ul className="info-list">
          <li>
            <strong>Dialektpfleger</strong> – Ältere Menschen, die den
            Dialekt aus ihrer Kindheit kennen und die Begriffe für die
            Nachwelt festhalten möchten. Die App bietet dafür eine einfache
            Eingabe mit großen Buttons und Sprachaufnahme.
          </li>
          <li>
            <strong>Dialekt-Interessierte</strong> – Schüler, Studenten und
            alle, die Wenigumstädter Mundart verstehen und lernen wollen. Mit
           Suchfunktion, Übersetzung und Audio-Aussprache.
          </li>
          <li>
            <strong>Sprachforscher</strong> – Wissenschaftler und
            Archivare, die Dialekte systematisch erfassen und analysieren.
            Strukturierte Datenfelder und Exportmöglichkeiten ermöglichen
            eine fundierte Auswertung.
          </li>
        </ul>
      </div>

    </div>
  )
}

export default InfoPage
