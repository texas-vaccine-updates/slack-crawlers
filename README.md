# texas-vaccines

### Install
```bash
npm install
```

### Run
```bash
npm start
```

# HEB 

To consume HEBs COVID vaccine API send a `GET` request to:
```bash
https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json
```

Example response snippet:

```json
{
  "locations": [
    {
      "zip": "77055-6209",
      "url": null,
      "type": "store",
      "street": "9710 KATY FREEWAY",
      "storeNumber": 109,
      "state": "TX",
      "openTimeslots": 0,
      "openAppointmentSlots": 0,
      "name": "Bunker Hill H-E-B",
      "longitude": -95.53206,
      "latitude": 29.78485,
      "city": "HOUSTON"
    },
    {
      "zip": "77459-6931",
      "url": null,
      "type": "store",
      "street": "8900 HWY 6",
      "storeNumber": 110,
      "state": "TX",
      "openTimeslots": 0,
      "openAppointmentSlots": 0,
      "name": "Sienna Market H-E-B",
      "longitude": -95.53497,
      "latitude": 29.53928,
      "city": "MISSOURI CITY"
    },
  ],
}
```
