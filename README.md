# TimeKit

A lightweight Node.js library for getting the current time for countries and cities around the world, with support for time zones, custom dates, and locale-aware formatting.

## Features

- 🌍 Get current time for any supported country and city
- 🕒 Accurate time zone handling via `Intl.DateTimeFormat`
- 📅 Pass a custom date for historical or future time lookups
- 🌐 Locale-aware formatting (defaults to `en-GB`)
- 🔍 Search cities by partial name
- 🏙️ List all supported countries and cities
- ⏰ Get the user's local time zone
- 📦 Zero dependencies — only uses built-in `Intl`

## Installation

```bash
npm install @cabdi_waaxid/timekit
```

## Usage

```js
const timekit = require("@cabdi_waaxid/timekit");
```

### Get the current time

```js
const time = timekit.getTime("Japan", "Tokyo");
console.log(time); // e.g. "17/10/2026, 13:18:31"

const somaliaTime = timekit.getTime("Somalia", "Mogadishu");
console.log(somaliaTime); // e.g. "17/10/2026, 13:21:22"
```

### Get detailed time info

```js
const info = timekit.getTimeInfo("France", "Paris");
console.log(info);
/*
{
  country: 'France',
  city: 'Paris',
  timeZone: 'Europe/Paris',
  dateTime: '17/10/2026, 12:22:28',
  timestamp: '2026-10-17T10:22:28.770Z',
  timeZoneName: 'Central European Summer Time'
}
*/
```

### Options

You can pass an options object as the third argument to `getTime` and `getTimeInfo`:

| Option    | Type      | Default   | Description                          |
|-----------|-----------|-----------|--------------------------------------|
| `date`    | Date \| string \| number | `new Date()` | The date to format. |
| `locale`  | string    | `"en-GB"` | The locale used by `Intl.DateTimeFormat`. |
| `hour12`  | boolean   | `false`   | Whether to use 12-hour clock. |

```js
timekit.getTime("United States", "New York City", {
  date: new Date(),
  locale: "en-US",
  hour12: true
});
// e.g. "'10/17/2026, 06:28:50 AM"
```

### List all countries

```js
const countries = timekit.listCountries();
console.log(countries); // ["Afghanistan", "Albania", ...]
```

### List cities in a country

```js
const cities = timekit.listCities("Somalia");
console.log(cities); // ["Afgooye", "Baardheere", "Baidoa", ...]
```

### Search cities by name

```js
const results = timekit.searchCities("mog");
console.log(results);
/*
[
  { country: "Somalia", city: "Mogadishu", timeZone: "Africa/Mogadishu" }
]
*/
```

### Get all times at once

```js
const all = timekit.getAllTimes();
console.log(all.length); // Number of supported city entries
```

### Get the user's local time zone

```js
const tz = timekit.getUserTimeZone();
console.log(tz); // e.g. "Europe/London"
```

## API Reference

### `getTime(country, city, options?)`

Returns the formatted date/time string for the given location.

- **Throws** if the country or city is unknown, or if the provided `date` is invalid.

### `getTimeInfo(country, city, options?)`

Returns an object with location, formatted date/time, ISO timestamp, and time zone name.

- **Throws** if the country or city is unknown, or if the provided `date` is invalid.

### `getAllTimes(options?)`

Returns an array of `getTimeInfo` results for every supported city.

### `listCountries()`

Returns an array of all supported country names.

### `listCities(country)`

Returns an array of all supported cities for a country.

- **Throws** if the country is unknown.

### `searchCities(query)`

Returns an array of `{ country, city, timeZone }` objects whose city name contains the query (case-insensitive). Returns an empty array if the query is empty.

### `getUserTimeZone()`

Returns the runtime's resolved time zone (e.g. `"Europe/London"`).

### `timeZones`

The raw data object mapping countries → cities → IANA time zone identifiers.

## Data

The time zone data lives in `data/timezones.json` and is bundled with the package. It maps each supported country to its cities, and each city to an IANA time zone identifier (e.g. `"Asia/Tokyo"`).

## Error Handling

```js
try {
  timekit.getTime("Atlantis", "Atlantis City");
} catch (err) {
  console.error(err.message);
  // "Unknown country or city: Atlantis, Atlantis City"
}
```

```js
try {
  timekit.getTime("Japan", "Tokyo", { date: "not-a-date" });
} catch (err) {
  console.error(err.message);
  // "Invalid date"
}
```

## Requirements

- Node.js 14+ (requires `Intl.DateTimeFormat` with time zone support)
- CommonJS

## License

MIT

## Contributing

Contributions, issues, and feature requests are welcome. Please open an issue or submit a pull request.

## Author

Cabdi Waaxid Sicid

---

Made with ❤️ for developers who need world time, fast.