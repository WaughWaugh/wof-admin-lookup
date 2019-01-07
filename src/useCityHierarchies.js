const peliasLogger = require('pelias-logger');
const logger = peliasLogger.get('wof-admin-lookup');

var placeholder = require('pelias-placeholder');

function addParentsFromMeta( doc, meta, positionParams ) {
  if( doc.hasMeta(meta) ) {
    var metaValue = doc.getMeta(meta);
    
    placeholder.search( metaValue, 'locality', function( results ) {
        results.forEach( function( result ) {
           doc.addParent(result.placetype, result.name, result.id.toString(), result.abbr, positionParams);
        });
    });
  }
}

function useCityHierarchies(result, doc) {

  addParentsFromMeta( doc, 'cityInRecord', { inFront: true, beforeEnd: false } );
  addParentsFromMeta( doc, 'cityInFileName', { inFront: false, beforeEnd: true });
}  

module.exports = useCityHierarchies;
