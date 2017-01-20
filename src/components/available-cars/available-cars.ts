import { Component, Input, OnInit, OnChanges } from '@angular/core'
import * as SlidingMarker from 'marker-animate-unobtrusive'
import { CarService } from '../../providers/car/car'

@Component({
  template: '',
  selector: 'available-cars'
})
export class AvailableCarsDirective implements OnInit {
  @Input() map: google.maps.Map
  @Input() isPickupRequested: boolean
  
  public carMarkers: Array<any>
  
  constructor(public carService: CarService) {
    this.carMarkers = []
  }
  
  ngOnInit() {
    this.fetchAndRefreshCars()
  }
  
  ngOnChanges() {
    if (this.isPickupRequested) {
      this.removeCarMarkers()
    }
  }
  
  removeCarMarkers() {
     let numOfCars = this.carMarkers.length
     while (numOfCars--) {
       let car = this.carMarkers.pop()
       car.setMap(null)
     }
  }
  
  addCarMarker(car) {
    let carMarker = new SlidingMarker({
      map: this.map,
      position: new google.maps.LatLng(car.coord.lat, car.coord.lng),
      icon: '/assets/img/car-icon.png'
    })
    
    carMarker.setDuration(2000)
    carMarker.setEasing('linear')
    
    carMarker.set('id', car.id) // MVCObject()
    
    this.carMarkers.push(carMarker)
  }
  
  updateCarMarker(car) {
    for (let i = 0, numOfCars = this.carMarkers.length; i < numOfCars; i++) {
    // find car and update it
      if (this.carMarkers[i].id === car.id) {
        this.carMarkers[i].setPosition(new google.maps.LatLng(car.coord.lat, car.coord.lng))
        return
      }
    }
    
    // car does not exist in carMarkers
    this.addCarMarker(car)
  }
  
  fetchAndRefreshCars() {
    this.carService.getCars(9,9)
      .subscribe(carsData => {
        
        if (!this.isPickupRequested) {
          (<any> carsData).cars.forEach( car => {
            this.updateCarMarker(car)
          })
        }
      })
  }
}
