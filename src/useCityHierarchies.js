const peliasLogger = require('pelias-logger');
const logger = peliasLogger.get('wof-admin-lookup');
const _ = require('lodash');
var wofLookup = require('./pip/index');

var placeholder = require('pelias-placeholder');

var allowedPlaceTypes = ['continent', 'ocean', 'empire', 'country', 'dependency', 'marinearea', 'macroregion', 'region', 'macrocounty', 'county', 'locality', 'borough', 'localadmin'];

function searchPlaceholder( doc, meta, positionParams ) {
  if( doc.hasMeta(meta) ) {
    var metaValue = doc.getMeta(meta);
    
    if( metaValue != null && metaValue.length > 0 ) {
	 console.log("Meta: " + meta + ", Value: " + metaValue);
	
    	 placeholder.search( metaValue, null, function( results ) {
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

  searchPlaceholder( doc, 'recordPlaceholderInput', { inFront: true, beforeEnd: false });

  if( doc.hasMeta( 'wofIdFromFileName' ) ) {
    var wofId = doc.getMeta( 'wofIdFromFileName' );
    console.log("WOFIdFromFileName " + JSON.stringify( wofId, null, 2));
    var result = wofLookup.getWofData( wofId );
    console.log("Result " + JSON.stringify(result, null, 2));

    var params = { inFront: false, beforeEnd: true };
    
    if( result && allowedPlaceTypes.includes( result.Placetype.toLowerCase() ) ) {
      doc.addParent( result.Placetype, result.Name, result.Id.toString(), result.Abbrev, params );
    }
    
    var parents = _.compact(result.Hierarchy[0].map(id => wofLookup.getWofData( id )));
    console.log("Parents " + JSON.stringify(parents, null, 2));

    if( parents ) {
      parents.forEach( function( p ) {
       if( allowedPlaceTypes.includes( p.Placetype.toLowerCase() ) ) {
         doc.addParent( p.Placetype, p.Name, p.Id.toString(), result.Abbrev, params );
       }
      });
    }        

  }
}  

module.exports = useCityHierarchies;
