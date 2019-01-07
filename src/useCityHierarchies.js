const peliasLogger = require('pelias-logger');
const logger = peliasLogger.get('wof-admin-lookup');

var placeholder = require('pelias-placeholder');

function addParentsFromMeta( doc, meta ) {
  if( doc.hasMeta(meta) ) {
    var metaValue = doc.getMeta(meta);
    
    if( metaValue != null && metaValue.length > 0 ) {
	 console.log("Meta: " + meta + ", Value: " + metaValue);
	
    	 placeholder.search( metaValue, 'locality', function( results ) {
		console.log("Adding additional parents from city hierarchy");
		console.log(JSON.stringify(results, null, 2));
        	results.forEach( function( result ) {
		   if( result != null ) {
	             doc.addParent(result.placetype, result.name, result.id.toString(), result.abbr, true);
		   }
        	});
    	});
    }
  }
}

function useCityHierarchies(result, doc) {

  addParentsFromMeta( doc, 'cityInFileName' );
  addParentsFromMeta( doc, 'cityInRecord' );
}  

module.exports = useCityHierarchies;
