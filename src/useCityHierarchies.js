const peliasLogger = require('pelias-logger');
const logger = peliasLogger.get('wof-admin-lookup');

var placeholder = require('pelias-placeholder');

function addParentsFromMeta( doc, meta ) {
  if( doc.hasMeta(meta) ) {
    var metaValue = doc.getMeta(meta);
    
    placeholder.search( metaValue, 'locality', function( results ) {
        results.forEach( function( result ) {
           doc.addParent(result.placetype, result.name, result.id.toString(), result.abbr, true);
        });
    });
  }
}

function useCityHierarchies(result, doc) {

  addParentsFromMeta( doc, 'cityInFileName' );
  addParentsFromMeta( doc, 'cityInRecord' );
}  

module.exports = useCityHierarchies;
