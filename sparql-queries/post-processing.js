export default `
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

INSERT {
  GRAPH <${process.env.MU_APPLICATION_GRAPH}> {
    ?s a ext:RegistrationLodgingType .
  }
} WHERE {
  GRAPH <${process.env.MU_APPLICATION_GRAPH}> {
    ?s skos:inScheme ?scheme .
    VALUES ?scheme {
      <http://linked.toerismevlaanderen.be/id/conceptschemes/9d6a2610-5e27-4a26-93c8-d4a21e1e90e5>
    }
  }
}

; 

INSERT {
  GRAPH <${process.env.MU_APPLICATION_GRAPH}> {
    ?s a ext:RegistrationPublicationLodgingType .
  }
} WHERE {
  GRAPH <${process.env.MU_APPLICATION_GRAPH}> {
    ?s skos:inScheme ?scheme .
    VALUES ?scheme {
      <http://linked.toerismevlaanderen.be/id/conceptschemes/d59411cd-6d71-44d9-a0b3-cf958d89858d>
    }
  }
}

; 

INSERT {
  GRAPH <${process.env.MU_APPLICATION_GRAPH}> {
    ?s a ext:RegistrationStatus .
  }
} WHERE {
  GRAPH <${process.env.MU_APPLICATION_GRAPH}> {
    ?s skos:inScheme <http://linked.toerismevlaanderen.be/id/conceptschemes/48c5b233-44bc-49d1-93a7-b5005586baa2> .
  }
}
`
