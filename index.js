const timeZones = require("./data/timezones.json");

/**
 * Finds the canonical country name (matching the keys in `timeZones`)
 * that matches the provided name case-insensitively.
 *
 * @param {string} name - The country name to look up.
 * @returns {string|null} The canonical country name, or `null` if not found or `name` is falsy.
 */
function findCountry(name) {
  if (!name) return null;

  return Object.keys(timeZones).find(
    country => country.toLowerCase() === name.toLowerCase()
  ) || null;
}

/**
 * Resolves a country and city (case-insensitively) to their canonical names
 * and IANA time zone identifier.
 *
 * @param {string} country - The country name.
 * @param {string} city - The city name.
 * @returns {{ country: string, city: string, timeZone: string }|null}
 *   The resolved location, or `null` if the country or city is unknown.
 */
function findCity(country, city) {
  const actualCountry = findCountry(country);

  if (!actualCountry || !city) return null;

  const cities = timeZones[actualCountry];

  const actualCity = Object.keys(cities).find(
    name => name.toLowerCase() === city.toLowerCase()
  );

  if (!actualCity) return null;

  return {
    country: actualCountry,
    city: actualCity,
    timeZone: cities[actualCity]
  };
}

/**
 * Returns detailed time information for the given country and city,
 * including the formatted date/time, ISO timestamp, and long time zone name.
 *
 * @param {string} country - The country name.
 * @param {string} city - The city name.
 * @param {Object} [options={}] - Formatting options.
 * @param {Date|string|number} [options.date] - The date to format. Defaults to the current date/time.
 * @param {string} [options.locale="en-GB"] - The locale passed to `Intl.DateTimeFormat`.
 * @param {boolean} [options.hour12=false] - Whether to use a 12-hour clock.
 * @returns {{
 *   country: string,
 *   city: string,
 *   timeZone: string,
 *   dateTime: string,
 *   timestamp: string,
 *   timeZoneName: string
 * }}
 *   The location and formatted time information.
 * @throws {Error} If the country or city is unknown, or if `options.date` is invalid.
 */
function getTimeInfo(country, city, options = {}) {
  const location = findCity(country, city);

  if (!location) {
    throw new Error(`Unknown country or city: ${country}, ${city}`);
  }

  const now = options.date ? new Date(options.date) : new Date();

  if (Number.isNaN(now.getTime())) {
    throw new Error("Invalid date");
  }

  const formatOptions = {
    timeZone: location.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: options.hour12 ?? false
  };

  const formatter = new Intl.DateTimeFormat(
    options.locale || "en-GB",
    formatOptions
  );

  return {
    ...location,
    dateTime: formatter.format(now),
    timestamp: now.toISOString(),
    timeZoneName: new Intl.DateTimeFormat("en", {
      timeZone: location.timeZone,
      timeZoneName: "long"
    }).formatToParts(now)
      .find(part => part.type === "timeZoneName").value
  };
}

/**
 * Returns the formatted date/time string for the given country and city.
 *
 * @param {string} country - The country name.
 * @param {string} city - The city name.
 * @param {Object} [options={}] - Formatting options (same as {@link getTimeInfo}).
 * @param {Date|string|number} [options.date] - The date to format. Defaults to the current date/time.
 * @param {string} [options.locale="en-GB"] - The locale passed to `Intl.DateTimeFormat`.
 * @param {boolean} [options.hour12=false] - Whether to use a 12-hour clock.
 * @returns {string} The formatted date/time string.
 * @throws {Error} If the country or city is unknown, or if `options.date` is invalid.
 */
function getTime(country, city, options = {}) {
  return getTimeInfo(country, city, options).dateTime;
}

/**
 * Returns an array of all supported country names.
 *
 * @returns {string[]} The list of supported countries.
 */
function listCountries() {
  return Object.keys(timeZones);
}

/**
 * Returns an array of all supported city names for a given country.
 *
 * @param {string} country - The country name (case-insensitive).
 * @returns {string[]} The list of supported cities in that country.
 * @throws {Error} If the country is unknown.
 */
function listCities(country) {
  const actualCountry = findCountry(country);

  if (!actualCountry) {
    throw new Error(`Unknown country: ${country}`);
  }

  return Object.keys(timeZones[actualCountry]);
}

/**
 * Searches all supported cities whose name contains the given query
 * (case-insensitive substring match).
 *
 * @param {string} query - The search term.
 * @returns {Array<{ country: string, city: string, timeZone: string }>}
 *   The matching cities. Returns an empty array if `query` is empty.
 */
function searchCities(query) {
  const search = String(query).trim().toLowerCase();

  if (!search) return [];

  return Object.entries(timeZones).flatMap(
    ([country, cities]) =>
      Object.entries(cities)
        .filter(([city]) => city.toLowerCase().includes(search))
        .map(([city, timeZone]) => ({
          country,
          city,
          timeZone
        }))
  );
}

/**
 * Returns detailed time information for every supported city.
 *
 * @param {Object} [options={}] - Formatting options (same as {@link getTimeInfo}).
 * @param {Date|string|number} [options.date] - The date to format. Defaults to the current date/time.
 * @param {string} [options.locale="en-GB"] - The locale passed to `Intl.DateTimeFormat`.
 * @param {boolean} [options.hour12=false] - Whether to use a 12-hour clock.
 * @returns {Array<{
 *   country: string,
 *   city: string,
 *   timeZone: string,
 *   dateTime: string,
 *   timestamp: string,
 *   timeZoneName: string
 * }>}
 *   An array of time info objects, one per supported city.
 * @throws {Error} If `options.date` is invalid.
 */
function getAllTimes(options = {}) {
  const results = [];

  for (const [country, cities] of Object.entries(timeZones)) {
    for (const city of Object.keys(cities)) {
      results.push(getTimeInfo(country, city, options));
    }
  }

  return results;
}

/**
 * Returns the IANA time zone identifier of the current runtime
 * (e.g. `"Europe/London"`).
 *
 * @returns {string} The runtime's resolved time zone.
 */
function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

module.exports = {
  getTime,
  getTimeInfo,
  getAllTimes,
  listCountries,
  listCities,
  searchCities,
  getUserTimeZone,
  timeZones
};