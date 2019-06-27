"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supplantStr = supplantStr;
exports.randomNumber = randomNumber;

function supplantStr(str, o) {
  try {
    return str.replace(/{([^{}]*)}/g, function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  } catch (e) {
    return str;
  }
}

function randomNumber(min, max) {
  return parseInt(Math.random() * (max - min) + min, 0);
}