import { LoadingController, NavController } from 'ionic-angular'
import { Component, OnInit, Input } from '@angular/core'
import { Geolocation } from 'ionic-native'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'map',
  templateUrl: 'map.html',
})
export class MapDirective implements OnInit {
  
  @Input() isPickupRequested: boolean
  @Input() destination: string
  
  public map: google.maps.Map
  public isMapIdle: boolean
  public currentLocation: google.maps.LatLng
  
  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController
  ) {}
  
  ngOnInit() {
    this.map = this.createMap()
    this.addMapEventListeners()
    
    this.getCurrentLocation().subscribe(location => {
      this.centerLocation(location)
    })
  }
  
  updatePickupLocation(location) {
    this.currentLocation = location
    this.centerLocation(location)
  }
  
  addMapEventListeners() {
    
    google.maps.event.addListener(this.map, 'dragstart', () => {
      this.isMapIdle = false
    })
    google.maps.event.addListener(this.map, 'idle', () => {
      this.isMapIdle = true
    })
    
  }
  
  getCurrentLocation(): Observable<google.maps.LatLng> {
    let loading = this.loadingCtrl.create({
      content: 'Locating...'
    })
    loading.present(loading)
    let options = {timeout: 10000, enableHighAccuracy: true}
    let locationObs = Observable.create(observable => {
      Geolocation.getCurrentPosition(options)
        .then(resp => {
          let lat = resp.coords.latitude
          let lng = resp.coords.longitude
          let location = new google.maps.LatLng(lat, lng)
          console.log('Geolocation: ' + location)
          observable.next(location)
          loading.dismiss()
        },
        (err) => {
          console.log('Geolocation err: ' + err)
          loading.dismiss()
        })
    })
    
    return locationObs
  }
  
  createMap(location = new google.maps.LatLng(-20.297618, -40.295777)) {
    let mapOptions = {
      center: location,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    
    let mapEl = document.getElementById('map')
    let map = new google.maps.Map(mapEl, mapOptions)
    
    return map
  }
  
  centerLocation(location) {
    if (location) {
      this.map.panTo(location)
    }
    else {
      this.getCurrentLocation().subscribe(currentLocation => {
        this.map.panTo(currentLocation)
      })
    }
  }
}
