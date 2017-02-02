import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'

@Injectable()
export class SimulateService {
  
  public directionsService: google.maps.DirectionsService
  public myRoute: any
  public myRouteIndex: number

  constructor() {
    this.directionsService = new google.maps.DirectionsService()
  }
  
  riderPickedUp() {
    // simulate rider picked up after 1 second
    return Observable.timer(1000)
  }
  
  riderDroppedOff() {
    // simulate rider dropped off after 1 second
    return Observable.timer(1000)
  }
  
  getPickupCar() {
    return Observable.create(observable => {
      
      let car = this.myRoute[this.myRouteIndex]
      observable.next(car)
      this.myRouteIndex++
      
    })
  }
  
  getSegmentedDirections(directions) {
    let route = directions.routes[0]
    let legs = route.legs
    let path = []
    let increments = []
    let duration = 0
    
    let numOfLegs = legs.length
    
    // work backwards though each leg in directions route
    while (numOfLegs--) {
      
      let leg = legs[numOfLegs]
      let steps = leg.steps
      let numOfSteps = steps.length
      
      while(numOfSteps--) {
        
        let step = steps[numOfSteps]
        let points = step.path
        let numOfPoints = points.length
        
        duration += step.duration.value
        
        while(numOfPoints--) {
          
          let point = points[numOfPoints]
          
          path.push(point)
          
          increments.unshift({
            position: point,  // car position 
            time: duration,  // time left before arrival
            path: path.slice(0) // clone array to prevent referencing final path array
          })
        }
      }
    }
    
    return increments
  }
  
  calculateRoute(start, end) {
    return Observable.create(observable => {
      this.directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          observable.next(response)
        }
        else {
          observable.error(status)
        }
      })
    })
  }
  
  simulateRoute(start, end) {
    return Observable.create(observable => {
      this.calculateRoute(start, end).subscribe(directions => {
        // get route path
        this.myRoute = this.getSegmentedDirections(directions)
        // return pickup car
        this.getPickupCar().subscribe(car => {
          observable.next(car) // first increment in car path
        })
      })
    })
  }
  
  findPickupCar(pickupLocation) {
    this.myRouteIndex = 0
    let car = this.cars1.cars[0] // pick one of the cars to simulate pickupLocation
    let start = new google.maps.LatLng(car.coord.lat, car.coord.lng)
    let end = pickupLocation
    
    return this.simulateRoute(start, end)
  }
  
  dropoffPickupCar(pickupLocation, dropoffLocation) {
    return this.simulateRoute(pickupLocation, dropoffLocation)
  }

  getCars(lat, lng) {
    return Observable.create(observer => {
      let carData = this.cars[this.carIndex]
      
      this.carIndex++
      
      if (this.carIndex > this.cars.length-1) {
      this.carIndex = 0
      }

      observer.next(carData)
    })
  }
  
  private carIndex: number = 0
  
  private cars1 = {
    cars: [{
      id: 1,
      coord: {
        lat: -20.297618,
        lng: -40.295777
      }
    },
    {
      id: 2,
      coord: {
        lat: -20.297600,
        lng: -40.295720
      }
    }
  ]
 }
 
 private cars2 = {
    cars: [{
      id: 1,
      coord: {
        lat: -20.297700,
        lng: -40.295790
      }
    },
    {
      id: 2,
      coord: {
        lat: -20.297650,
        lng: -40.295500
      }
    }
  ]
 }
 
 private cars3 = {
    cars: [{
      id: 1,
      coord: {
        lat: -20.295512,
        lng: -40.295080
      }
    },
    {
      id: 2,
      coord: {
        lat: -20.297180,
        lng: -40.295600
      }
    }
  ]
 }
 
 private cars4 = {
    cars: [{
      id: 1,
      coord: {
        lat: -20.296512,
        lng: -40.295480
      }
    },
    {
      id: 2,
      coord: {
        lat: -20.297580,
        lng: -40.295800
      }
    }
  ]
 }
 
 private cars5 = {
    cars: [{
      id: 1,
      coord: {
        lat: -20.297630,
        lng: -40.295750
      }
    },
    {
      id: 2,
      coord: {
        lat: -20.297680,
        lng: -40.294000
      }
    }
  ]
 }
  
 private cars: Array<any> = [this.cars3, this.cars4, this.cars5]
  
}

