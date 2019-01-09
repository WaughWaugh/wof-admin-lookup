const peliasLogger = require('pelias-logger');
const logger = peliasLogger.get('wof-admin-lookup');

var placeholder = require('pelias-placeholder');

var allowedPlaceTypes = ['continent', 'ocean', 'empire', 'country', 'dependency', 'marinearea', 'macroregion', 'region', 'macrocounty', 'county', 'locality', 'borough', 'localadmin'];

function addParentsFromMeta( doc, meta, positionParams ) {
  if( doc.hasMeta(meta) ) {
    var metaValue = doc.getMeta(meta);
    
    if( metaValue != null && metaValue.length > 0 ) {
	 console.log("Meta: " + meta + ", Value: " + metaValue);
	
    	 placeholder.search( metaValue, 'locality', function( results ) {
        	results.forEach( function( result ) {
		   if( result != null && allowedPlaceTypes.includes( result.placetype.toLowerCase() ) ) {

		     console.log("Adding additional parent from city hierarchy");
		     console.log(JSON.stringify(result, null, 2));

	             doc.addParent(result.placetype, result.name, result.id.toString(), result.abbr, positionParams);
		   } else {
		     console.log("Rejected parent");
		     console.log(JSON.stringify( result, null, 2 ));
	 	   }
        	});
    	});
    }
  }
}

function useCityHierarchies(result, doc) {

  addParentsFromMeta( doc, 'cityInRecord', { inFront: true, beforeEnd: false } );
  addParentsFromMeta( doc, 'cityInFileName', { inFront: false, beforeEnd: true });
}  

module.exports = useCityHierarchies;
