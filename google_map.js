    $(document).ready(function(){  
      var map, places;
      var markers = [];
      var autocomplete;
      var countryRestrict = { 'country': 'in' };
      var countries = {
        'au': {
          center: new google.maps.LatLng(-25.3, 133.8),
          zoom: 6
        },
        'br': {
          center: new google.maps.LatLng(-14.2, -51.9),
          zoom: 3
        },
        'ca': {
          center: new google.maps.LatLng(62, -110.0),
          zoom: 3
        },
        'fr': {
          center: new google.maps.LatLng(46.2, 2.2),
          zoom: 5
        },
        'de': {
          center: new google.maps.LatLng(51.2, 10.4),
          zoom: 5
        },
        'mx': {
          center: new google.maps.LatLng(23.6, -102.5),
          zoom: 4
        },
        'nz': {
          center: new google.maps.LatLng(-40.9, 174.9),
          zoom: 5
        },
        'it': {
            center: new google.maps.LatLng(41.9, 12.6),
            zoom: 5
        },
        'za': {
          center: new google.maps.LatLng(-30.6, 22.9),
          zoom: 5
        },
        'es': {
          center: new google.maps.LatLng(40.5, -3.7),
          zoom: 5
        },
        'pt': {
            center: new google.maps.LatLng(39.4, -8.2),
            zoom: 6
        },
        'us': {
          center: new google.maps.LatLng(37.1, -95.7),
          zoom: 3
        },
        'uk': {
          center: new google.maps.LatLng(54.8, -4.6),
          zoom: 5
        },
        'in': {
          center: new google.maps.LatLng(21, 78),
          zoom: 3
        }
      };
      
      function initialize() {
        var myConditions = {
          zoom: countries['in'].zoom,
          center: countries['in'].center,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          streetViewControl: false
        };
        map = new google.maps.Map(document.getElementById('googleMap'), myConditions);

        autocomplete = new google.maps.places.Autocomplete((document.getElementById('map_canvas')),
        {
          types: ['(cities)'],
          componentRestrictions: countryRestrict
        });
        places = new google.maps.places.PlacesService(map);
        google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
        
        google.maps.event.addDomListener(document.getElementById('myOption'), 'change', setAutocompleteCountry);
      }

      function onPlaceChanged() {
        var place = autocomplete.getPlace();
        if (place.geometry) {
          // map.panTo(place.geometry.location);
          var latitude = place.geometry.location.A;
          var longitude = place.geometry.location.F;
          // map.setZoom(15);
          search();
          var geocoder = new google.maps.Geocoder();
          var myLatlng = new google.maps.LatLng(21, 78);
          var infowindow = new google.maps.InfoWindow();
          var marker;
          var MyCenter = new google.maps.LatLng(latitude,longitude);
          var mapProp = {
                  center:MyCenter,
                  zoom:12,
                  map: map,
                  draggable: true ,
                  mapTypeId:google.maps.MapTypeId.ROADMAP
                };

          var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
          var marker=new google.maps.Marker({
                position:MyCenter,
                draggable: true ,
              });
              marker.setMap(map);
          google.maps.event.addListener(marker,'click',function() {
            map.setZoom(9);
            map.setCenter(marker.getPosition());
          });

          geocoder.geocode({'latLng': MyCenter }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                console.log(results[0].formatted_address)
                $('#latitude,#longitude').show();
                // $('#updated_address').val(results[0].formatted_address);
                $('#latitude').val(marker.getPosition().lat());
                $('#longitude').val(marker.getPosition().lng());
                infowindow.setContent(results[0].formatted_address);
                document.getElementById("updated_address").innerHTML = results[0].formatted_address;
                infowindow.open(map, marker);
              }
            }
          });

          google.maps.event.addListener(marker, 'dragend', function() {
            geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  console.log(results[0].formatted_address)
                  // $('#updated_address').val(results[0].formatted_address);
                  $('#latitude').val(marker.getPosition().lat());
                  $('#longitude').val(marker.getPosition().lng());
                  infowindow.setContent(results[0].formatted_address);
                  document.getElementById("updated_address").innerHTML = results[0].formatted_address;
                  infowindow.open(map, marker);
                }
              }
            });
          });
        } else {
        document.getElementById('autocomplete').placeholder = 'Enter a city';
        }
      }

      function search() {
        var search = {
          bounds: map.getBounds(),
          types: ['lodging']
        };
      }

      function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          if (markers[i]) {
            markers[i].setMap(null);
          }
        }
        markers = [];
      }

      function setAutocompleteCountry() {
        var country = document.getElementById('myOption').value;
        autocomplete.setComponentRestrictions({ 'country': country });
        map.setCenter(countries[country].center);
        map.setZoom(countries[country].zoom);
        clearMarkers();
      }

      function dropMarker(i) {
        return function() {
          markers[i].setMap(map);
        };
      }
              
      google.maps.event.addDomListener(window, 'load', initialize);
      google.maps.event.addDomListener(window, 'load', codeAddress);
    })
    
    function codeAddress() {
        $('#map_canvas').val("")
        var add = document.getElementById("myOption");
        var address = add.options[add.selectedIndex].text;
        var geocoder = new google.maps.Geocoder();
        var location='';
          geocoder.geocode( { 'address': address}, function(results, status) {
            location = results[0].geometry.location;

            var myLatlng = new google.maps.LatLng(21, 78);
            var infowindow = new google.maps.InfoWindow();
            var marker;
            var MyCenter = new google.maps.LatLng(location.lat(),location.lng());

            var mapProp = {
              center:MyCenter,
              zoom:6,
              map: map,
              draggable: true ,
              mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
            var marker=new google.maps.Marker({
              position:MyCenter,
              draggable: true ,
            });
            marker.setMap(map);
            google.maps.event.addListener(marker,'click',function() {
            map.setZoom(9);
            map.setCenter(marker.getPosition());
          });  
         
          geocoder.geocode({'latLng': MyCenter }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                console.log(results[0].formatted_address)
                $('#latitude,#longitude').show();
                // $('#updated_address').val(results[0].formatted_address);
                $('#latitude').val(marker.getPosition().lat());
                $('#longitude').val(marker.getPosition().lng());
                infowindow.setContent(results[0].formatted_address);
                document.getElementById("updated_address").innerHTML = results[0].formatted_address;
                infowindow.open(map, marker);
              }
            }
          });

          google.maps.event.addListener(marker, 'dragend', function() {
            geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  console.log(results[0].formatted_address)
                  // $('#updated_address').val(results[0].formatted_address);
                  $('#latitude').val(marker.getPosition().lat());
                  $('#longitude').val(marker.getPosition().lng());
                  infowindow.setContent(results[0].formatted_address);
                  document.getElementById("updated_address").innerHTML = results[0].formatted_address;
                  infowindow.open(map, marker);
                }
              }
            });
          });

        });
    }

