"use strict";
const STORAGE_KEY = "northStarBakeryFavoritesV1";
const bakeryProducts = [
  {id:"artisan-bread", name:"Artisan Breads", detail:"Rustic and seasonal loaves"},
  {id:"pastries", name:"Pastries", detail:"Flaky morning treats"},
  {id:"cakes", name:"Cakes and Celebrations", detail:"Special-occasion cakes"},
  {id:"signature-loaf", name:"Signature Loaf", detail:"A handcrafted bakery favorite"}
];
let favoriteIds = [];
function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(id => bakeryProducts.some(product => product.id === id)) : [];
  } catch (error) { return []; }
}
function saveFavorites() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds)); return true; }
  catch (error) { return false; }
}
function renderFavorites() {
  const container = document.getElementById("favorite-products");
  const list = document.getElementById("favorites-list");
  if (!container || !list) return;
  container.replaceChildren(); list.replaceChildren();
  bakeryProducts.forEach(product => {
    const item = document.createElement("div"); item.className = "favorite-option";
    const title = document.createElement("h3"); title.textContent = product.name;
    const description = document.createElement("p"); description.textContent = product.detail;
    const button = document.createElement("button"); button.type = "button";
    const selected = favoriteIds.includes(product.id);
    button.textContent = selected ? "Remove favorite" : "Save favorite";
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute("aria-label", `${selected ? "Remove" : "Save"} ${product.name} ${selected ? "from" : "to"} favorites`);
    button.addEventListener("click", () => toggleFavorite(product.id));
    item.append(title, description, button); container.append(item);
  });
  favoriteIds.forEach(id => {
    const product = bakeryProducts.find(entry => entry.id === id);
    if (!product) return;
    const li = document.createElement("li"); li.textContent = product.name; list.append(li);
  });
  document.getElementById("favorite-count").textContent = String(favoriteIds.length);
  document.getElementById("favorite-summary").textContent = favoriteIds.length ? "Your choices are saved in this browser:" : "No favorites saved yet.";
  document.getElementById("clear-favorites").disabled = favoriteIds.length === 0;
}
function toggleFavorite(id) {
  favoriteIds = favoriteIds.includes(id) ? favoriteIds.filter(item => item !== id) : [...favoriteIds, id];
  const saved = saveFavorites(); renderFavorites();
  document.getElementById("favorites-status").textContent = saved ? "Favorites updated and saved." : "Favorites updated, but browser storage is unavailable.";
}
function initFavorites() {
  if (!document.getElementById("favorite-products")) return;
  favoriteIds = loadFavorites(); renderFavorites();
  document.getElementById("clear-favorites").addEventListener("click", () => {
    favoriteIds = []; saveFavorites(); renderFavorites();
    document.getElementById("favorites-status").textContent = "Your favorites have been cleared.";
  });
}
const validationRules = [
  {id:"full-name", validate:value => value.trim().length >= 2, message:"Enter your full name (at least 2 characters)."},
  {id:"email", validate:value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message:"Enter a valid email address, such as name@example.com."},
  {id:"request-type", validate:value => value !== "", message:"Choose a request type."},
  {id:"item-details", validate:value => value.trim().length >= 5, message:"Enter at least 5 characters about your request."}
];
function validateField(rule) {
  const field = document.getElementById(rule.id);
  const error = document.getElementById(`${rule.id}-error`);
  const valid = rule.validate(field.value);
  error.textContent = valid ? "" : rule.message;
  field.setAttribute("aria-invalid", String(!valid));
  if (!valid) field.setAttribute("aria-describedby", error.id);
  else field.removeAttribute("aria-describedby");
  return valid;
}
function initForm() {
  const form = document.getElementById("preorder-form"); if (!form) return;
  validationRules.forEach(rule => {
    const field = document.getElementById(rule.id);
    field.addEventListener("input", () => { validateField(rule); document.getElementById("form-status").textContent = ""; });
    field.addEventListener("change", () => validateField(rule));
  });
  form.addEventListener("submit", event => {
    event.preventDefault(); // Demonstration form: never sends personal data.
    const results = validationRules.map(validateField);
    const status = document.getElementById("form-status");
    if (results.every(Boolean)) {
      status.textContent = "Your request details look valid. This is a demonstration form; nothing was sent.";
    } else {
      status.textContent = "Please correct the highlighted fields before continuing.";
      document.getElementById(validationRules[results.indexOf(false)].id).focus();
    }
  });
}
document.addEventListener("DOMContentLoaded", () => { initFavorites(); initForm(); });
